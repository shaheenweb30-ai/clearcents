import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
          Start free—upgrade when you're ready
        </h2>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-full font-semibold"
          >
            Start free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold"
          >
            Try Pro trial
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="space-y-2">
          <p className="text-white/80 text-sm">
            ✓ No credit card required for free plan
          </p>
          <p className="text-white/80 text-sm">
            ✓ 14-day free trial on Pro
          </p>
          <p className="text-white/80 text-sm">
            ✓ Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};
