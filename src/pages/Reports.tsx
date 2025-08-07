import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3,
  LineChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";

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

interface ReportsData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
    balance: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  topExpenses: Array<{
    description: string;
    amount: number;
    date: string;
    category: string;
  }>;
  spendingTrends: Array<{
    period: string;
    change: number;
    trend: 'up' | 'down';
  }>;
}

const Reports = () => {
  const { user } = useAuth();
  const { formatCurrency } = useSettings();
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<ReportsData>({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    monthlyData: [],
    categoryBreakdown: [],
    topExpenses: [],
    spendingTrends: []
  });

  useEffect(() => {
    if (user) {
      fetchReportsData();
    }
  }, [user]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (transactions) {
        processReportsData(transactions);
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processReportsData = (transactions: Transaction[]) => {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    // Generate monthly data for the last 6 months
    const monthlyData = generateMonthlyData(transactions);
    
    // Generate category breakdown
    const categoryBreakdown = generateCategoryBreakdown(transactions);
    
    // Get top expenses
    const topExpenses = transactions
      .filter(t => t.amount < 0)
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 5)
      .map(t => ({
        description: t.description,
        amount: Math.abs(t.amount),
        date: new Date(t.transaction_date).toLocaleDateString(),
        category: 'Uncategorized' // You can enhance this with actual category data
      }));

    // Generate spending trends
    const spendingTrends = generateSpendingTrends(transactions);

    setReportsData({
      totalIncome,
      totalExpenses,
      netBalance,
      monthlyData,
      categoryBreakdown,
      topExpenses,
      spendingTrends
    });
  };

  const generateMonthlyData = (transactions: Transaction[]) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
      });

      const income = monthTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      months.push({
        month: monthName,
        income,
        expenses,
        balance: income - expenses
      });
    }

    return months;
  };

  const generateCategoryBreakdown = (transactions: Transaction[]) => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.amount < 0) // Only expenses
      .forEach(t => {
        const category = 'Uncategorized'; // You can enhance this with actual category data
        categoryMap.set(category, (categoryMap.get(category) || 0) + Math.abs(t.amount));
      });

    const total = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
    return Array.from(categoryMap.entries()).map(([category, amount], index) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: colors[index % colors.length]
    }));
  };

  const generateSpendingTrends = (transactions: Transaction[]) => {
    // Mock data for spending trends
    return [
      { period: 'This Week', change: 12.5, trend: 'up' as const },
      { period: 'This Month', change: 8.2, trend: 'down' as const },
      { period: 'This Quarter', change: 15.7, trend: 'up' as const }
    ];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Financial Reports</h1>
          <p className="text-muted-foreground text-lg">Visual insights and analytics for your financial data</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Income</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(reportsData.totalIncome)}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-900">{formatCurrency(reportsData.totalExpenses)}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Net Balance</p>
                  <p className={`text-2xl font-bold ${reportsData.netBalance >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                    {formatCurrency(reportsData.netBalance)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-primary" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.monthlyData.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{month.month}</span>
                      </div>
                      <div>
                        <p className="font-medium">{month.month}</p>
                        <p className="text-sm text-muted-foreground">
                          Income: {formatCurrency(month.income)} | Expenses: {formatCurrency(month.expenses)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(month.balance)}
                      </p>
                      <div className="flex items-center gap-1">
                        {month.balance >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {month.balance >= 0 ? 'Positive' : 'Negative'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.categoryBreakdown.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(category.amount)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${category.percentage}%`, 
                            backgroundColor: category.color 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{category.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Expenses & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Top Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportsData.topExpenses.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-red-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">{expense.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{formatCurrency(expense.amount)}</p>
                      <Badge variant="secondary" className="text-xs">{expense.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Spending Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Spending Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.spendingTrends.map((trend, index) => (
                  <div key={trend.period} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        trend.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {trend.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{trend.period}</p>
                        <p className="text-sm text-muted-foreground">
                          {trend.trend === 'up' ? 'Increased' : 'Decreased'} spending
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${trend.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.change}%
                      </p>
                      <Badge 
                        variant={trend.trend === 'up' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {trend.trend === 'up' ? 'Trending Up' : 'Trending Down'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <Button className="bg-primary hover:bg-primary/90">
                <Eye className="w-4 h-4 mr-2" />
                View Detailed Report
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Custom Date Range
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
