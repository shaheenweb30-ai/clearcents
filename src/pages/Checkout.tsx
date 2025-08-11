import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOptimizedPricingContent } from "@/hooks/useOptimizedPricingContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Crown,
  CheckCircle,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Lock
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface CheckoutPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

const Checkout = () => {
  console.log('Checkout component rendered');
  
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { getContentBySection, loading: pricingLoading } = useOptimizedPricingContent();
  
  // Get plan from URL params or default to pro
  const planType = searchParams.get('plan') || 'pro';
  
  console.log('Checkout - planType:', planType);
  console.log('Checkout - user:', user);

  // Get dynamic pricing data
  const proContent = getContentBySection('pro');
  const freeContent = getContentBySection('free');
  const proPrice = proContent?.price || 12; // Fallback price
  const freePrice = freeContent?.price || 0; // Free plan
  
  // Calculate yearly price (20% discount)
  const yearlyPrice = proPrice * 12 * 0.8;
  
  const plans: CheckoutPlan[] = [
    {
      id: 'free',
      name: freeContent?.title || 'Free Plan',
      price: 0,
      interval: 'monthly',
      features: freeContent?.features || [
        'Real-time expense tracking',
        'Up to 10 categories',
        '1 budget',
        'AI insights (lite: 5 tips/mo)',
        'CSV import & export',
        'Multi-currency viewer',
        'Community support'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: proContent?.title || 'Pro Plan',
      price: selectedPlan === 'yearly' ? yearlyPrice : proPrice,
      interval: selectedPlan,
      features: proContent?.features || [
        'Unlimited categories & budgets',
        'AI insights (full: 50+ tips/mo)',
        'Recurring detection & alerts',
        'Custom periods & auto-refresh',
        'Receipt attachments (email-in beta)',
        'Priority email support',
        'Advanced analytics & reports',
        'Team collaboration features',
        'API access',
        'White-label options'
      ],
      popular: proContent?.is_popular || true
    }
  ];

  const currentPlan = plans.find(p => p.id === planType);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Allow authenticated users to access checkout for Pro upgrade
    console.log('Checkout: User authenticated, allowing access');
  }, [user, navigate]);

  // Show loading state while pricing is loading
  if (pricingLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Loading pricing...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handlePlanChange = (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
  };

  const handleCardInputChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPlan) return;
    
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would integrate with Stripe or another payment processor
      // For now, we'll simulate a successful payment
      
      toast({
        title: "Payment successful! 🎉",
        description: `Your ${currentPlan.name} subscription is now active.`,
      });
      
      // Redirect to subscription page
      navigate('/subscription');
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !currentPlan) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
              Upgrade to Pro
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
              Get Pro Access
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Unlock all Pro features with your subscription
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Plan Selection */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
                  Choose Your Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Billing Toggle */}
                <div className="bg-slate-100/50 dark:bg-slate-700/50 rounded-lg p-1">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handlePlanChange('monthly')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedPlan === 'monthly'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => handlePlanChange('yearly')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedPlan === 'yearly'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      Yearly
                      <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Save 20%</span>
                    </button>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                      {currentPlan.name}
                    </h3>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${currentPlan.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      per {selectedPlan === 'yearly' ? 'year' : 'month'}
                    </div>
                    {selectedPlan === 'yearly' && (
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Save 20% with yearly billing
                      </div>
                    )}
                    {selectedPlan === 'yearly' && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        (${proPrice.toFixed(2)}/month normally)
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Debug info for pricing */}
                  <div className="mt-4 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400">
                    <div>Dynamic Pricing: ${proPrice}/month</div>
                    <div>Yearly Price: ${yearlyPrice.toFixed(2)}/year</div>
                    <div>Plan Content: {proContent ? 'Loaded' : 'Not found'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => handleCardInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => handleCardInputChange('number', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={(e) => handleCardInputChange('cvc', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Pay ${currentPlan.price.toFixed(2)}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      🔒 Your payment is secure and encrypted
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <Card className="rounded-xl border-0 bg-slate-50/50 dark:bg-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Secure Payment Processing
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    All payments are processed securely through industry-standard encryption. 
                    Your card information is never stored on our servers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Checkout;
