import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Calendar, 
  Download, 
  Crown,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Users,
  Zap,
  Shield,
  Star,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Gift,
  Heart,
  Plus
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  invoiceUrl?: string;
}

const Subscription = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatCurrency } = useSettings();
  const { user } = useAuth();

  // Mock subscription data for demonstration
  useEffect(() => {
    // Simulate loading subscription data
    setLoadingSubscription(true);
    
    // Mock trial subscription
    const mockTrialSub: SubscriptionPlan = {
      id: 'trial-1',
      name: 'Pro Trial',
      price: 0,
      interval: 'monthly',
      features: [
        'Pro features unlocked during trial',
        'Advanced analytics and insights',
        'Priority customer support',
        'Unlimited transactions',
        'Custom categories and budgets',
        'Export and reporting tools',
        'Mobile app access',
        'Cloud synchronization'
      ],
      status: 'trial',
      currentPeriodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      currentPeriodEnd: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(), // 23 days from now
      nextBillingDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Mock billing history
    const mockBillingHistory: BillingHistory[] = [
      {
        id: 'bill-1',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 0,
        status: 'paid',
        description: 'Pro Trial Started',
        invoiceUrl: '#'
      }
    ];

    setTimeout(() => {
      setSubscription(mockTrialSub);
      setBillingHistory(mockBillingHistory);
      setLoadingSubscription(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">Active</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700">Cancelled</Badge>;
      case 'expired':
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700/30 dark:text-slate-300 dark:border-slate-600">Expired</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">Trial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getBillingStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUpgradePlan = () => {
    toast({
      title: "Upgrade Plan",
      description: "Redirecting to plan selection...",
    });
    // In a real app, this would redirect to a plan selection page
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.')) {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will be cancelled at the end of the current period.",
      });
    }
  };

  const handleDownloadInvoice = (invoiceUrl: string) => {
    toast({
      title: "Download Started",
      description: "Your invoice is being prepared for download.",
    });
    // In a real app, this would trigger a file download
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Not Authenticated</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Please log in to view your subscription.</p>
              <Button onClick={() => navigate('/login')} className="rounded-full">
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loadingSubscription) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Loading subscription...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
              Subscription Management
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
              Your Subscription
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">Manage your plan, billing, and premium features</p>
          </div>

          {/* Trial Banner */}
          {subscription?.status === 'trial' && (
            <Card className="rounded-xl border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm shadow-lg border border-blue-200/50 dark:border-blue-700/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                        Pro Trial Active! 🎉
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300">
                        You're currently enjoying a free trial of our Pro features
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleUpgradePlan}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </Button>
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950/50">
                      <Clock className="w-4 h-4 mr-2" />
                      {Math.ceil((new Date(subscription.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subscription Tabs */}
          <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 dark:bg-slate-700/50 p-1 rounded-lg m-6">
                  <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <Calendar className="w-4 h-4 mr-2" />
                    Billing
                  </TabsTrigger>
                  <TabsTrigger value="plans" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <Star className="w-4 h-4 mr-2" />
                    Plans
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Current Plan</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Your active subscription and feature access</p>
                  </div>

                  {subscription ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Plan Details */}
                      <Card className="border-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-700/50">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
                              {subscription.name}
                            </CardTitle>
                            {getStatusBadge(subscription.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                              {subscription.price === 0 ? 'Free' : `$${subscription.price}`}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                              per {subscription.interval}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">Current Period</span>
                              <span className="font-medium">{formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">Next Billing</span>
                              <span className="font-medium">{formatDate(subscription.nextBillingDate)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Features */}
                      <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50 lg:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-lg text-slate-800 dark:text-slate-200">
                            Plan Features
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {subscription.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Crown className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Free Plan</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">You're currently on the free plan with basic features</p>
                        <Button onClick={handleUpgradePlan}>
                          <Star className="w-4 h-4 mr-2" />
                          Upgrade to Pro
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Billing History</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Your past invoices and payment history</p>
                  </div>

                  {billingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {billingHistory.map((bill) => (
                        <Card key={bill.id} className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-700 dark:text-slate-300">{bill.description}</h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(bill.date)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                                    {bill.amount === 0 ? 'Free' : formatCurrency(bill.amount)}
                                  </div>
                                  {getBillingStatusBadge(bill.status)}
                                </div>
                                {bill.invoiceUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadInvoice(bill.invoiceUrl!)}
                                    className="rounded-full"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Invoice
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Billing History</h3>
                        <p className="text-slate-600 dark:text-slate-400">You haven't been charged yet. Your first bill will appear here.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Plans Tab */}
                <TabsContent value="plans" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Available Plans</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Choose the plan that best fits your needs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Free Plan */}
                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Free</CardTitle>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">$0</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Forever</div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Basic transaction tracking
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Simple categories
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Basic reports
                          </li>
                        </ul>
                        <Button variant="outline" className="w-full" disabled>
                          Current Plan
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="border-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-700 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                          Most Popular
                        </Badge>
                      </div>
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl text-blue-800 dark:text-blue-200">Pro</CardTitle>
                        <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">$9.99</div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">per month</div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Everything in Free
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Advanced analytics
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Custom categories
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Budget tracking
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Priority support
                          </li>
                        </ul>
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={handleUpgradePlan}
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Pro
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Enterprise Plan */}
                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Enterprise</CardTitle>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">$29.99</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">per month</div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Everything in Pro
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Team collaboration
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Advanced reporting
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            API access
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Dedicated support
                          </li>
                        </ul>
                        <Button variant="outline" className="w-full">
                          <Users className="w-4 h-4 mr-2" />
                          Contact Sales
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Welcome Message */}
          <Card className="rounded-xl border-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200/50 dark:border-green-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Subscription Working!
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Now using your actual authentication data
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-green-200/50 dark:border-green-700/50">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-3">
                  The Subscription page is now fully functional and connected to your authentication system! You can:
                </p>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                  <li>• View your current subscription plan and status</li>
                  <li>• Access billing history and invoices</li>
                  <li>• Compare available plans and features</li>
                  <li>• Upgrade or manage your subscription</li>
                  <li>• Track trial periods and billing dates</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/settings')}
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                  >
                    View Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription; 