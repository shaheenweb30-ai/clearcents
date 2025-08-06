import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useToast } from '@/hooks/use-toast';

export function OnboardingReset() {
  const { resetOnboarding, hasUncompletedTips } = useOnboarding();
  const { toast } = useToast();

  const handleReset = () => {
    resetOnboarding();
    toast({
      title: "Onboarding Reset",
      description: "Your onboarding tips have been reset. You'll see them again as you navigate through the app.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          <span>Onboarding Tips</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertDescription>
            {hasUncompletedTips 
              ? "You have uncompleted onboarding tips. Complete them to get the most out of ClearCents."
              : "You've completed all onboarding tips! Reset them if you'd like to see them again."
            }
          </AlertDescription>
        </Alert>
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Onboarding Tips
        </Button>
      </CardContent>
    </Card>
  );
} 