import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AuthLayout } from "./AuthLayout";
import { VerifyEmailNotice } from "./VerifyEmailNotice";
import { Logo } from "@/components/Logo";

export const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    
    try {
      // TODO: Wire to real authentication service (Supabase/Firebase/Cognito/Custom)
      console.log('Resending verification email');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Resend verification error:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
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
            <VerifyEmailNotice onResend={handleResend} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};
