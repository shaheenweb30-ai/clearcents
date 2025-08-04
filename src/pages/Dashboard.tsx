import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import ClearCentsNavigation from "@/components/ClearCentsNavigation";
import DateFilter, { DateRange } from "@/components/dashboard/DateFilter";
import ModernSummaryCards from "@/components/dashboard/ModernSummaryCards";
import SpendingChart from "@/components/dashboard/SpendingChart";
import TrendChart from "@/components/dashboard/TrendChart";
import EnhancedTransactionsTable from "@/components/dashboard/EnhancedTransactionsTable";
import AddTransactionDialog from "@/components/dashboard/AddTransactionDialog";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeView, setActiveView] = useState("budget");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/login");
        } else if (session) {
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Debug logging
  console.log('showAddDialog state:', showAddDialog);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <ClearCentsNavigation user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6">
        {/* ClearCents Dashboard Header */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                Financial Overview
              </h1>
              <p className="text-muted-foreground mt-1 font-body">
                Your complete financial picture at a glance
              </p>
            </div>
            <DateFilter onDateRangeChange={setDateRange} />
          </div>
        </div>

        <div className="space-y-8">
          {/* Top Row: Net Total + Budget Overview */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Net Total Card - Takes 2 columns */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-heading">Net Total</CardTitle>
              </CardHeader>
              <CardContent>
                <ModernSummaryCards dateRange={dateRange} key={`summary-${refreshKey}`} />
              </CardContent>
            </Card>

            {/* Budget Progress - Takes 1 column */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Budget Status</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                    <circle cx="60" cy="60" r="54" stroke="hsl(var(--accent))" strokeWidth="8" fill="none" 
                            strokeDasharray="216 339" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold">72%</div>
                      <div className="text-xs text-muted-foreground">spent</div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">$1,850 of $2,500</div>
                  <div className="text-xs text-accent font-medium">On Track</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Row: Insights + Trend */}
          <div className="grid lg:grid-cols-2 gap-6">
            <SpendingChart dateRange={dateRange} key={`spending-${refreshKey}`} />
            <TrendChart dateRange={dateRange} key={`trend-${refreshKey}`} />
          </div>

          {/* Bottom Row: Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedTransactionsTable dateRange={dateRange} key={`transactions-${refreshKey}`} />
            </CardContent>
          </Card>
        </div>

        {/* Desktop Floating Action Button */}
        <button
          onClick={() => setShowAddDialog(true)}
          className="hidden md:flex fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 items-center justify-center z-40"
          aria-label="Add transaction"
        >
          <Plus className="w-6 h-6" />
        </button>

        <AddTransactionDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleTransactionAdded}
        />
      </main>
    </div>
  );
};

export default Dashboard;