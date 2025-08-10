import { useCallback, useEffect, useMemo, useState } from "react";

export const ONBOARDED_KEY = "cc_onboarded_v1";
export const PREF_CURRENCY_KEY = "cc_pref_currency";
export const BUDGET_PERIOD_KEY = "cc_budget_period";
export const FIXED_COST_KEY = "cc_fixed_monthly_cost";
export const FIXED_COST_CATEGORY_KEY = "cc_fixed_monthly_cost_category";
export const FIXED_COSTS_KEY = "cc_fixed_costs_v1";
export const SPEND_CATEGORIES_KEY = "cc_spend_categories_v1";

export type SupportedCurrency = "GBP" | "USD" | "EUR" | "AED" | "KWD" | "SAR";

export type BudgetTimeline = "monthly" | "yearly" | "quarterly";

export type OnboardingData = {
  currency: SupportedCurrency | null;
  timeline: BudgetTimeline | null;
  fixedMonthlyCost: number | null;
  fixedMonthlyCategoryId?: string | null;
  fixedCosts?: { amount: number; categoryId: string }[];
};

export type OnboardingStepId = "currency" | "timeline" | "fixedCost" | "spendCategories" | "complete";

type StepConfig = {
  id: OnboardingStepId;
  required: boolean;
};

const STEPS: StepConfig[] = [
  { id: "currency", required: true },
  { id: "timeline", required: true },
  { id: "fixedCost", required: true },
  { id: "spendCategories", required: false },
  { id: "complete", required: false },
  // Future steps can be added here, e.g. goals, payday cadence, templates
];

export interface UseOnboardingStateOptions {
  onComplete?: (data: OnboardingData) => void;
}

