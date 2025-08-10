import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ONBOARDED_KEY, PREF_CURRENCY_KEY } from "@/hooks/useOnboardingState";
import { useToast } from "@/hooks/use-toast";

interface OnboardingTestButtonProps {
  label?: string;
}

// Developer-only helper: clears onboarding flags and sends you to the dashboard
// so the modal opens immediately there.
export function OnboardingTestButton({ label = "Show onboarding (test)" }: OnboardingTestButtonProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClick = () => {
    localStorage.removeItem(ONBOARDED_KEY);
    // Keep currency optional. If you want a clean slate, also clear the pref currency.
    // localStorage.removeItem(PREF_CURRENCY_KEY);

    toast({ title: "Onboarding will show on the dashboard." });
    navigate("/dashboard");
  };

  return (
    <Button variant="outline" onClick={handleClick} className="rounded-xl">
      {label}
    </Button>
  );
}

export default OnboardingTestButton;


