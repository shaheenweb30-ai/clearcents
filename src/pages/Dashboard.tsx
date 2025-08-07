import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Eye,
  Receipt,
  Filter,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SpendingInsights } from "@/components/SpendingInsights";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchTotalBudget();
    }
  }, [user]);

  useEffect(() => {
    calculateFinancialMetrics();
  }, [transactions, totalBudget]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }
      
      console.log('Fetched transactions:', data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchTotalBudget = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('amount')
        .eq('user_id', user.id)
        .eq('period', 'monthly');

      if (error) {
        console.error('Error fetching budgets:', error);
        return;
      }
      
      const total = data?.reduce((sum, budget) => sum + budget.amount, 0) || 0;
      setTotalBudget(total);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const calculateFinancialMetrics = () => {
    if (!transactions || transactions.length === 0) {
      setTotalIncome(0);
      setTotalExpenses(0);
      setTotalSavings(0);
      return;
    }

    // Get current month's transactions
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transaction_date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    // Calculate income (positive amounts)
    const income = currentMonthTransactions
      .filter(transaction => transaction.amount > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    // Calculate expenses (negative amounts)
    const expenses = currentMonthTransactions
      .filter(transaction => transaction.amount < 0)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    // Calculate savings (total budget - expenses)
    const savings = totalBudget - expenses;

    console.log('Financial Metrics Calculation:', {
      totalTransactions: transactions.length,
      currentMonthTransactions: currentMonthTransactions.length,
      income,
      expenses,
      savings,
      totalBudget,
      currentMonth,
      currentYear
    });

    setTotalIncome(income);
    setTotalExpenses(expenses);
    setTotalSavings(savings);
  };

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }
      
      setUser(user);
    } catch (error) {
      console.error("Error getting user:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout hideHeader={true}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Filter Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsFilterPanelOpen(true)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Financial Overview Cards */}
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly budget allocation
                </p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  This month's income
                </p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  This month's expenses
                </p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Budget minus expenses
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-semibold text-foreground">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
                <Button onClick={() => navigate("/transactions")} className="h-12">
                  <Receipt className="h-4 w-4 mr-2" />
                  View Transactions
                </Button>
                <Button onClick={() => navigate("/profile")} className="h-12">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Spending Insights */}
          <SpendingInsights userId={user.id} transactions={transactions} />

          {/* Filter Side Panel */}
          {isFilterPanelOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsFilterPanelOpen(false)} />
              <div className="relative w-full sm:w-96 h-[80vh] sm:h-auto bg-white rounded-t-xl sm:rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Dashboard Filters</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsFilterPanelOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[calc(80vh-120px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div className="text-center text-muted-foreground">
                    <p>Filter options coming soon...</p>
                    <p className="text-sm mt-2">You'll be able to filter dashboard data by date range, categories, and more.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 