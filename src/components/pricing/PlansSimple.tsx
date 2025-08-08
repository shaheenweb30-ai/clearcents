import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { BillingState } from "./BillingControls";

interface PlansSimpleProps {
  billing: BillingState;
}

// Base USD prices (using $ as default)
const BASE_PRICES = { Free: 0, Pro: 12 };

function priceFor(plan: 'Free' | 'Pro', cycle: 'monthly' | 'yearly'): number {
  const usd = BASE_PRICES[plan];
  if (usd === 0) return 0;
  const perMonthUSD = cycle === 'yearly' ? usd * 0.8 : usd;
  return Math.round(perMonthUSD * 100) / 100;
}

const plans = [
  {
    name: 'Free',
    cta: 'Start free',
    ctaVariant: 'outline' as const,
    features: [
      'Real-time expense tracking',
      'Up to 10 categories',
      '1 budget',
      'AI insights (lite: 5 tips/mo)',
      'CSV import & export',
      'Multi-currency viewer',
      'Community support'
    ],
    smallPrint: 'Best for getting started.',
    popular: false
  },
  {
    name: 'Pro',
    cta: 'Start 14-day trial',
    ctaVariant: 'default' as const,
    features: [
      'Unlimited categories & budgets',
      'AI insights (full: 50+ tips/mo)',
      'Recurring detection & alerts',
      'Custom periods & auto-refresh',
      'Receipt attachments (email-in beta)',
      'Priority email support'
    ],
    smallPrint: 'Everything you need, no add-ons.',
    popular: true
  }
];

export const PlansSimple = ({ billing }: PlansSimpleProps) => {
  const getDisplayPrice = (plan: 'Free' | 'Pro') => {
    const price = priceFor(plan, billing.cycle);
    if (price === 0) return '0';
    return price.toString();
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-2xl ${
                plan.popular 
                  ? 'ring-2 ring-primary/20 shadow-lg bg-gradient-to-br from-background to-muted/30' 
                  : 'border-border'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && billing.cycle === 'yearly' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    Most value
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6 pt-8">
                {/* Plan Name */}
                <h3 className="font-heading font-bold text-2xl mb-4 text-foreground">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className="font-heading font-bold text-4xl text-foreground">
                      ${getDisplayPrice(plan.name as 'Free' | 'Pro')}
                    </span>
                    <span className="font-body text-lg text-muted-foreground ml-1">
                      /mo
                    </span>
                  </div>
                  {billing.cycle === 'yearly' && plan.name === 'Pro' && (
                    <div className="text-sm text-muted-foreground mt-1">
                      billed yearly
                    </div>
                  )}
                </div>

                {/* Small Print */}
                <p className="text-sm text-muted-foreground">
                  {plan.smallPrint}
                </p>
              </CardHeader>

              <CardContent className="px-6 pb-8">
                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  variant={plan.ctaVariant} 
                  size="lg" 
                  className="w-full rounded-xl"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
