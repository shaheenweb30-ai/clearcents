import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Crown } from "lucide-react";
import { BillingState } from "./BillingControls";
import { useOptimizedPricingContent } from "@/hooks/useOptimizedPricingContent";
import { useAuth } from "@/contexts/AuthContext";
import { useTrial } from "@/hooks/useTrial";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PlansSimpleProps {
  billing: BillingState;
  onBillingChange?: (billing: BillingState) => void;
}

type PlanKey = 'free' | 'pro' | 'enterprise';

export const PlansSimple = ({ billing, onBillingChange }: PlansSimpleProps) => {
  const { getContentBySection } = useOptimizedPricingContent();
  const { user } = useAuth();
  const { startTrial, starting, isTrialActive } = useTrial(user);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getPlan = (key: PlanKey) => {
    const content = getContentBySection(key);
    return {
      key,
      name: (content?.title || (key.charAt(0).toUpperCase() + key.slice(1))) as string,
      cta: (content?.button_text || (key === 'enterprise' ? 'Contact sales' : key === 'pro' ? 'Start 1-day trial' : 'Start free')) as string,
      ctaVariant: (key === 'free' ? 'outline' : 'default') as const,
      features: (content?.features || []) as string[],
      smallPrint: (content?.description || '') as string,
      popular: Boolean(content?.is_popular),
      price: typeof content?.price === 'number' ? content?.price : key === 'free' ? 0 : key === 'pro' ? 12 : 29,
    };
  };

  const plans = [getPlan('free'), getPlan('pro'), getPlan('enterprise')];

  const getDisplayPrice = (price: number) => {
    if (price === 0) return '0';
    const perMonth = billing.cycle === 'yearly' ? price * 0.8 : price;
    return Math.round(perMonth * 100) / 100 + '';
  };

  const handleCycleChange = (cycle: 'monthly' | 'yearly') => {
    if (onBillingChange) {
      onBillingChange({ ...billing, cycle });
    }
  };

  const handleCtaClick = async (planKey: PlanKey) => {
    if (planKey === 'pro') {
      if (!user) {
        navigate('/login');
        return;
      }
      if (isTrialActive) {
        navigate('/subscription');
        return;
      }
      const result = await startTrial();
      if (result.ok) {
        toast({
          title: result.alreadyExists ? 'Trial already active' : 'Trial started',
          description: 'You have full Pro access for the next 24 hours.',
        });
        navigate('/subscription');
      } else {
        toast({
          title: 'Could not start trial',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
      }
      return;
    }

    if (planKey === 'free') {
      navigate('/');
      return;
    }

    if (planKey === 'enterprise') {
      navigate('/contact');
      return;
    }
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-16 h-16 sm:w-24 sm:h-24 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-20 h-20 sm:w-32 sm:h-32 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-nunito font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 sm:mb-6">
            Choose Your Plan
          </h2>
          <p className="font-nunito text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Start with our free plan and upgrade as you grow. All plans include core features with no hidden fees.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <div className="flex space-x-1">
              <button
                onClick={() => handleCycleChange('monthly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  billing.cycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleCycleChange('yearly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  billing.cycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {plans.map((plan) => (
            <Card 
              key={plan.key} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 shadow-xl' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={`text-center pb-4 ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="flex items-center justify-center mb-2">
                  {plan.key === 'free' && <Sparkles className="w-5 h-5 text-gray-600 mr-2" />}
                  {plan.key === 'pro' && <Crown className="w-5 h-5 text-yellow-600 mr-2" />}
                  {plan.key === 'enterprise' && <Crown className="w-5 h-5 text-purple-600 mr-2" />}
                  <h3 className="font-nunito font-bold text-xl sm:text-2xl lg:text-3xl">
                    {plan.name}
                  </h3>
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                    {plan.key === 'enterprise' ? '' : '$'}
                  </span>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                    {plan.key === 'enterprise' ? 'Contact us' : getDisplayPrice(plan.price)}
                  </span>
                  {plan.key !== 'enterprise' && (
                    <span className="text-lg sm:text-xl text-gray-600 ml-1">
                      /{billing.cycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                
                {plan.smallPrint && (
                  <p className="text-sm text-gray-600 mb-4">{plan.smallPrint}</p>
                )}
              </CardHeader>
              
              <CardContent className="px-4 sm:px-6 pb-6">
                {/* Features List */}
                <ul className="space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <Button
                  variant={plan.ctaVariant}
                  size="lg"
                  className="w-full font-semibold text-sm sm:text-base"
                  onClick={() => handleCtaClick(plan.key)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Need help choosing? <button className="text-blue-600 hover:text-blue-700 font-medium underline">Contact our sales team</button>
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            All plans include a 30-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
