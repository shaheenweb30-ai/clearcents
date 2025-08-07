import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface TourStep {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  action?: string; // Action to perform when completed
  page?: string; // Page to navigate to
}

export interface ProductTourContext {
  currentStep: TourStep | null;
  isVisible: boolean;
  showTour: () => void;
  hideTour: () => void;
  completeStep: (stepId: string) => void;
  resetTour: () => void;
  hasUncompletedSteps: boolean;
  progress: number;
  isFABHidden: boolean;
  showFAB: () => void;
  hideFAB: () => void;
}

const defaultSteps: TourStep[] = [
  {
    id: 'create-category',
    title: 'Create your Category',
    completed: false,
    order: 1,
    action: 'create_category',
    page: '/categories'
  },
  {
    id: 'create-budget',
    title: 'Create your Budget',
    completed: false,
    order: 2,
    action: 'create_budget',
    page: '/budget'
  },
  {
    id: 'add-transaction',
    title: 'Add your Transaction',
    completed: false,
    order: 3,
    action: 'add_transaction',
    page: '/transactions'
  },
  {
    id: 'check-insights',
    title: 'Check your Insights',
    completed: false,
    order: 4,
    action: 'visit_insights',
    page: '/insights'
  },
  {
    id: 'export-report',
    title: 'Export your Report',
    completed: false,
    order: 5,
    action: 'export_report',
    page: '/reports'
  }
];

export function useProductTour() {
  const [steps, setSteps] = useState<TourStep[]>(defaultSteps);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const [isFABHidden, setIsFABHidden] = useState(false);
  const location = useLocation();

  // Load tour state from localStorage
  useEffect(() => {
    const savedSteps = localStorage.getItem('product_tour_steps');
    const savedHasSeen = localStorage.getItem('product_tour_seen');
    
    if (savedSteps) {
      try {
        const parsedSteps = JSON.parse(savedSteps);
        setSteps(parsedSteps);
      } catch (error) {
        console.error('Error parsing saved tour steps:', error);
      }
    }
    
    if (savedHasSeen) {
      setHasSeenTour(JSON.parse(savedHasSeen));
    }
  }, []);

  // Save steps to localStorage when they change
  useEffect(() => {
    localStorage.setItem('product_tour_steps', JSON.stringify(steps));
  }, [steps]);

  // Save hasSeenTour to localStorage
  useEffect(() => {
    localStorage.setItem('product_tour_seen', JSON.stringify(hasSeenTour));
  }, [hasSeenTour]);

  // Monitor isVisible changes
  useEffect(() => {
    console.log('isVisible changed to:', isVisible);
  }, [isVisible]);

  // Auto-detect completion based on user actions
  useEffect(() => {
    // This will be expanded with actual detection logic
    // For now, we'll rely on manual completion
  }, [location.pathname]);

  const showTour = () => {
    console.log('showTour called - before state update');
    console.log('Current state:', { isVisible, hasSeenTour });
    setIsVisible(true);
    setHasSeenTour(true);
    console.log('showTour called - after state update');
  };

  const hideTour = () => {
    console.log('hideTour called');
    setIsVisible(false);
  };

  const completeStep = (stepId: string) => {
    console.log('completeStep called:', stepId);
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  const resetTour = () => {
    console.log('resetTour called');
    setSteps(defaultSteps);
    setHasSeenTour(false);
    setIsFABHidden(false);
    localStorage.removeItem('product_tour_steps');
    localStorage.removeItem('product_tour_seen');
  };

  const showFAB = () => {
    console.log('showFAB called');
    setIsFABHidden(false);
  };

  const hideFAB = () => {
    console.log('hideFAB called');
    setIsFABHidden(true);
  };

  const hasUncompletedSteps = steps.some(step => !step.completed);
  const progress = (steps.filter(step => step.completed).length / steps.length) * 100;

  console.log('useProductTour state:', { 
    isVisible, 
    hasSeenTour, 
    hasUncompletedSteps, 
    progress,
    stepsCompleted: steps.filter(s => s.completed).length,
    isFABHidden
  });

  return {
    steps,
    isVisible,
    hasSeenTour,
    showTour,
    hideTour,
    completeStep,
    resetTour,
    hasUncompletedSteps,
    progress,
    isFABHidden,
    showFAB,
    hideFAB
  };
} 