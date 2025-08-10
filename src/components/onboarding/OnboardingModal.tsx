import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingProgressDots } from "@/components/onboarding/OnboardingProgressDots";
import { OnboardingStepCurrency } from "@/components/onboarding/OnboardingStepCurrency";
import { OnboardingStepTimeline } from "@/components/onboarding/OnboardingStepTimeline";
import { OnboardingStepFixedCostList } from "@/components/onboarding/OnboardingStepFixedCostList";
import { OnboardingStepSpendCategories } from "@/components/onboarding/OnboardingStepSpendCategories";
import { OnboardingStepComplete } from "@/components/onboarding/OnboardingStepComplete";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { X } from "lucide-react";

interface OnboardingModalProps {
  state: ReturnType<typeof useOnboardingState>;
}

export function OnboardingModal({ state }: OnboardingModalProps) {
  const { isOpen, setIsOpen, steps, currentIndex, currentStep, data } = state;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        aria-modal="true"
        role="dialog"
        aria-labelledby="onb-title"
        aria-describedby="onb-desc"
        showCloseButton={false}
        className="max-w-[560px] w-full border border-gray-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.2)] rounded-3xl p-0 overflow-hidden"
      >
        {/* Header — homepage gradient style, with visible close button */}
        <div className="relative bg-gradient-to-r from-primary via-indigo-600 to-purple-600 border-b border-primary/30">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            title="Close"
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/25 hover:bg-white/35 text-white shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-4 w-4" />
          </button>
          <OnboardingHeader
            idTitle="onb-title"
            idSubtitle="onb-desc"
            title="Let’s get you set up"
            subtitle="Answer a few quick questions to tailor CentraBudget to you."
          />
        </div>

        {/* Step content */}
        <div className="p-6">
          {currentStep.id === "currency" && <OnboardingStepCurrency state={state} />}
          {currentStep.id === "timeline" && <OnboardingStepTimeline state={state} />}
          {currentStep.id === "fixedCost" && <OnboardingStepFixedCostList state={state} />}
          {currentStep.id === "spendCategories" && <OnboardingStepSpendCategories state={state} />}
          {currentStep.id === "complete" && <OnboardingStepComplete state={state} />}
        </div>

        {/* Footer actions — hidden on completion screen */}
        {currentStep.id !== "complete" && (
          <div className="px-6 pb-6">
            <OnboardingFooter state={state} />
            <div className="mt-4 flex justify-center">
              <OnboardingProgressDots total={steps.length} current={currentIndex} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingModal;


