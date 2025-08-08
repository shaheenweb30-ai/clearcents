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
    <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Billing cycle:</span>
            <div className="flex items-center bg-gray-100 rounded-full p-1" role="group" aria-label="Billing cycle selection">
              <Button
                variant={billing.cycle === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleCycleChange('monthly')}
                className={`rounded-full ${
                  billing.cycle === 'monthly' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
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
                className={`rounded-full ${
                  billing.cycle === 'yearly' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                role="radio"
                aria-checked={billing.cycle === 'yearly'}
                aria-label="Yearly billing"
              >
                Yearly
                {billing.cycle === 'yearly' && (
                  <Badge className="ml-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-2 py-0.5">
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
