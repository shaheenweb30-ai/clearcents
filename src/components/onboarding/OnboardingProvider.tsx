import { ReactNode, useEffect, useCallback } from "react";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";

interface OnboardingProviderProps {
  children: ReactNode;
  onComplete?: (data: { currency: string | null }) => void;
}

export function OnboardingProvider({ children, onComplete }: OnboardingProviderProps) {
  const { user } = useAuth();
  const { updatePreferences } = useSettings();
  const handleComplete = useCallback((data: { currency: string | null, timeline?: string | null, fixedMonthlyCost?: number | null }) => {
    // Apply selections to preferences to reflect across the app immediately
    if (data.currency) updatePreferences({ currency: data.currency });
    if (data.timeline && (data.timeline === 'monthly' || data.timeline === 'quarterly' || data.timeline === 'yearly')) {
      // Save budget period to preferences to drive budgets/reports
      updatePreferences({ budgetPeriod: data.timeline as 'monthly' | 'quarterly' | 'yearly' });
    }
    // Fixed cost can be used later to pre-seed budgets or insights. For now we only persist locally.
    onComplete?.(data);
  }, [onComplete, updatePreferences]);
  const onboarding = useOnboardingState({ onComplete: handleComplete });
  const location = useLocation();

  useEffect(() => {
    // Auto-open only after login AND when visiting the dashboard route
    if (!user) return;
    const onDashboard = location.pathname.startsWith("/dashboard");
    if (onDashboard) {
      // Defer to next tick to avoid blocking route paint
      setTimeout(() => onboarding.openIfNeeded(), 0);
    }
  }, [user, location.pathname]);

  return (
    <>
      {children}
      <OnboardingModal state={onboarding} />
    </>
  );
}

export default OnboardingProvider;


