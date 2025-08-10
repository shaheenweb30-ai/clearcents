import { useOnboardingState } from "@/hooks/useOnboardingState";

interface Props {
  state: ReturnType<typeof useOnboardingState>;
}

const PREDEFINED: { id: string; name: string }[] = [
  { id: 'groceries', name: 'Groceries' },
  { id: 'rent', name: 'Rent' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'transport', name: 'Transport' },
  { id: 'dining', name: 'Dining Out' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'subscriptions', name: 'Subscriptions' },
  { id: 'health', name: 'Health' },
  { id: 'education', name: 'Education' },
  { id: 'other', name: 'Other' },
];

export function OnboardingStepSpendCategories({ state }: Props) {
  const { data, toggleSpendingCategory } = state as any;
  const selected = new Set<string>(data.spendingCategories || []);

  return (
    <div>
      <h3 className="text-lg font-medium text-foreground">Where do you usually spend your money?</h3>
      <p className="mt-1 text-sm text-muted-foreground">Pick as many as you like. We'll set them up for you.</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {PREDEFINED.map((cat) => {
          const isActive = selected.has(cat.name);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleSpendingCategory(cat.name)}
              className={
                "rounded-xl border px-4 py-3 text-left transition bg-white/80 " +
                (isActive ? "border-primary ring-2 ring-primary/60" : "border-gray-200 hover:bg-white")
              }
              aria-pressed={isActive}
            >
              <span className="text-sm font-medium">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OnboardingStepSpendCategories;


