import { useState, useEffect } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TourStep } from '@/hooks/useProductTour';
import { useProductTourContext } from '@/contexts/ProductTourContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProductTourProps {
  onDismiss?: () => void;
}

export function ProductTour({ onDismiss }: ProductTourProps) {
  const {
    steps,
    isVisible,
    progress,
    hideTour,
    completeStep,
    hasUncompletedSteps
  } = useProductTourContext();
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  console.log('ProductTour render:', { isVisible, progress, hasUncompletedSteps });

  useEffect(() => {
    console.log('ProductTour useEffect - isVisible:', isVisible);
    if (isVisible) {
      console.log('ProductTour: isVisible changed to true');
      const timer = setTimeout(() => setIsAnimating(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    console.log('ProductTour: handleDismiss called');
    hideTour();
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleCompleteStep = (step: TourStep) => {
    completeStep(step.id);
    toast({
      title: "Step Completed! ✅",
      description: `${step.title} has been marked as complete.`,
    });
  };

  const handleNavigateToStep = (step: TourStep) => {
    if (step.page) {
      navigate(step.page);
      // Don't hide tour - let user navigate while keeping it open
    }
  };

  if (!isVisible) {
    console.log('ProductTour: Not visible, returning null');
    return null;
  }

  console.log('ProductTour: Rendering tour modal');

  return (
    <div
      className={`fixed bottom-20 right-6 z-50 transition-all duration-300 ease-out ${
        isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <Card className="w-96 shadow-2xl border-0 overflow-hidden">
        {/* Pink Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold">
              Getting Started with ClearCents
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 hover:bg-primary/20 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-primary/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* White Body */}
        <CardContent className="p-6 bg-white">
          {/* Checklist Items */}
          <div className="space-y-3 mb-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.completed 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-3 w-3 text-white" />
                  ) : (
                    <span className="text-gray-600 text-xs font-bold">{step.order}</span>
                  )}
                </div>
                <span className={`text-sm ${
                  step.completed 
                    ? 'text-gray-400 line-through' 
                    : 'text-gray-900 font-medium'
                }`}>
                  {step.title}
                </span>
                {!step.completed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigateToStep(step)}
                    className="ml-auto text-xs h-6 px-2 text-primary hover:text-primary/80"
                  >
                    Go
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Dismiss Checklist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Floating Action Button for first-time users
export function ProductTourFAB() {
  const { hasUncompletedSteps, hasSeenTour, showTour, isVisible, hideTour, isFABHidden, hideFAB } = useProductTourContext();

  console.log('ProductTourFAB render:', { hasUncompletedSteps, hasSeenTour, isVisible, isFABHidden });

  // Only show for first-time users or if there are uncompleted steps
  if (hasSeenTour && !hasUncompletedSteps) {
    console.log('ProductTourFAB: Not showing - hasSeenTour and no uncompleted steps');
    return null;
  }

  // Don't show if FAB is hidden
  if (isFABHidden) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('ProductTourFAB clicked!', e);
    
    // Toggle the tour - if it's visible, hide it; if hidden, show it
    if (isVisible) {
      hideTour();
    } else {
      showTour();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('Mouse down on FAB');
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    console.log('Mouse up on FAB');
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      console.log('Key pressed on FAB');
      if (isVisible) {
        hideTour();
      } else {
        showTour();
      }
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Icon clicked - preventing event');
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Close button clicked');
    hideFAB();
    // Also hide the tour if it's visible
    if (isVisible) {
      hideTour();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => console.log('Mouse enter FAB')}
        onMouseLeave={() => console.log('Mouse leave FAB')}
        className={`w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center relative cursor-pointer select-none ${
          isVisible ? 'bg-primary/80' : 'bg-primary hover:bg-primary/90'
        }`}
        style={{ 
          pointerEvents: 'auto',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div 
          onClick={handleIconClick}
          onMouseDown={handleIconClick}
          onMouseUp={handleIconClick}
          className="pointer-events-none"
        >
          <Sparkles className="h-6 w-6" />
        </div>
        
        {/* Notification Badge - Left Side */}
        {hasUncompletedSteps && (
          <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center pointer-events-none">
            <span className="text-white text-xs font-bold">
              {hasUncompletedSteps ? '1' : ''}
            </span>
          </div>
        )}
        
        {/* Close Button - Right Side */}
        <button
          onClick={handleCloseClick}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110"
          style={{ pointerEvents: 'auto' }}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
} 