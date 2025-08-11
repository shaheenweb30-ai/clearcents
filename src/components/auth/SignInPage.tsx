import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [error, setError] = useState<string>("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    
    setStep('password');
    setError("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Sign in error:", error);
        setError(error.message);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Sign in successful:", data);
        const session = data.session;
        const emailVerified = session?.user?.email_confirmed_at || session?.user?.confirmed_at;
        if (!emailVerified) {
          toast({
            title: "Please verify your email",
            description: "Check your inbox for the verification link.",
          });
          try { localStorage.setItem('lastEmail', formData.email); } catch {}
          await supabase.auth.signOut();
          navigate("/verify-email");
          return;
        }
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      console.log('🔍 DEBUG: Starting Google OAuth sign in...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://www.centrabudget.com/dashboard',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // You can add additional scopes if needed
            scope: 'email profile'
          }
        }
      });

      if (error) {
        console.error('Google OAuth sign in error:', error);
        setError(error.message);
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Google OAuth sign in initiated:', data);
        
        // Show success message
        toast({
          title: "Google sign in initiated",
          description: "Redirecting to Google authentication...",
        });
      }
    } catch (error) {
      console.error('Google OAuth sign in error:', error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Google sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple' | 'microsoft') => {
    setLoading(true);
    setError("");
    
    try {
      console.log(`🔍 DEBUG: Starting ${provider} OAuth sign in...`);
      
      // Map provider names to Supabase provider names
      const supabaseProvider = provider === 'apple' ? 'apple' : 
                              provider === 'microsoft' ? 'azure' : 
                              provider;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: supabaseProvider as any,
        options: {
          redirectTo: 'https://www.centrabudget.com/dashboard',
          queryParams: {
            // For Google OAuth, you can add additional scopes if needed
            ...(provider === 'google' && {
              access_type: 'offline',
              prompt: 'consent'
            })
          }
        }
      });

      if (error) {
        console.error(`${provider} OAuth sign in error:`, error);
        setError(error.message);
        toast({
          title: `${provider} sign in failed`,
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log(`${provider} OAuth sign in initiated:`, data);
        
        // Show success message
        toast({
          title: `${provider} sign in initiated`,
          description: "Redirecting to authentication...",
        });
      }
    } catch (error) {
      console.error(`${provider} OAuth sign in error:`, error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: `${provider} sign in failed`,
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#111827] flex items-center justify-center p-4">
      <div className="w-full max-w-[460px]">
        {/* Card */}
        <div className="bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="text-2xl font-bold text-[#0B1F4E] dark:text-white">
              CentraBudget
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome back
            </h1>
          </div>

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12 rounded-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0B1F4E] focus:border-[#0B1F4E] px-6"
                  placeholder="Email address"
                />
              </div>

              {/* Continue Button */}
              <Button
                type="submit"
                disabled={!formData.email}
                className="w-full h-12 bg-[#0B1F4E] hover:bg-[#0B1F4E]/90 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </Button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-[#0B1F4E] hover:text-[#0B1F4E]/80 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Password Step */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Email Display */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.email}
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-12 rounded-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0B1F4E] focus:border-[#0B1F4E] px-6 pr-12"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Continue Button */}
              <Button
                type="submit"
                disabled={loading || !formData.password}
                className="w-full h-12 bg-[#0B1F4E] hover:bg-[#0B1F4E]/90 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Continue"}
              </Button>

              {/* Back to Email */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-sm text-[#0B1F4E] hover:text-[#0B1F4E]/80 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  ← Back
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#1F2937] text-gray-500 dark:text-gray-400">
                OR
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full font-medium"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("apple")}
              disabled={loading}
              className="w-full h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full font-medium"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </Button>

            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("microsoft")}
              disabled={loading}
              className="w-full h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full font-medium"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.5 2.75h-8a.75.75 0 0 0-.75.75v8c0 .414.336.75.75.75h8a.75.75 0 0 0 .75-.75v-8a.75.75 0 0 0-.75-.75Zm-8 1.5h6.5v6.5h-6.5v-6.5Zm8 6.5h8a.75.75 0 0 0 .75-.75v-8a.75.75 0 0 0-.75-.75h-8a.75.75 0 0 0-.75.75v8c0 .414.336.75.75.75Zm8-8.75h-6.5v6.5h6.5v-6.5Zm-8 8.5h-8a.75.75 0 0 0-.75.75v8c0 .414.336.75.75.75h8a.75.75 0 0 0 .75-.75v-8a.75.75 0 0 0-.75-.75Zm-8 1.5h6.5v6.5h-6.5v-6.5Zm8 6.5h8a.75.75 0 0 0 .75-.75v-8a.75.75 0 0 0-.75-.75h-8a.75.75 0 0 0-.75.75v8c0 .414.336.75.75.75Zm8-8.75h-6.5v6.5h6.5v-6.5Z"/>
              </svg>
              Continue with Microsoft
            </Button>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <a href="/terms" className="hover:text-gray-900 dark:hover:text-white">
                Terms of Use
              </a>
              <span className="text-gray-400">|</span>
              <a href="/privacy" className="hover:text-gray-900 dark:hover:text-white">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
