import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  page: string;
  action?: string;
  target?: string;
  completed: boolean;
  order: number;
}

const defaultSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ClearCents! 🎉',
    description: 'Let\'s get you started with managing your finances. Complete the checklist below to set up your account.',
    page: '/dashboard',
    completed: false,
    order: 1,
  },
  {
    id: 'create-category',
    title: 'Create Your First Category',
    description: 'Go to Categories page and create a category like "Groceries" or "Transportation" to organize your expenses.',
    page: '/categories',
    completed: false,
    order: 2,
  },
  {
    id: 'set-budget',
    title: 'Set a Budget for Your Category',
    description: 'Navigate to the Budget page and create a monthly budget to stay on track with your financial goals.',
    page: '/budget',
    completed: false,
    order: 3,
  },
  {
    id: 'add-transaction',
    title: 'Add Your First Transaction',
    description: 'Go to Transactions page and add a transaction. Select your category and enter the amount to start tracking.',
    page: '/transactions',
    completed: false,
    order: 4,
  },
  {
    id: 'view-insights',
    title: 'Explore Your Insights',
    description: 'Visit the Insights page to see your spending patterns and financial analysis.',
    page: '/insights',
    completed: false,
    order: 5,
  },
];

export function useOnboarding() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [steps, setSteps] = useState<OnboardingStep[]>(defaultSteps);
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);

  // Load completed steps from localStorage
  useEffect(() => {
    if (!user) return;

    const storageKey = `onboarding_steps_${user.id}`;
    const savedSteps = localStorage.getItem(storageKey);
    
    if (savedSteps) {
      try {
        const parsedSteps = JSON.parse(savedSteps);
        setSteps(parsedSteps);
      } catch (error) {
        console.error('Error parsing saved steps:', error);
      }
    }
  }, [user]);

  // Save steps to localStorage when they change
  useEffect(() => {
    if (!user) return;

    const storageKey = `onboarding_steps_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(steps));
  }, [steps, user]);

  // Find current step based on location and completion status
  useEffect(() => {
    const nextIncompleteStep = steps.find(step => !step.completed);
    setCurrentStep(nextIncompleteStep || null);
  }, [location.pathname, steps]);

  const markStepAsCompleted = (stepId: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  const completeStepAndNavigate = (stepId: string) => {
    // Mark current step as completed
    markStepAsCompleted(stepId);
  };

  const resetOnboarding = () => {
    setSteps(defaultSteps);
    if (user) {
      const storageKey = `onboarding_steps_${user.id}`;
      localStorage.removeItem(storageKey);
    }
  };

  const hasUncompletedSteps = steps.some(step => !step.completed);
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  return {
    currentStep,
    markStepAsCompleted,
    completeStepAndNavigate,
    resetOnboarding,
    hasUncompletedSteps,
    steps,
    progress,
    completedSteps,
    totalSteps,
  };
} 