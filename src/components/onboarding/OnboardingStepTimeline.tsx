import { useOnboardingState, BudgetTimeline } from "@/hooks/useOnboardingState";
import { useSettings } from "@/contexts/SettingsContext";

interface OnboardingStepTimelineProps {
  state: ReturnType<typeof useOnboardingState>;
}

const OPTIONS: { value: BudgetTimeline; label: string; hint: string }[] = [
  { value: "monthly", label: "Monthly", hint: "Plan and reset every month" },
  { value: "quarterly", label: "Quarterly", hint: "Track in 3‑month periods" },
  { value: "yearly", label: "Yearly", hint: "Set one annual target" },
];

export function OnboardingStepTimeline({ state }: OnboardingStepTimelineProps) {
  const { data, selectTimeline } = state;
  const { updatePreferences } = useSettings();

  return (
    <div>
      <h3 className="text-lg font-medium text-foreground">Select your budget timeline</h3>
      <p className="mt-1 text-sm text-muted-foreground">You can change this later in Settings.</p>

      <div className="mt-4 grid grid-cols-1 gap-3" role="radiogroup" aria-label="Budget timeline">
        {OPTIONS.map((opt) => {
          const selected = data.timeline === opt.value;
          return (
            <label
              key={opt.value}
              className={
                "flex items-center justify-between rounded-xl border px-4 py-3 transition shadow-sm bg-white/80 backdrop-blur cursor-pointer " +
                (selected
                  ? "border-primary/50 ring-2 ring-primary/60 shadow-md"
                  : "border-gray-200 hover:bg-white focus-within:ring-2 focus-within:ring-primary")
              }
            >
              <div>
                <div className="text-sm font-medium text-foreground">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.hint}</div>
              </div>
              <input
                type="radio"
                name="timeline"
                value={opt.value}
                checked={selected}
                onChange={() => {
                  selectTimeline(opt.value);
                  updatePreferences({ budgetPeriod: opt.value });
                }}
                className="sr-only"
                aria-checked={selected}
              />
              <span
                className={
                  "ml-3 inline-flex h-4 w-4 rounded-full border " +
                  (selected ? "bg-primary border-primary" : "bg-white border-gray-300")
                }
                aria-hidden
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default OnboardingStepTimeline;