export function useOnboardingState(options?: UseOnboardingStateOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>({ currency: null, timeline: null, fixedMonthlyCost: null, fixedCosts: [], spendingCategories: [] } as any);

  const steps = useMemo(() => STEPS, []);
  const currentStep = steps[currentIndex];

  const isCompleted = useCallback(() => {
    return localStorage.getItem(ONBOARDED_KEY) === "true";
  }, []);

  const openIfNeeded = useCallback(() => {
    const completed = isCompleted();
    if (!completed) {
      setIsOpen(true);
    }
  }, [isCompleted]);

  const persistOnboardedTrue = useCallback(() => {
    localStorage.setItem(ONBOARDED_KEY, "true");
  }, []);

  const persistCurrency = useCallback((code: SupportedCurrency) => {
    localStorage.setItem(PREF_CURRENCY_KEY, code);
  }, []);

  const persistTimeline = useCallback((value: BudgetTimeline) => {
    localStorage.setItem(BUDGET_PERIOD_KEY, value);
  }, []);

  const persistFixedCost = useCallback((value: number) => {
    localStorage.setItem(FIXED_COST_KEY, String(value));
  }, []);

  const persistFixedCostCategory = useCallback((id: string) => {
    localStorage.setItem(FIXED_COST_CATEGORY_KEY, id);
  }, []);

  const persistFixedCosts = useCallback((items: { amount: number; categoryId: string }[]) => {
    localStorage.setItem(FIXED_COSTS_KEY, JSON.stringify(items));
  }, []);

  const persistSpendCategories = useCallback((items: string[]) => {
    localStorage.setItem(SPEND_CATEGORIES_KEY, JSON.stringify(items));
  }, []);

  const resetLocal = useCallback(() => {
    localStorage.removeItem(ONBOARDED_KEY);
    localStorage.removeItem(PREF_CURRENCY_KEY);
  }, []);

  const selectCurrency = useCallback((code: SupportedCurrency) => {
    setData((prev) => ({ ...prev, currency: code }));
    // Persist immediately so the app can reflect it while onboarding continues
    persistCurrency(code);
  }, [persistCurrency]);

  const selectTimeline = useCallback((value: BudgetTimeline) => {
    setData((prev) => ({ ...prev, timeline: value }));
    // Persist immediately
    persistTimeline(value);
  }, [persistTimeline]);

  const setFixedCost = useCallback((value: number | null) => {
    setData((prev) => ({ ...prev, fixedMonthlyCost: value }));
    if (typeof value === 'number' && !Number.isNaN(value)) {
      persistFixedCost(value);
    }
  }, [persistFixedCost]);

  const setFixedCostCategory = useCallback((id: string | null) => {
    setData((prev) => ({ ...prev, fixedMonthlyCategoryId: id }));
    if (id) persistFixedCostCategory(id);
  }, [persistFixedCostCategory]);

  // Multiple fixed cost helpers
  const addFixedCostItem = useCallback(() => {
    setData(prev => {
      const items = [...(prev.fixedCosts || []), { amount: 0, categoryId: "" }];
      persistFixedCosts(items);
      return { ...prev, fixedCosts: items };
    });
  }, [persistFixedCosts]);

  const updateFixedCostItem = useCallback((index: number, patch: Partial<{ amount: number; categoryId: string }>) => {
    setData(prev => {
      const items = [...(prev.fixedCosts || [])];
      items[index] = { ...items[index], ...patch } as { amount: number; categoryId: string };
      persistFixedCosts(items);
      return { ...prev, fixedCosts: items };
    });
  }, [persistFixedCosts]);

  const removeFixedCostItem = useCallback((index: number) => {
    setData(prev => {
      const items = [...(prev.fixedCosts || [])];
      items.splice(index, 1);
      persistFixedCosts(items);
      return { ...prev, fixedCosts: items };
    });
  }, [persistFixedCosts]);

  // Spending categories multi-select
  const toggleSpendingCategory = useCallback((name: string) => {
    setData(prev => {
      const list = new Set<string>(prev.spendingCategories || []);
      if (list.has(name)) list.delete(name); else list.add(name);
      const arr = Array.from(list);
      persistSpendCategories(arr);
      return { ...prev, spendingCategories: arr } as any;
    });
  }, [persistSpendCategories]);

  const validateCurrent = useCallback(() => {
    if (currentStep.id === "currency") {
      return data.currency !== null;
    }
    if (currentStep.id === "timeline") {
      return data.timeline !== null;
    }
    if (currentStep.id === "fixedCost") {
      const items = data.fixedCosts && data.fixedCosts.length ? data.fixedCosts : (data.fixedMonthlyCost != null && data.fixedMonthlyCategoryId ? [{ amount: data.fixedMonthlyCost, categoryId: data.fixedMonthlyCategoryId }] : []);
      return items.length > 0 && items.every(i => typeof i.amount === 'number' && i.amount >= 0 && !!i.categoryId);
    }
    return true;
  }, [currentStep.id, data.currency, data.timeline, data.fixedMonthlyCost, data.fixedMonthlyCategoryId, data.fixedCosts]);

  const canContinue = validateCurrent();

  const next = useCallback(() => {
    if (!validateCurrent()) return;
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    // Finalise
    persistOnboardedTrue();
    if (data.currency) persistCurrency(data.currency);
    if (data.timeline) persistTimeline(data.timeline);
    if (data.fixedCosts && data.fixedCosts.length) {
      persistFixedCosts(data.fixedCosts);
    } else {
      if (typeof data.fixedMonthlyCost === 'number') persistFixedCost(data.fixedMonthlyCost);
      if (data.fixedMonthlyCategoryId) persistFixedCostCategory(data.fixedMonthlyCategoryId);
    }
    if (data.spendingCategories && data.spendingCategories.length) persistSpendCategories(data.spendingCategories as any);
    options?.onComplete?.(data);
    setIsOpen(false);
  }, [currentIndex, data, options, persistCurrency, persistTimeline, persistFixedCost, persistOnboardedTrue, steps.length, validateCurrent]);

  const back = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const skip = useCallback(() => {
    // Mark as completed even if required step was skipped (demo behaviour)
    persistOnboardedTrue();
    setIsOpen(false);
  }, [persistOnboardedTrue]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Keyboard: Enter to continue
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && canContinue) {
        e.preventDefault();
        next();
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, canContinue, next, close]);

  return {
    // state
    isOpen,
    setIsOpen,
    steps,
    currentIndex,
    currentStep,
    data,
    // actions
    openIfNeeded,
    selectCurrency,
    selectTimeline,
    setFixedCost,
    setFixedCostCategory,
    addFixedCostItem,
    updateFixedCostItem,
    removeFixedCostItem,
    toggleSpendingCategory,
    next,
    back,
    skip,
    close,
    resetLocal,
    // helpers
    canContinue,
    isFirstStep: currentIndex === 0,
    isLastStep: currentIndex === steps.length - 1,
  } as const;
}


