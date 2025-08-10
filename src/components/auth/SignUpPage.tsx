import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Sparkles, User, Mail, Lock, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleEmailContinue = () => {
    setError("");
    if (validateEmail()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (error) {
        console.error("Sign up error:", error);
        setError(error.message);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Sign up successful:", data);
        try { localStorage.setItem('lastEmail', email); } catch {}
        toast({
          title: "Verify your email",
          description: "We sent you a verification link. Please verify to continue.",
        });
        navigate("/verify-email");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/30 flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>

      {/* Header with Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/90 backdrop-blur-sm relative z-10">
        <Link to="/" className="group">
          <div className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">C</span>
            </div>
             CentraBudget
          </div>
        </Link>
        
        {/* Header Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            New Account
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[500px]">
          {/* Card Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                 {step === 1 ? "Join CentraBudget" : "Set your password"}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                 {step === 1 ? "Create your account" : "Set your password for CentraBudget to continue"}
              </h1>
              {step === 1 && (
                <p className="text-lg text-gray-600 max-w-sm mx-auto">
                  Start your financial journey with AI-powered insights
                </p>
              )}
            </div>

            {/* Step 1: Email Only */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 rounded-xl text-lg transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <Button
                  onClick={handleEmailContinue}
                  disabled={loading || !email.trim()}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Continue
                    </>
                  )}
                </Button>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Password and Details */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Display */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email address
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="email"
                      value={email}
                      disabled
                      className="h-14 border-gray-300 bg-gray-50 text-gray-600 px-4 rounded-xl text-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackToEmail}
                      className="px-4 py-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Full Name Field */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 rounded-xl text-lg transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 pr-12 rounded-xl text-lg transition-all duration-300"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 pr-12 rounded-xl text-lg transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 transition-colors duration-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="terms" className="text-sm text-gray-700 font-medium">
                      I agree to the{" "}
                      <a href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !agreeToTerms}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create account
                    </>
                  )}
                </Button>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200/50">
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <a href="/terms" className="hover:text-gray-900 transition-colors duration-300 font-medium">
                Terms of Use
              </a>
              <span className="text-gray-400">|</span>
              <a href="/privacy" className="hover:text-gray-900 transition-colors duration-300 font-medium">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
