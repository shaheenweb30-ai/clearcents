import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DateFilter, { DateRange } from "@/components/dashboard/DateFilter";
import QuickViewButtons from "@/components/dashboard/QuickViewButtons";
import ModernSummaryCards from "@/components/dashboard/ModernSummaryCards";
import SpendingChart from "@/components/dashboard/SpendingChart";
import TrendChart from "@/components/dashboard/TrendChart";
import EnhancedTransactionsTable from "@/components/dashboard/EnhancedTransactionsTable";
import QuickAddSidebar from "@/components/dashboard/QuickAddSidebar";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Top Header Section */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Good to see you, {firstName} 👋
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Here's your financial overview
                  </p>
                </div>
                <DateFilter onDateRangeChange={setDateRange} />
              </div>
              
              <QuickViewButtons activeView={activeView} onViewChange={setActiveView} />
            </div>

            {/* Summary Cards */}
            <ModernSummaryCards dateRange={dateRange} />

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              <SpendingChart dateRange={dateRange} />
              <TrendChart dateRange={dateRange} />
            </div>

            {/* Enhanced Transactions Table */}
            <EnhancedTransactionsTable dateRange={dateRange} />
          </div>

          {/* Right Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <QuickAddSidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;