import { Badge } from "@/components/ui/badge";

export const PricingHero = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trial Badge */}
        <Badge variant="secondary" className="mb-6 bg-green-100 text-green-800 border-green-200">
          14-day trial on Pro
        </Badge>
        
        {/* Main Headline */}
        <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
          Simple pricing—start free, upgrade when ready
        </h1>
        
        {/* Subheadline */}
        <p className="font-body text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
          One plan that unlocks everything. No hidden tiers.
        </p>
        
        {/* Micro Trust Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Bank-level security</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>100+ currencies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Real-time analytics</span>
          </div>
        </div>
      </div>
    </section>
  );
};
