import { Button } from "@/components/ui/button";
import { ONBOARDED_KEY, PREF_CURRENCY_KEY } from "@/hooks/useOnboardingState";
import { useToast } from "@/hooks/use-toast";

export function SettingsResetOnboarding() {
  const { toast } = useToast();
  const handleReset = () => {
    localStorage.removeItem(ONBOARDED_KEY);
    localStorage.removeItem(PREF_CURRENCY_KEY);
    toast({
      title: "Onboarding reset. It will appear after next sign-in.",
    });
  };

  return (
    <div className="mt-4">
      <Button variant="outline" onClick={handleReset}>Reset onboarding</Button>
    </div>
  );
}

export default SettingsResetOnboarding;


