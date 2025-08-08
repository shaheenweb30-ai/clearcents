import { useState } from "react";
import { PricingHero } from "./PricingHero";
import { BillingControls, BillingState } from "./BillingControls";
import { PlansSimple } from "./PlansSimple";
import { ComparisonSimple } from "./ComparisonSimple";
import { BillingNotes } from "./BillingNotes";
import { PricingFAQ } from "./PricingFAQ";
import { FinalCTA } from "./FinalCTA";

export const PricingPage = () => {
  const [billing, setBilling] = useState<BillingState>({
    cycle: 'monthly'
  });

  return (
    <div className="min-h-screen bg-background">
      <PricingHero />
      <BillingControls billing={billing} onBillingChange={setBilling} />
      <PlansSimple billing={billing} />
      <ComparisonSimple />
      <BillingNotes />
      <PricingFAQ />
      <FinalCTA />
    </div>
  );
};
