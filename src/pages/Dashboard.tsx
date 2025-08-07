import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank, 
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category_id: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: string;
  created_at: string;
  updated_at: string;
}

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  totalSavings: number;
  categoryBudgets: Array<{
    category: Category;
    budget: Budget;
    spent: number;
    remaining: number;
    percentage: number;
  }>;
  recentTransactions: Transaction[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const { formatCurrency } = useSettings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalIncome: 0,
    totalExpenses: 0,
    totalBalance: 0,
    totalSavings: 0,
    categoryBudgets: [],
    recentTransactions: []
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.eq.${user?.id},is_default.eq.true`);

      if (categoriesError) throw categoriesError;

      // Fetch budgets
      const { data: budgets, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user?.id);

      if (budgetsError) throw budgetsError;

      // Calculate totals (positive amounts = income, negative = expense)
      const totalIncome = transactions
        ?.filter(t => t.amount > 0)
        ?.reduce((sum, t) => sum + t.amount, 0) || 0;

      const totalExpenses = transactions
        ?.filter(t => t.amount < 0)
        ?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

      const totalBalance = totalIncome - totalExpenses;
      const totalSavings = totalBalance;

      // Calculate category budgets
      const categoryBudgets = budgets?.map(budget => {
        const category = categories?.find(c => c.id === budget.category_id);
        const categoryTransactions = transactions?.filter(t => 
          t.category_id === budget.category_id && 
          t.amount < 0 // Only count expenses for budget tracking
        ) || [];
        
        const spent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const remaining = budget.amount - spent;
        const percentage = Math.min((spent / budget.amount) * 100, 100);

        return {
          category: category || { id: '', name: 'Unknown', color: '#666', icon: 'help', user_id: '', created_at: '', updated_at: '' },
          budget,
          spent,
          remaining,
          percentage
        };
      }) || [];

      setDashboardData({
        totalIncome,
        totalExpenses,
        totalBalance,
        totalSavings,
        categoryBudgets,
        recentTransactions: transactions?.slice(0, 5) || []
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBudgetStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-red-600', icon: AlertCircle };
    if (percentage >= 75) return { color: 'text-yellow-600', icon: Clock };
    return { color: 'text-green-600', icon: CheckCircle };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Financial Dashboard</h1>
              <p className="text-muted-foreground">Track your financial health at a glance</p>
            </div>
            <Button 
              onClick={() => navigate('/transactions')}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Transactions</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {dashboardData.recentTransactions.length}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Recent transactions
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(dashboardData.totalIncome)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {formatCurrency(dashboardData.totalExpenses)}
                </div>
                <p className="text-xs text-red-600 dark:text-red-400">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Net Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${dashboardData.totalBalance >= 0 ? 'text-purple-900 dark:text-purple-100' : 'text-red-900 dark:text-red-100'}`}>
                  {formatCurrency(dashboardData.totalBalance)}
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Income - Expenses
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track your spending against budgets
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.categoryBudgets.length > 0 ? (
                  dashboardData.categoryBudgets.map((item) => {
                    const status = getBudgetStatus(item.percentage);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div key={item.category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.category.color }}
                            />
                            <span className="font-medium">{item.category.name}</span>
                            <StatusIcon className={`w-4 h-4 ${status.color}`} />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.spent.toFixed(2)} / ${item.budget.amount.toFixed(2)}
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{item.percentage.toFixed(1)}% used</span>
                          <span>${item.remaining.toFixed(2)} remaining</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <PiggyBank className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No budgets set up yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigate('/settings')}
                    >
                      Set up budgets
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your latest financial activity
                </p>
              </CardHeader>
              <CardContent>
                {dashboardData.recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.recentTransactions.map((transaction) => {
                      const isIncome = transaction.amount > 0;
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              isIncome ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                Uncategorized
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              isIncome ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.transaction_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigate('/transactions')}
                    >
                      Add your first transaction
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Common tasks to help you manage your finances
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-20 flex-col space-y-3 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-green-300 text-green-700 hover:text-green-800 shadow-sm hover:shadow-md transition-all duration-300 group"
                  onClick={() => navigate('/transactions')}
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="font-semibold">Add Transaction</span>
                  <span className="text-xs text-green-600/70">Record income or expense</span>
                </Button>
                
                <Button 
                  className="h-20 flex-col space-y-3 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow-md transition-all duration-300 group"
                  onClick={() => navigate('/categories')}
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <PiggyBank className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="font-semibold">Categories & Budgets</span>
                  <span className="text-xs text-blue-600/70">Set spending limits</span>
                </Button>
                
                <Button 
                  className="h-20 flex-col space-y-3 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 shadow-sm hover:shadow-md transition-all duration-300 group"
                  onClick={() => navigate('/profile')}
                >
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="font-semibold">View Profile</span>
                  <span className="text-xs text-purple-600/70">Account settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
