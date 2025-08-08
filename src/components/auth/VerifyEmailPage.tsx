import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AuthLayout } from "./AuthLayout";
import { VerifyEmailNotice } from "./VerifyEmailNotice";

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
      <Card className="rounded-2xl border shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6 md:p-8">
          <VerifyEmailNotice onResend={handleResend} loading={loading} />
        </CardContent>
      </Card>
    </AuthLayout>
  );
};
