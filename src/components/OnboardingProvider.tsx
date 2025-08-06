import { ReactNode } from 'react';
import { OnboardingTip } from './OnboardingTip';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { currentStep, completeStepAndNavigate, hasUncompletedSteps } = useOnboarding();
  const { user, loading } = useAuth();

  const handleComplete = (stepId: string) => {
    // Simply mark the step as completed
    completeStepAndNavigate(stepId);
  };

  const handleDismiss = (stepId: string) => {
    completeStepAndNavigate(stepId);
  };

  // Debug info (removed from UI, but console.log remains)
  console.log('OnboardingProvider Debug:', {
    user: user?.email,
    loading,
    currentStep,
    hasUncompletedSteps,
    pathname: window.location.pathname
  });

  return (
    <div className="relative">
      {children}
      
      {/* Onboarding Step Box */}
      {currentStep && (
        <div className="fixed top-20 right-6 z-50">
          <OnboardingTip
            tip={currentStep}
            onComplete={handleComplete}
            onDismiss={handleDismiss}
            isCompleted={currentStep.completed}
          />
        </div>
      )}
      
      {/* Onboarding Status Indicator */}
      {hasUncompletedSteps && !currentStep && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Tips Available
          </Button>
        </div>
      )}
    </div>
  );
}
