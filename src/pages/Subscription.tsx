import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
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
  Heart
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTrial } from "@/hooks/useTrial";

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatCurrency } = useSettings();
  const { trial, isTrialActive, startTrial, starting, refresh } = useTrial(user);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/login");
        } else if (session) {
          setLoading(false);
          fetchSubscriptionData();
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/login");
      } else {
        setLoading(false);
        fetchSubscriptionData();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchSubscriptionData = async () => {
    setLoadingSubscription(true);
    try {
      // Use trial to determine visible state until real billing is wired
      if (isTrialActive && trial) {
        const trialSub: SubscriptionPlan = {
          id: trial.id,
          name: 'Pro Trial',
          price: 0,
          interval: 'monthly',
          features: [
            'Pro features unlocked during trial',
            'Advanced analytics',
            'Priority support',
          ],
          status: 'trial',
          currentPeriodStart: trial.started_at,
          currentPeriodEnd: trial.ends_at,
          nextBillingDate: trial.ends_at,
        };
        setSubscription(trialSub);
      } else {
        // No active trial or paid subscription → treat as Free plan (no subscription object)
        setSubscription(null);
        setBillingHistory([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load subscription data",
        variant: "destructive",
      });
    } finally {
      setLoadingSubscription(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Expired</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Trial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getBillingStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
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



  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">Loading subscription...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Trial banner */}
          {trial && (
            <div className={`mb-6 p-4 rounded-xl border shadow-sm ${isTrialActive ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">{isTrialActive ? 'Your Pro trial is active' : 'Your trial has ended'}</p>
                    <p className="text-sm opacity-80">
                      {isTrialActive
                        ? `Ends ${new Date(trial.ends_at).toLocaleString()}`
                        : `Trial ended ${new Date(trial.ends_at).toLocaleString()}`}
                    </p>
                  </div>
                </div>
                {!isTrialActive && (
                  <Button onClick={() => navigate('/pricing')} variant="default">
                    Upgrade
                  </Button>
                )}
              </div>
            </div>
          )}
          {/* Enhanced Header with Gradient Background */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8 mb-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-heading font-bold text-white">
                      Subscription Management
                    </h1>
                    <p className="text-blue-100 text-lg font-body">
                      Manage your subscription and billing information
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="secondary" 
                onClick={fetchSubscriptionData}
                disabled={loadingSubscription}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${loadingSubscription ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-1 rounded-xl shadow-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200">
                Overview
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200">
                Billing History
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {subscription ? (
                <>
                  {/* Enhanced Current Plan Card */}
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>
                    <CardHeader className="pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <Crown className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-heading text-slate-800 dark:text-slate-100">
                              {subscription.name}
                            </CardTitle>
                            <div className="flex items-center space-x-3 mt-2">
                              {getStatusBadge(subscription.status)}
                              <span className="text-sm text-muted-foreground bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                                {subscription.interval === 'monthly' ? 'Monthly' : 'Yearly'} billing
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-slate-800 dark:text-slate-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {formatCurrency(subscription.price)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per {subscription.interval === 'monthly' ? 'month' : 'year'}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Enhanced Billing Period */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Current Period</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                          </p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/30">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                              <Clock className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Next Billing</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {formatDate(subscription.nextBillingDate)}
                          </p>
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                      {/* Enhanced Features */}
                      <div>
                        <h4 className="font-semibold text-lg mb-4 text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                          <Sparkles className="h-5 w-5 text-blue-500" />
                          <span>Plan Features</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {subscription.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/30">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-slate-700 dark:text-slate-200">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                      {/* Enhanced Actions */}
                      <div className="flex flex-wrap gap-4">
                        <Button variant="outline" className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </Button>
                        <Button variant="outline" className="bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 transition-all duration-200 shadow-md hover:shadow-lg">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Update Payment Method
                        </Button>
                        <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Cancel Subscription
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-3 bg-emerald-500 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Value</p>
                            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Excellent</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/30">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-3 bg-amber-500 rounded-xl">
                            <Gift className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Perks</p>
                            <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">Premium</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20 border border-rose-200/50 dark:border-rose-800/30">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-3 bg-rose-500 rounded-xl">
                            <Heart className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-rose-700 dark:text-rose-300">Support</p>
                            <p className="text-2xl font-bold text-rose-800 dark:text-rose-200">Priority</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                  <CardContent className="p-12 text-center">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-3 text-slate-800 dark:text-slate-100">You’re on the Free plan</h3>
                    <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                      Start a free 1‑day Pro trial to experience premium features, then upgrade if you love it.
                    </p>
                    <Button onClick={() => startTrial().then(res => { if (res.ok) navigate('/subscription'); })} disabled={starting} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg">
                      <Star className="h-5 w-5 mr-2" />
                      Start 1‑day Trial
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Enhanced Billing History Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <CardTitle className="font-heading flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <span>Billing History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {billingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {billingHistory.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-6 border border-slate-200/50 dark:border-slate-700/50 rounded-xl bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50 hover:from-slate-100/50 hover:to-blue-50/50 dark:hover:from-slate-700/50 dark:hover:to-blue-950/20 transition-all duration-200 shadow-sm hover:shadow-md">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
                              <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-100">{invoice.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(invoice.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{formatCurrency(invoice.amount)}</p>
                              {getBillingStatusBadge(invoice.status)}
                            </div>
                            <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-muted-foreground text-lg">No billing history available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Settings Tab */}
            <TabsContent value="settings" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Enhanced Payment Method */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-slate-900 border border-emerald-200/50 dark:border-emerald-800/30">
                  <CardHeader className="border-b border-emerald-200/50 dark:border-emerald-700/30">
                    <CardTitle className="font-heading flex items-center space-x-3">
                      <div className="p-2 bg-emerald-500 rounded-lg">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <span>Payment Method</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-emerald-200/50 dark:border-emerald-700/30 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded shadow-md"></div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200">
                        Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Billing Address */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-800 dark:to-slate-900 border border-purple-200/50 dark:border-purple-800/30">
                  <CardHeader className="border-b border-purple-200/50 dark:border-purple-700/30">
                    <CardTitle className="font-heading flex items-center space-x-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span>Billing Address</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="p-4 border border-purple-200/50 dark:border-purple-700/30 rounded-xl bg-gradient-to-r from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900/50">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">John Doe</p>
                      <p className="text-sm text-muted-foreground">
                        123 Main Street<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 w-full">
                      Update Address
                    </Button>
                  </CardContent>
                </Card>

                {/* Enhanced Notification Preferences */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-800 dark:to-slate-900 border border-amber-200/50 dark:border-amber-800/30">
                  <CardHeader className="border-b border-amber-200/50 dark:border-amber-700/30">
                    <CardTitle className="font-heading flex items-center space-x-3">
                      <div className="p-2 bg-amber-500 rounded-lg">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <span>Notifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900/50 rounded-lg border border-amber-200/50 dark:border-amber-700/30">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">Billing reminders</p>
                          <p className="text-sm text-muted-foreground">Get notified before billing</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all duration-200">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900/50 rounded-lg border border-amber-200/50 dark:border-amber-700/30">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">Payment confirmations</p>
                          <p className="text-sm text-muted-foreground">Receive payment receipts</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all duration-200">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900/50 rounded-lg border border-amber-200/50 dark:border-amber-700/30">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">Plan changes</p>
                          <p className="text-sm text-muted-foreground">Notify when plan is modified</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all duration-200">Enabled</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Subscription Actions */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-rose-50/50 dark:from-slate-800 dark:to-slate-900 border border-rose-200/50 dark:border-rose-800/30">
                  <CardHeader className="border-b border-rose-200/50 dark:border-rose-700/30">
                    <CardTitle className="font-heading flex items-center space-x-3">
                      <div className="p-2 bg-rose-500 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <span>Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Change Billing Cycle
                      </Button>
                      <Button variant="destructive" className="w-full justify-start bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-lg transition-all duration-200">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Cancel Subscription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription; 