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
      
      // Get the current URL and search params
      const url = new URL(window.location.href);
      const accessToken = url.searchParams.get('access_token');
      const refreshToken = url.searchParams.get('refresh_token');
      const type = url.searchParams.get('type');
      
      console.log('Verification URL params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
      
      if (accessToken && refreshToken) {
        console.log('Processing verification with tokens...');
        
        // Set the session with the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        console.log('Session set result:', { data, error });
        
        if (error) {
          console.error('Error setting session:', error);
          setVerificationStatus('error');
          setErrorMessage(error.message);
          return;
        }
        
        if (data.session && data.user) {
          console.log('Session set successfully, user:', data.user.email);
          
          // Check if email is verified
          if (data.user.email_confirmed_at) {
            console.log('Email verified successfully, redirecting to dashboard...');
            setVerificationStatus('success');
            
            // Refresh the session to ensure it's properly established
            await supabase.auth.refreshSession();
            
            // Show success toast
            toast({
              title: "Email verified successfully!",
              description: "Welcome to CentraBudget! Redirecting to dashboard...",
            });
            
            // Redirect immediately to dashboard
            navigate('/dashboard');
          } else {
            console.log('Email not yet verified, checking status...');
            setVerificationStatus('pending');
          }
        } else {
          console.log('No session or user in response');
          setVerificationStatus('error');
          setErrorMessage('Verification failed. Please try again.');
        }
      } else {
        console.log('No tokens in URL, checking current auth state...');
        
        // Check if user is already authenticated and verified
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          if (user.email_confirmed_at) {
            console.log('User already verified, redirecting to dashboard...');
            setVerificationStatus('success');
            
            toast({
              title: "Already verified!",
              description: "Redirecting to dashboard...",
            });
            
            // Redirect immediately
            navigate('/dashboard');
          } else {
            console.log('User not verified yet');
            setVerificationStatus('pending');
          }
        } else {
          console.log('No user found, showing pending state');
          setVerificationStatus('pending');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setErrorMessage('An unexpected error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleVerification();
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
          emailRedirectTo: `${window.location.origin}/verify-email`,
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
