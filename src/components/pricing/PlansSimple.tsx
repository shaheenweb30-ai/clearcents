import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Sparkles } from "lucide-react";
import { BillingState } from "./BillingControls";
import { useOptimizedPricingContent } from "@/hooks/useOptimizedPricingContent";
import { useAuth } from "@/contexts/AuthContext";
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
  const { toast } = useToast();
  const navigate = useNavigate();

  const getPlan = (key: PlanKey) => {
    const content = getContentBySection(key);
    
    let buttonText = content?.button_text || 'Start Free';
    
    // Customize button text based on user state and plan type
    if (key === 'free') {
      buttonText = user ? 'Current Plan' : 'Get Started Free';
    } else if (key === 'pro' && user) {
      buttonText = 'Upgrade to Pro';
    } else if (key === 'enterprise') {
      buttonText = 'Contact Sales';
    }
    
    return {
      key,
      name: (content?.title || (key.charAt(0).toUpperCase() + key.slice(1))) as string,
      cta: buttonText,
      ctaVariant: (key === 'free' ? 'outline' : key === 'enterprise' ? 'secondary' : 'default') as 'outline' | 'default' | 'secondary',
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
    if (planKey === 'free') {
      if (!user) {
        // Redirect unauthenticated users to sign-up
        navigate('/signup');
        return;
      }
      // If user is already signed in, they're already on the free plan
      toast({
        title: "You're already on the free plan!",
        description: "Enjoy your free features. Upgrade to Pro when you need more.",
      });
      return;
    }

    if (planKey === 'pro') {
      if (!user) {
        // Redirect unauthenticated users to sign-up
        navigate('/signup');
        return;
      }
      
      // For authenticated users, redirect directly to checkout
      navigate('/checkout?plan=pro');
      return;
    }

    if (planKey === 'enterprise') {
      navigate('/contact');
      return;
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-16 h-16 sm:w-20 sm:h-20 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-16 h-16 sm:w-20 sm:h-20 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-nunito font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
            Choose Your Plan
          </h2>
          <p className="font-nunito text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Start with our free plan and upgrade to Pro when you need more features.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10">
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

        {/* Plans Grid - 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.key} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 shadow-xl' 
                  : 'shadow-lg hover:shadow-xl'
              } ${plan.key === 'free' && !!user ? 'ring-2 ring-green-500 bg-green-50/30' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              {plan.key === 'free' && !!user && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-2 text-sm font-semibold">
                  Your Current Plan
                </div>
              )}
              
              <CardHeader className={`text-center pb-4 ${plan.popular || (plan.key === 'free' && !!user) ? 'pt-12' : 'pt-6'}`}>
                <div className="flex items-center justify-center mb-3">
                  {plan.key === 'free' && <Sparkles className="w-5 h-5 text-green-600 mr-2" />}
                  {plan.key === 'pro' && <Crown className="w-5 h-5 text-yellow-600 mr-2" />}
                  {plan.key === 'enterprise' && <Crown className="w-5 h-5 text-purple-600 mr-2" />}
                  <h3 className="font-nunito font-bold text-xl lg:text-2xl">
                    {plan.name}
                  </h3>
                </div>
                
                <div className="mb-3">
                  <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {plan.key === 'enterprise' ? '' : '$'}
                  </span>
                  <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {plan.key === 'enterprise' ? 'Contact us' : getDisplayPrice(plan.price)}
                  </span>
                  {plan.key !== 'enterprise' && plan.key !== 'free' && (
                    <span className="text-lg text-gray-600 ml-1">
                      /{billing.cycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  )}
                  {plan.key === 'free' && (
                    <span className="text-lg text-gray-600 ml-1">
                      /forever
                    </span>
                  )}
                </div>
                
                {plan.smallPrint && (
                  <p className="text-sm text-gray-600">{plan.smallPrint}</p>
                )}
              </CardHeader>
              
              <CardContent className="px-4 pb-6">
                {/* Features List - More compact */}
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <Button
                  variant={plan.ctaVariant}
                  size="lg"
                  className="w-full font-semibold"
                  onClick={() => handleCtaClick(plan.key)}
                  disabled={plan.key === 'free' && !!user}
                >
                  {plan.cta}
                </Button>
                
                {/* Additional info for free plan */}
                {plan.key === 'free' && !!user && (
                  <p className="text-xs text-green-600 text-center mt-2">
                    ✓ You're currently on the free plan
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom CTA - More compact */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-600 mb-3">
            Need help choosing? <button className="text-blue-600 hover:text-blue-700 font-medium underline">Contact our sales team</button>
          </p>
          <p className="text-xs text-gray-500">
            All plans include a 30-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
