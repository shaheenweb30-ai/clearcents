import { Button } from "@/components/ui/button";
import { useOnboardingState } from "@/hooks/useOnboardingState";

interface OnboardingFooterProps {
  state: ReturnType<typeof useOnboardingState>;
}

export function OnboardingFooter({ state }: OnboardingFooterProps) {
  const { canContinue, next, back, skip, isFirstStep } = state;
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm">
        {!isFirstStep ? (
          <button onClick={back} className="text-indigo-700 dark:text-indigo-300 hover:underline underline-offset-4">
            Back
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={skip} className="text-indigo-700 hover:underline underline-offset-4">
          Skip for now
        </button>
        <Button
          onClick={next}
          disabled={!canContinue}
          className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl px-5 py-3 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default OnboardingFooter;


