import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

const HomeLoginSection = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Don't render if user is already signed in
  if (user) {
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        toast({ title: "Welcome back!", description: "Successfully signed in." });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSocialLoading("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-2 border-mint-light shadow-xl">
      <CardHeader className="pb-4">
        <h3 className="font-heading font-semibold text-xl text-navy text-center">
          Sign In to Your Account
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Login Buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="default"
            className="w-full border-2 border-navy/20 text-navy hover:bg-navy hover:text-white"
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading === 'google'}
          >
            {socialLoading === 'google' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Sign in with Google
          </Button>

          <Button
            variant="outline"
            size="default"
            className="w-full border-2 border-navy/20 text-navy hover:bg-navy hover:text-white"
            onClick={() => handleSocialLogin('apple')}
            disabled={socialLoading === 'apple'}
          >
            {socialLoading === 'apple' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C8.396 0 8.025.046 7.333.121 7.025.162 6.725.207 6.434.259 5.525.394 4.743.7 4.136 1.137 3.53 1.574 3.137 2.137 2.908 2.814 2.679 3.49 2.625 4.26 2.625 5.027V18.972C2.625 19.74 2.679 20.51 2.908 21.186 3.137 21.863 3.53 22.426 4.136 22.863 4.743 23.3 5.525 23.606 6.434 23.741 6.725 23.793 7.025 23.838 7.333 23.879 8.025 23.954 8.396 24 12.017 24S16.009 23.954 16.701 23.879C17.009 23.838 17.309 23.793 17.6 23.741 18.509 23.606 19.291 23.3 19.898 22.863 20.504 22.426 20.897 21.863 21.126 21.186 21.355 20.51 21.409 19.74 21.409 18.972V5.027C21.409 4.26 21.355 3.49 21.126 2.814 20.897 2.137 20.504 1.574 19.898 1.137 19.291.7 18.509.394 17.6.259 17.309.207 17.009.162 16.701.121 16.009.046 15.638 0 12.017 0ZM15.833 9.686C15.833 6.25 13.5 5.833 12.5 5.833S9.167 6.25 9.167 9.686C9.167 13.123 11.5 13.54 12.5 13.54S15.833 13.123 15.833 9.686ZM12.5 14.833C10.5 14.833 8.5 13.5 8.5 11C8.5 8.5 10.5 7.167 12.5 7.167S16.5 8.5 16.5 11C16.5 13.5 14.5 14.833 12.5 14.833Z"/>
              </svg>
            )}
            Sign in with Apple
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-navy">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 border-2 border-mint-light focus:border-mint"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium text-navy">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 border-2 border-mint-light focus:border-mint"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            size="default"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="space-y-2 text-center text-sm">
          <div>
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-navy hover:text-navy-light font-medium underline">
              Create an account
            </Link>
          </div>
          <div>
            <Link to="/forgot-password" className="text-navy hover:text-navy-light font-medium underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeLoginSection;