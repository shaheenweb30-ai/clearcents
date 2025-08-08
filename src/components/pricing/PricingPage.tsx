import { useState } from "react";
import { BillingState } from "./BillingControls";
import { PlansSimple } from "./PlansSimple";
import { ComparisonSimple } from "./ComparisonSimple";
import { PricingFAQ } from "./PricingFAQ";
import { FinalCTA } from "./FinalCTA";

export const PricingPage = () => {
  const [billing, setBilling] = useState<BillingState>({
    cycle: 'monthly'
  });

  return (
    <div className="min-h-screen bg-background">
      <PlansSimple billing={billing} onBillingChange={setBilling} />
      <ComparisonSimple />
      <PricingFAQ />
      <FinalCTA />
    </div>
  );
};
