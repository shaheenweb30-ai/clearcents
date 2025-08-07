import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
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
  TrendingUp
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

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
      // Mock subscription data - replace with actual API calls
      const mockSubscription: SubscriptionPlan = {
        id: "sub_123456789",
        name: "Pro Plan",
        price: 9.99,
        interval: 'monthly',
        features: [
          "Unlimited transactions",
          "Advanced analytics",
          "Export to Excel/PDF",
          "Priority support",
          "Custom categories",
          "Budget templates"
        ],
        status: 'active',
        currentPeriodStart: "2024-01-01T00:00:00Z",
        currentPeriodEnd: "2024-02-01T00:00:00Z",
        nextBillingDate: "2024-02-01T00:00:00Z"
      };

      const mockBillingHistory: BillingHistory[] = [
        {
          id: "inv_001",
          date: "2024-01-01T00:00:00Z",
          amount: 9.99,
          status: 'paid',
          description: "Pro Plan - Monthly",
          invoiceUrl: "#"
        },
        {
          id: "inv_002",
          date: "2023-12-01T00:00:00Z",
          amount: 9.99,
          status: 'paid',
          description: "Pro Plan - Monthly",
          invoiceUrl: "#"
        },
        {
          id: "inv_003",
          date: "2023-11-01T00:00:00Z",
          amount: 9.99,
          status: 'paid',
          description: "Pro Plan - Monthly",
          invoiceUrl: "#"
        }
      ];

      setSubscription(mockSubscription);
      setBillingHistory(mockBillingHistory);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading subscription...</p>
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
      <div className="space-y-6">
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Subscription Management
                </h1>
                <p className="text-muted-foreground mt-1 font-body">
                  Manage your subscription and billing information
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={fetchSubscriptionData}
                disabled={loadingSubscription}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingSubscription ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="billing">Billing History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {subscription ? (
                <>
                  {/* Current Plan Card */}
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Crown className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-heading">
                              {subscription.name}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              {getStatusBadge(subscription.status)}
                              <span className="text-sm text-muted-foreground">
                                {subscription.interval === 'monthly' ? 'Monthly' : 'Yearly'} billing
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {formatCurrency(subscription.price)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per {subscription.interval === 'monthly' ? 'month' : 'year'}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Billing Period */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Current Period</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Next Billing</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(subscription.nextBillingDate)}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Features */}
                      <div>
                        <h4 className="font-medium mb-3">Plan Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {subscription.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </Button>
                        <Button variant="outline">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Update Payment Method
                        </Button>
                        <Button variant="destructive">
                          Cancel Subscription
                        </Button>
                      </div>
                    </CardContent>
                  </Card>


                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="mb-4">
                      <Crown className="h-12 w-12 text-muted-foreground mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have an active subscription. Upgrade to unlock premium features.
                    </p>
                    <Button>
                      <Star className="h-4 w-4 mr-2" />
                      View Plans
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Billing History Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Billing History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {billingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {billingHistory.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{invoice.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(invoice.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                              {getBillingStatusBadge(invoice.status)}
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No billing history available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Payment Method</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Billing Address</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">
                        123 Main Street<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update Address
                    </Button>
                  </CardContent>
                </Card>

                {/* Notification Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Notifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Billing reminders</p>
                          <p className="text-sm text-muted-foreground">Get notified before billing</p>
                        </div>
                        <Button variant="outline" size="sm">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Payment confirmations</p>
                          <p className="text-sm text-muted-foreground">Receive payment receipts</p>
                        </div>
                        <Button variant="outline" size="sm">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Plan changes</p>
                          <p className="text-sm text-muted-foreground">Notify when plan is modified</p>
                        </div>
                        <Button variant="outline" size="sm">Enabled</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Change Billing Cycle
                      </Button>
                      <Button variant="destructive" className="w-full justify-start">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Cancel Subscription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Subscription; 