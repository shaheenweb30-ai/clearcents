import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type BillingCycle = 'monthly' | 'yearly';

export interface BillingState {
  cycle: BillingCycle;
}

interface BillingControlsProps {
  billing: BillingState;
  onBillingChange: (billing: BillingState) => void;
}

export const BillingControls = ({ billing, onBillingChange }: BillingControlsProps) => {
  const handleCycleChange = (cycle: BillingCycle) => {
    onBillingChange({ ...billing, cycle });
  };

  return (
    <section className="py-12 bg-background sticky top-16 z-40 backdrop-blur-sm bg-background/95 border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Billing cycle:</span>
            <div className="flex items-center bg-muted rounded-lg p-1" role="group" aria-label="Billing cycle selection">
              <Button
                variant={billing.cycle === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleCycleChange('monthly')}
                className="rounded-md"
                role="radio"
                aria-checked={billing.cycle === 'monthly'}
                aria-label="Monthly billing"
              >
                Monthly
              </Button>
              <Button
                variant={billing.cycle === 'yearly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleCycleChange('yearly')}
                className="rounded-md"
                role="radio"
                aria-checked={billing.cycle === 'yearly'}
                aria-label="Yearly billing"
              >
                Yearly
                {billing.cycle === 'yearly' && (
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
                    Save 20%
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
