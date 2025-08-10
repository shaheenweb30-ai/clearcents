import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { CheckCircle2 } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface Props {
  state: ReturnType<typeof useOnboardingState>;
}

export function OnboardingStepComplete({ state }: Props) {
  const navigate = useNavigate();
  const { preferences } = useSettings();
  const fixedCount = (state.data.fixedCosts || []).length;
  const spendCount = (state as any).data.spendingCategories?.length || 0;

  const handleFinish = () => {
    // Finalise onboarding then route to budgets page
    state.next();
    // Reflect onboarding selections into global preferences once more as a safety net
    if (state.data.currency) {
      updatePreferences({ currency: state.data.currency });
    }
    if (state.data.timeline) {
      updatePreferences({ budgetPeriod: state.data.timeline as any });
    }
    navigate('/dashboard');
  };

  return (
    <div className="text-center">

      <h3 className="mt-8 text-2xl font-semibold text-foreground">You’re all set!</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">Great work—now let’s add budget amounts for your categories.</p>

      <div className="mt-8 flex justify-center">
        <Button
          className="w-full sm:w-auto rounded-xl px-6 py-3 bg-gradient-to-r from-primary to-teal-500 text-white hover:brightness-110"
          onClick={handleFinish}
        >
          Continue to Budgets
        </Button>
      </div>
    </div>
  );
}

export default OnboardingStepComplete;


