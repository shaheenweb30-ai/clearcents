import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "./AuthLayout";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

export const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'checking' | 'success' | 'error' | 'pending'>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const handleVerification = async () => {
    try {
      setLoading(true);
      setVerificationStatus('checking');
      
      // Get the current URL and extract tokens from hash fragment
      const url = new URL(window.location.href);
      const hash = window.location.hash;
      
      // Parse hash fragment for tokens (Supabase sends tokens in hash, not query params)
      const hashParams = new URLSearchParams(hash.substring(1)); // Remove the # and parse
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      console.log('🔍 DEBUG: Verification URL params:', { 
        accessToken: !!accessToken, 
        refreshToken: !!refreshToken, 
        type,
        fullUrl: window.location.href,
        hash: hash,
        hashParams: Object.fromEntries(hashParams.entries())
      });
      
      if (accessToken && refreshToken) {
        console.log('🔍 DEBUG: Processing verification with tokens...');
        
        // Set the session with the tokens from the hash
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        console.log('🔍 DEBUG: Session set result:', { 
          data: !!data, 
          error: !!error, 
          session: !!data?.session,
          user: !!data?.user,
          userEmail: data?.user?.email,
          emailConfirmed: data?.user?.email_confirmed_at
        });
        
        if (error) {
          console.error('❌ ERROR: Setting session failed:', error);
          setVerificationStatus('error');
          setErrorMessage(error.message);
          return;
        }
        
        if (data.session && data.user) {
          console.log('✅ SUCCESS: Session set successfully, user:', data.user.email);
          
          // Check if email is verified
          if (data.user.email_confirmed_at) {
            console.log('✅ SUCCESS: Email verified successfully, redirecting to dashboard...');
            setVerificationStatus('success');
            
            // Force a complete session refresh
            console.log('🔄 DEBUG: Refreshing session...');
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            console.log('🔄 DEBUG: Session refresh result:', { 
              success: !refreshError, 
              error: refreshError?.message 
            });
            
            // Double-check the user is still authenticated
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            console.log('🔍 DEBUG: Current user after refresh:', { 
              authenticated: !!currentUser, 
              email: currentUser?.email,
              emailConfirmed: currentUser?.email_confirmed_at
            });
            
            if (currentUser && currentUser.email_confirmed_at) {
              console.log('✅ SUCCESS: User confirmed authenticated, redirecting...');
              
              // Force refresh the page to ensure AuthContext is updated
              console.log('🔄 DEBUG: Forcing page refresh to update auth context...');
              
              // Show success toast
              toast({
                title: "Email verified successfully!",
                description: "Welcome to CentraBudget! Redirecting to dashboard...",
              });
              
              // Force page refresh then redirect
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 1000);
            } else {
              console.error('❌ ERROR: User not properly authenticated after refresh');
              setVerificationStatus('error');
              setErrorMessage('Authentication failed after verification. Please try signing in.');
            }
          } else {
            console.log('⚠️ WARNING: Email not yet verified, checking status...');
            setVerificationStatus('pending');
          }
        } else {
          console.log('❌ ERROR: No session or user in response');
          setVerificationStatus('error');
          setErrorMessage('Verification failed. Please try again.');
        }
      } else {
        console.log('🔍 DEBUG: No tokens in hash, checking current auth state...');
        
        // Check if user is already authenticated and verified
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          if (user.email_confirmed_at) {
            console.log('✅ SUCCESS: User already verified, redirecting to dashboard...');
            setVerificationStatus('success');
            
            toast({
              title: "Already verified!",
              description: "Redirecting to dashboard...",
            });
            
            // Force redirect
            console.log('🚀 DEBUG: Redirecting to dashboard...');
            window.location.href = '/dashboard';
          } else {
            console.log('⚠️ WARNING: User not verified yet');
            setVerificationStatus('pending');
          }
        } else {
          console.log('🔍 DEBUG: No user found, showing pending state');
          setVerificationStatus('pending');
        }
      }
    } catch (error) {
      console.error('❌ ERROR: Verification error:', error);
      setVerificationStatus('error');
      setErrorMessage('An unexpected error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure hash is available
    const timer = setTimeout(() => {
      handleVerification();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate, toast]);

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      
      // Get the email from localStorage or prompt user
      const email = localStorage.getItem('lastEmail');
      
      if (!email) {
        setErrorMessage('Please enter your email address to resend verification.');
        return;
      }

      console.log('Resending verification email to:', email);
      console.log('Redirect URL:', `${window.location.origin}/verify-email`);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: 'https://www.centrabudget.com/verify-email',
        }
      });

      console.log('Resend response:', { error });

      if (error) {
        console.error('Resend error:', error);
        setErrorMessage(error.message);
        toast({
          title: "Resend failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Verification email resent successfully');
        toast({
          title: "Verification email sent",
          description: "Please check your inbox and spam folder.",
        });
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setErrorMessage('Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerification = async () => {
    try {
      setLoading(true);
      console.log('🔍 DEBUG: Attempting manual verification...');
      
      // Try to get the current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔍 DEBUG: Current user:', { 
        exists: !!user, 
        email: user?.email,
        emailConfirmed: user?.email_confirmed_at 
      });
      
      if (user && user.email_confirmed_at) {
        console.log('✅ SUCCESS: User is verified, redirecting...');
        setVerificationStatus('success');
        
        toast({
          title: "Verification successful!",
          description: "Redirecting to dashboard...",
        });
        
        // Force redirect
        window.location.href = '/dashboard';
      } else {
        console.log('⚠️ WARNING: User not verified or not found');
        setVerificationStatus('pending');
        
        toast({
          title: "Verification pending",
          description: "Please check your email and click the verification link.",
        });
      }
    } catch (error) {
      console.error('❌ ERROR: Manual verification failed:', error);
      setVerificationStatus('error');
      setErrorMessage('Manual verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectVerification = async () => {
    try {
      setLoading(true);
      console.log('🔍 DEBUG: Attempting direct email verification check...');
      
      // Get the email from localStorage or prompt user
      const email = localStorage.getItem('lastEmail');
      
      if (!email) {
        setErrorMessage('No email found. Please enter your email address.');
        return;
      }
      
      console.log('🔍 DEBUG: Checking verification for email:', email);
      
      // Try to sign in with the email to check if it's verified
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: 'https://www.centrabudget.com/verify-email',
        }
      });
      
      if (error) {
        console.error('❌ ERROR: OTP signin failed:', error);
        
        // If OTP fails, try to check the user directly
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.email === email && user.email_confirmed_at) {
          console.log('✅ SUCCESS: User is verified via direct check!');
          setVerificationStatus('success');
          
          toast({
            title: "Email verified!",
            description: "Redirecting to dashboard...",
          });
          
          // Force redirect
          window.location.href = '/dashboard';
          return;
        }
        
        setErrorMessage('Could not verify email. Please try signing in directly.');
        return;
      }
      
      console.log('✅ SUCCESS: OTP sent, user should check email');
      toast({
        title: "Check your email",
        description: "We've sent you a new verification link.",
      });
      
    } catch (error) {
      console.error('❌ ERROR: Direct verification failed:', error);
      setErrorMessage('Direct verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Verifying your email...
          </h1>
          <p className="text-muted-foreground">
            Please wait while we verify your email address.
          </p>
        </div>
      );
    }

    switch (verificationStatus) {
      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Email verified successfully!
            </h1>
            <p className="text-muted-foreground">
              Welcome to CentraBudget! You'll be redirected to the dashboard shortly.
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Verification failed
            </h1>
            <p className="text-muted-foreground">
              {errorMessage || 'There was an error verifying your email address.'}
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleVerification}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                variant="outline"
                className="w-full"
              >
                Back to Sign Up
              </Button>
            </div>
          </div>
        );

      case 'pending':
      default:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Verify your email
            </h1>
            <p className="text-muted-foreground">
              We've sent a verification link to your email address. Please check your inbox and click the verification link.
            </p>
            
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend verification email'
                )}
              </Button>
              
              <Button
                onClick={handleManualVerification}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  '🔄 Check Verification Status'
                )}
              </Button>
              
              <Button
                onClick={handleDirectVerification}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  '📧 Verify Email Directly'
                )}
              </Button>
              
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Already verified?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary hover:underline underline-offset-2"
                  onClick={() => navigate('/login')}
                >
                  Sign in here
                </Button>
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <AuthLayout>
      <div className="relative">
        <div className="absolute -z-10 -inset-6">
          <div className="absolute top-0 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse" />
          <div className="absolute bottom-0 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-bounce" />
          <div className="absolute top-1/2 right-1/3 w-14 h-14 bg-green-200 rounded-full opacity-20 animate-ping" />
        </div>

        <Card className="rounded-2xl border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <Logo size="md" />
            </div>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};
