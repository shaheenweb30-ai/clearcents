import { useMemo, useState } from "react";
import { useOnboardingState, SupportedCurrency } from "@/hooks/useOnboardingState";
import { Check } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface OnboardingStepCurrencyProps {
  state: ReturnType<typeof useOnboardingState>;
}

const OPTIONS: { code: SupportedCurrency; label: string; symbol: string }[] = [
  { code: "GBP", label: "GBP", symbol: "£" },
  { code: "USD", label: "USD", symbol: "$" },
  { code: "EUR", label: "EUR", symbol: "€" },
  { code: "AED", label: "AED", symbol: "د.إ" },
  { code: "KWD", label: "KWD", symbol: "د.ك" },
  { code: "SAR", label: "SAR", symbol: "ر.س" },
];

export function OnboardingStepCurrency({ state }: OnboardingStepCurrencyProps) {
  const { data, selectCurrency } = state;
  const [query] = useState(""); // Placeholder for future search
  const { updatePreferences } = useSettings();

  const filtered = useMemo(() => {
    if (!query) return OPTIONS;
    const q = query.toLowerCase();
    return OPTIONS.filter((o) => o.code.toLowerCase().includes(q) || o.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <h3 className="text-lg font-medium text-foreground">Pick your preferred currency</h3>
      <p className="mt-1 text-sm text-muted-foreground">You can change this later in Settings.</p>

      {/* Search input placeholder */}
      {/*
      <div className="mt-4">
        <input
          type="text"
          className="w-full rounded-xl border border-white/20 bg-white/10 dark:bg-white/5 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          placeholder="Search currency…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      */}

      <div className="mt-4 grid grid-cols-2 gap-3" role="group" aria-label="Currency options">
        {filtered.map((opt) => {
          const selected = data.currency === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => {
                selectCurrency(opt.code);
                updatePreferences({ currency: opt.code });
              }}
              className={
                "flex items-center justify-between rounded-xl border px-4 py-3 transition shadow-sm focus:outline-none bg-white/80 backdrop-blur " +
                (selected
                  ? "bg-white border-primary/50 ring-2 ring-primary/60 shadow-md"
                  : "border-gray-200 hover:bg-white focus-visible:ring-2 focus-visible:ring-primary")
              }
              aria-pressed={selected}
            >
              <span className="text-sm font-medium text-foreground">
                {opt.label} <span className="opacity-70">{opt.symbol}</span>
              </span>
              {selected && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OnboardingStepCurrency;


