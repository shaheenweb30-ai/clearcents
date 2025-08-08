import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Crown } from "lucide-react";
import { BillingState } from "./BillingControls";

interface PlansSimpleProps {
  billing: BillingState;
  onBillingChange?: (billing: BillingState) => void;
}

// Base USD prices (using $ as default)
const BASE_PRICES = { Free: 0, Pro: 12, Enterprise: 29 };

function priceFor(plan: 'Free' | 'Pro' | 'Enterprise', cycle: 'monthly' | 'yearly'): number {
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
      'Priority email support',
      'Advanced analytics & reports',
      'Team collaboration (up to 5 users)'
    ],
    smallPrint: 'Everything you need, no add-ons.',
    popular: true
  },
  {
    name: 'Enterprise',
    cta: 'Contact sales',
    ctaVariant: 'default' as const,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Advanced security & compliance',
      'Custom integrations & API access',
      'Dedicated account manager',
      'Custom reporting & analytics',
      'White-label options',
      '24/7 priority support'
    ],
    smallPrint: 'For large organizations.',
    popular: false
  }
];

export const PlansSimple = ({ billing, onBillingChange }: PlansSimpleProps) => {
  const getDisplayPrice = (plan: 'Free' | 'Pro' | 'Enterprise') => {
    const price = priceFor(plan, billing.cycle);
    if (price === 0) return '0';
    return price.toString();
  };

  const handleCycleChange = (cycle: 'monthly' | 'yearly') => {
    if (onBillingChange) {
      onBillingChange({ ...billing, cycle });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <Sparkles className="w-4 h-4" />
            Choose Your Plan
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Simple pricing for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}everyone
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade when you're ready. No hidden fees.
          </p>

          {/* Billing Cycle Controls */}
          {onBillingChange && (
            <div className="flex items-center justify-center mb-8">
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
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2 rounded-2xl border-2 ${
                plan.popular 
                  ? 'ring-2 ring-blue-500/20 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50/30 border-blue-200' 
                  : plan.name === 'Enterprise'
                  ? 'ring-2 ring-purple-500/20 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50/30 border-purple-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && billing.cycle === 'yearly' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 shadow-lg">
                    Most value
                  </Badge>
                </div>
              )}

              {/* Enterprise Badge */}
              {plan.name === 'Enterprise' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 shadow-lg flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Enterprise
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6 pt-8">
                {/* Plan Name */}
                <h3 className="font-bold text-2xl mb-4 text-gray-900">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className="font-bold text-4xl text-gray-900">
                      ${getDisplayPrice(plan.name as 'Free' | 'Pro' | 'Enterprise')}
                    </span>
                    <span className="text-lg text-gray-600 ml-1">
                      /mo
                    </span>
                  </div>
                  {billing.cycle === 'yearly' && plan.name !== 'Free' && (
                    <div className="text-sm text-gray-500 mt-1">
                      billed yearly
                    </div>
                  )}
                  {plan.name === 'Enterprise' && (
                    <div className="text-sm text-gray-500 mt-1">
                      custom pricing
                    </div>
                  )}
                </div>

                {/* Small Print */}
                <p className="text-sm text-gray-600">
                  {plan.smallPrint}
                </p>
              </CardHeader>

              <CardContent className="px-6 pb-8">
                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  variant={plan.ctaVariant} 
                  size="lg" 
                  className={`w-full rounded-full font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : plan.name === 'Enterprise'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
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
