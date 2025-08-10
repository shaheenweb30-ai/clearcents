import OnboardingProvider from "@/components/onboarding/OnboardingProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingDemoPage() {
  return (
    <OnboardingProvider onComplete={(d) => console.log("onboarding complete", d)}>
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <Card className="max-w-xl w-full">
          <CardHeader>
            <CardTitle>Onboarding Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This page demonstrates the onboarding modal. Clear the local storage keys to
              see it again: <code>cc_onboarded_v1</code> and <code>cc_pref_currency</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </OnboardingProvider>
  );
}


