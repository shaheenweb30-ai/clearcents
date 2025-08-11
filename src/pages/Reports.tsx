import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  RefreshCw,
  Sparkles,
  Brain,
  Zap,
  Crown,
  Lock,
  Unlock,
  CheckCircle,
  X,
  FileText,
  Activity,
  BrainCircuit,
  ChartBar,
  DownloadCloud,
  FileSpreadsheet,
  CalendarDays,
  TrendingUpIcon,
  Users,
  CreditCard,
  PiggyBank,
  AlertTriangle,
  Lightbulb,
  Clock,
  Award,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
    date: Date;
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
  savingsRate: number;
  emergencyFundStatus: 'excellent' | 'good' | 'fair' | 'poor';
  budgetAdherence: number;
  // New fields for enhanced reports
  spendingPatterns: Array<{
    dayOfWeek: string;
    averageSpending: number;
    transactionCount: number;
  }>;
  budgetComparison: Array<{
    category: string;
    budgeted: number;
    actual: number;
    variance: number;
    status: 'under' | 'over' | 'on-track';
  }>;
  financialGoals: Array<{
    name: string;
    target: number;
    current: number;
    progress: number;
    deadline: string;
    status: 'on-track' | 'behind' | 'ahead';
  }>;
  cashFlowAnalysis: Array<{
    period: string;
    cashIn: number;
    cashOut: number;
    netCashFlow: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
}

interface AIInsight {
  id: string;
  type: 'warning' | 'recommendation' | 'achievement' | 'opportunity';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  impact: 'positive' | 'negative' | 'neutral';
}

const Reports = () => {
  const { user } = useAuth();
  const { formatCurrency, preferences } = useSettings();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<'overview' | 'detailed' | 'custom'>('overview');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  const [reportsData, setReportsData] = useState<ReportsData>({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    monthlyData: [],
    categoryBreakdown: [],
    topExpenses: [],
    spendingTrends: [],
    savingsRate: 0,
    emergencyFundStatus: 'fair',
    budgetAdherence: 0,
    // Initialize new fields
    spendingPatterns: [],
    budgetComparison: [],
    financialGoals: [],
    cashFlowAnalysis: []
  });
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'recommendation',
      title: 'Increase Emergency Fund',
      description: 'Your emergency fund covers 2.5 months of expenses. Consider building it to 6 months for better financial security.',
      priority: 'high',
      actionRequired: true,
      impact: 'positive'
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Excellent Savings Rate',
      description: 'You\'re saving 18% of your income, which is above the recommended 15%. Great job!',
      priority: 'low',
      actionRequired: false,
      impact: 'positive'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Entertainment Spending High',
      description: 'Entertainment spending is 25% above your budget this month. Consider reducing non-essential expenses.',
      priority: 'medium',
      actionRequired: true,
      impact: 'negative'
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Investment Opportunity',
      description: 'With your current savings rate, you could start investing in index funds for long-term wealth building.',
      priority: 'medium',
      actionRequired: false,
      impact: 'positive'
    },
    // New enhanced insights
    {
      id: '5',
      type: 'recommendation',
      title: 'Optimize Weekend Spending',
      description: 'Your weekend spending is 40% higher than weekdays. Consider meal planning and entertainment budgeting.',
      priority: 'medium',
      actionRequired: true,
      impact: 'positive'
    },
    {
      id: '6',
      type: 'achievement',
      title: 'Budget Discipline',
      description: 'You\'ve stayed within budget in 7 out of 8 categories this month. Excellent financial discipline!',
      priority: 'low',
      actionRequired: false,
      impact: 'positive'
    }
  ]);

  // Memoized calculations for better performance
  const memoizedReportsData = useMemo(() => reportsData, [reportsData]);
  const memoizedAiInsights = useMemo(() => aiInsights, [aiInsights]);

  useEffect(() => {
    if (user) {
      fetchReportsData();
    }
  }, [user]);

  const fetchReportsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch transactions within date range
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (transactions) {
        processReportsData(transactions);
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
      setError('Failed to load financial data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load financial data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, startDate, endDate, toast]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReportsData();
    setRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Your financial reports have been updated with the latest data.",
    });
  }, [fetchReportsData, toast]);

  const processReportsData = (transactions: Transaction[]) => {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

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
        category: 'Uncategorized'
      }));

    // Generate spending trends
    const spendingTrends = generateSpendingTrends(transactions);

    // Calculate emergency fund status
    const monthlyExpenses = totalExpenses / 6; // Average monthly expenses
    const emergencyFundMonths = netBalance / monthlyExpenses;
    let emergencyFundStatus: 'excellent' | 'good' | 'fair' | 'poor' = 'fair';
    if (emergencyFundMonths >= 6) emergencyFundStatus = 'excellent';
    else if (emergencyFundMonths >= 3) emergencyFundStatus = 'good';
    else if (emergencyFundMonths >= 1) emergencyFundStatus = 'fair';
    else emergencyFundStatus = 'poor';

    // Calculate budget adherence (placeholder - would need budget data)
    const budgetAdherence = 85; // Placeholder percentage

    // Generate new enhanced data
    const spendingPatterns = generateSpendingPatterns(transactions);
    const budgetComparison = generateBudgetComparison(transactions);
    const financialGoals = generateFinancialGoals(netBalance, totalIncome);
    const cashFlowAnalysis = generateCashFlowAnalysis(transactions);

    setReportsData({
      totalIncome,
      totalExpenses,
      netBalance,
      monthlyData,
      categoryBreakdown,
      topExpenses,
      spendingTrends,
      savingsRate,
      emergencyFundStatus,
      budgetAdherence,
      spendingPatterns,
      budgetComparison,
      financialGoals,
      cashFlowAnalysis
    });
  };

  const generateMonthlyData = (transactions: Transaction[]) => {
    const months = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Generate monthly data points (default)
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    while (current <= end) {
      const monthStart = new Date(current);
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      months.push({
        month: current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income,
        expenses,
        balance: income - expenses,
        date: current
      });
      
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  };

  const generateCategoryBreakdown = (transactions: Transaction[]) => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const category = 'Uncategorized';
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
    return [
      { period: 'This Week', change: 12.5, trend: 'up' as const },
      { period: 'This Month', change: 8.2, trend: 'down' as const },
      { period: 'This Quarter', change: 15.7, trend: 'up' as const }
    ];
  };

  const generateSpendingPatterns = (transactions: Transaction[]) => {
    const dayPatterns = new Map<string, { total: number; count: number }>();
    
    // Initialize all days
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(day => {
      dayPatterns.set(day, { total: 0, count: 0 });
    });

    // Calculate spending by day of week
    transactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const day = new Date(t.transaction_date).toLocaleDateString('en-US', { weekday: 'long' });
        const current = dayPatterns.get(day)!;
        current.total += Math.abs(t.amount);
        current.count += 1;
      });

    return Array.from(dayPatterns.entries()).map(([day, data]) => ({
      dayOfWeek: day,
      averageSpending: data.count > 0 ? data.total / data.count : 0,
      transactionCount: data.count
    }));
  };

  const generateBudgetComparison = (transactions: Transaction[]) => {
    // This would typically come from actual budget data
    // For now, creating sample data based on spending patterns
    const categories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities'];
    const budgetedAmounts = [1200, 400, 300, 200, 150]; // Sample budget amounts
    
    return categories.map((category, index) => {
      const actual = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) / categories.length; // Simplified calculation
      
      const budgeted = budgetedAmounts[index];
      const variance = actual - budgeted;
      let status: 'under' | 'over' | 'on-track' = 'on-track';
      
      if (variance > budgeted * 0.1) status = 'over';
      else if (variance < -budgeted * 0.1) status = 'under';
      
      return { category, budgeted, actual, variance, status };
    });
  };

  const generateFinancialGoals = (netBalance: number, totalIncome: number) => {
  return [
    {
      name: 'Emergency Fund',
      target: totalIncome * 6, // 6 months of income
      current: netBalance,
      progress: Math.min((netBalance / (totalIncome * 6)) * 100, 100),
      deadline: '2024-12-31',
      status: (netBalance >= totalIncome * 6 ? 'ahead' : netBalance >= totalIncome * 3 ? 'on-track' : 'behind') as 'on-track' | 'behind' | 'ahead'
    },
    {
      name: 'Vacation Fund',
      target: 3000,
      current: netBalance * 0.3, // 30% of current balance
      progress: Math.min((netBalance * 0.3 / 3000) * 100, 100),
      deadline: '2024-06-30',
      status: (netBalance * 0.3 >= 3000 ? 'ahead' : netBalance * 0.3 >= 1500 ? 'on-track' : 'behind') as 'on-track' | 'behind' | 'ahead'
    },
    {
      name: 'Investment Portfolio',
      target: totalIncome * 0.2, // 20% of annual income
      current: netBalance * 0.5, // 50% of current balance
      progress: Math.min((netBalance * 0.5 / (totalIncome * 0.2)) * 100, 100),
      deadline: '2024-12-31',
      status: (netBalance * 0.5 >= totalIncome * 0.2 ? 'ahead' : netBalance * 0.5 >= totalIncome * 0.1 ? 'on-track' : 'behind') as 'on-track' | 'behind' | 'ahead'
    }
  ];
};

  const generateCashFlowAnalysis = (transactions: Transaction[]) => {
    // Generate quarterly cash flow analysis
    const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
    
    return quarters.map((quarter, index) => {
      const cashIn = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0) * (0.8 + Math.random() * 0.4); // Simulate quarterly variation
      
      const cashOut = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) * (0.8 + Math.random() * 0.4);
      
      const netCashFlow = cashIn - cashOut;
      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      
      if (netCashFlow > 0) trend = 'improving';
      else if (netCashFlow < 0) trend = 'declining';
      
      return { period: quarter, cashIn, cashOut, netCashFlow, trend };
    });
  };

  const handleExportReport = (type: 'pdf' | 'csv' | 'excel') => {
    toast({
      title: "Export Started",
      description: `Your ${type.toUpperCase()} report is being prepared...`,
    });
    
    // Enhanced export logic with more detailed information
    const exportData = {
      reportType: selectedReportType,
      period: 'monthly',
      dateRange: { start: startDate, end: endDate },
      summary: {
        totalIncome: reportsData.totalIncome,
        totalExpenses: reportsData.totalExpenses,
        netBalance: reportsData.netBalance,
        savingsRate: reportsData.savingsRate,
        emergencyFundStatus: reportsData.emergencyFundStatus,
        budgetAdherence: reportsData.budgetAdherence
      },
      detailedData: {
        monthlyData: reportsData.monthlyData,
        categoryBreakdown: reportsData.categoryBreakdown,
        topExpenses: reportsData.topExpenses,
        spendingPatterns: reportsData.spendingPatterns,
        budgetComparison: reportsData.budgetComparison,
        financialGoals: reportsData.financialGoals,
        cashFlowAnalysis: reportsData.cashFlowAnalysis,
        aiInsights: aiInsights
      }
    };

    // Simulate export processing
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${type.toUpperCase()} report has been generated successfully!`,
      });
      
      // In a real implementation, you would:
      // 1. For PDF: Generate a formatted PDF with charts and tables
      // 2. For CSV: Create a downloadable CSV file with all data
      // 3. For Excel: Generate an Excel file with multiple sheets and charts
      
      console.log('Export data:', exportData);
    }, 2000);
  };

  const getEmergencyFundColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-700 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'fair': return 'text-yellow-700 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getEmergencyFundBadge = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-blue-600" />;
      case 'achievement': return <Award className="w-5 h-5 text-green-600" />;
      case 'opportunity': return <Target className="w-5 h-5 text-purple-600" />;
      default: return <Lightbulb className="w-5 h-5 text-slate-600" />;
    }
  };

  const getInsightPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-green-700 dark:text-green-400';
      case 'on-track': return 'text-blue-600 dark:text-blue-400';
      case 'behind': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getGoalStatusBadge = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'on-track': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'behind': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    }
  };

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case 'under': return 'text-green-700 dark:text-green-400';
      case 'over': return 'text-red-600 dark:text-red-400';
      case 'on-track': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getCashFlowTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <Activity className="w-4 h-4 text-blue-600" />;
      default: return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  // Enhanced chart tooltip state
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{
    x: number;
    y: number;
    data: any;
    chartType: 'balance' | 'expense';
  } | null>(null);

  // Keyboard navigation support
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'r' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleRefresh();
    }
  }, [handleRefresh]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Performance optimization: memoize expensive calculations
  const chartData = useMemo(() => {
    if (reportsData.monthlyData.length === 0) return null;
    
    const maxBalance = Math.max(...reportsData.monthlyData.map(m => Math.abs(m.balance)));
    const minBalance = Math.min(...reportsData.monthlyData.map(m => m.balance));
    const maxExpense = Math.max(...reportsData.monthlyData.map(m => m.expenses));
    const minExpense = Math.min(...reportsData.monthlyData.map(m => m.expenses));
    
    return {
      balance: { max: maxBalance, min: minBalance, range: maxBalance - minBalance },
      expense: { max: maxExpense, min: minExpense, range: maxExpense - minExpense }
    };
  }, [reportsData.monthlyData]);

  // Empty state component
  const EmptyState = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced loading skeleton */}
            <div className="animate-pulse space-y-8">
              {/* Header skeleton */}
              <div className="space-y-4">
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3"></div>
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              </div>
              
              {/* Filters skeleton */}
              <div className="flex justify-center">
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-full w-96"></div>
              </div>
              
              {/* Metrics cards skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                ))}
              </div>
              
              {/* Charts skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                ))}
              </div>
              
              {/* Content sections skeleton */}
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Check if we have data to display
  const hasData = reportsData.monthlyData.length > 0 && reportsData.totalIncome + reportsData.totalExpenses > 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg mb-4">
                <BarChart3 className="w-4 h-4" />
                Financial Reports
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-3">
                Comprehensive Financial Reports
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">AI-powered insights, detailed analytics, and exportable reports for better financial decision making</p>
              {!hasData && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                  💡 No financial data found for the selected period. Try adjusting the date range or add some transactions.
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                onClick={() => navigate('/dashboard')}
                aria-label="Navigate to Dashboard"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                aria-label="Refresh financial data"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button 
                onClick={() => setShowExportOptions(true)}
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                aria-label="Export financial reports"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Reports
              </Button>
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              💡 Keyboard shortcut: <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">Ctrl/Cmd + R</kbd> to refresh data
            </p>
          </div>

          {/* Period, Report Type, and Date Filters */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-2 border border-white/20 dark:border-slate-700/30 shadow-lg">
                <Select value={selectedReportType} onValueChange={(value: 'overview' | 'detailed' | 'custom') => setSelectedReportType(value)}>
                  <SelectTrigger className="w-40 border-0 bg-transparent" aria-label="Select report type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview Report</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Date Range Filters */}
            <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-2 border border-white/20 dark:border-slate-700/30 shadow-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <Label className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">From:</Label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-0 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-0"
                  aria-label="Start date for report period"
                />
              </div>
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">To:</Label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-0 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-0"
                  aria-label="End date for report period"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={fetchReportsData}
                className="ml-2 h-8 px-3 text-xs rounded-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                aria-label="Apply date range filter"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Apply
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="region" aria-label="Financial summary metrics">
            {/* Total Income */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Income</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(reportsData.totalIncome)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Monthly income
                </p>
              </CardContent>
            </Card>

            {/* Total Expenses */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Expenses</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(reportsData.totalExpenses)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Monthly expenses
                </p>
              </CardContent>
            </Card>

            {/* Savings Rate */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Savings Rate</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <PiggyBank className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {reportsData.savingsRate.toFixed(1)}%
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  of income saved
                </p>
              </CardContent>
            </Card>

            {/* Emergency Fund Status */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Emergency Fund</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {reportsData.emergencyFundStatus.charAt(0).toUpperCase() + reportsData.emergencyFundStatus.slice(1)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Fund status
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Show empty state if no data */}
          {!hasData ? (
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
              <CardContent className="pt-6">
                <EmptyState 
                  title="No Financial Data Available"
                  description="Start by adding some transactions or adjust your date range to see your financial reports."
                  icon={BarChart3}
                />
                <div className="text-center">
                  <Button 
                    onClick={() => navigate('/transactions')}
                    className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-700"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Quick Insights Summary */}
              <Card className="rounded-xl border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                        Quick Insights Summary
                      </CardTitle>
                      <p className="text-slate-600 dark:text-slate-400">
                        Key takeaways from your financial data analysis
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Financial Health</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {reportsData.savingsRate >= 20 ? 'Excellent' : reportsData.savingsRate >= 15 ? 'Good' : reportsData.savingsRate >= 10 ? 'Fair' : 'Needs Improvement'} 
                        savings rate with {reportsData.emergencyFundStatus} emergency fund status
                      </p>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Spending Patterns</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {reportsData.spendingPatterns.length > 0 ? 
                          `Highest spending on ${reportsData.spendingPatterns.reduce((max, p) => p.averageSpending > max.averageSpending ? p : max).dayOfWeek}s` : 
                          'Analyzing spending patterns...'
                        }
                      </p>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Goals Progress</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {reportsData.financialGoals.filter(g => g.status === 'ahead').length} goals ahead, 
                        {reportsData.financialGoals.filter(g => g.status === 'on-track').length} on track
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Net Balance Chart */}
                <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          Net Balance Trend
                        </CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Net balance over time
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {chartData ? (
                      <div className="h-64 relative">
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400 w-16">
                          {Array.from({ length: 6 }, (_, i) => {
                            const value = chartData.balance.min + (chartData.balance.range * i) / 5;
                            return (
                              <div key={i} className="text-right pr-2">
                                {formatCurrency(value)}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Chart area */}
                        <div className="ml-16 h-full relative">
                          {/* Grid lines */}
                          <div className="absolute inset-0 flex flex-col justify-between">
                            {Array.from({ length: 6 }, (_, i) => (
                              <div key={i} className="border-t border-slate-200 dark:border-slate-700 w-full" />
                            ))}
                          </div>
                          
                          {/* Line chart */}
                          <svg className="w-full h-full absolute inset-0">
                            <defs>
                              <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                              </linearGradient>
                            </defs>
                            
                            {/* Area fill */}
                            <path
                              d={(() => {
                                const points = reportsData.monthlyData.map((month, index) => {
                                  const x = (index / (reportsData.monthlyData.length - 1)) * 100;
                                  const normalizedBalance = chartData.balance.range > 0 ? (month.balance - chartData.balance.min) / chartData.balance.range : 0.5;
                                  const y = 100 - (normalizedBalance * 100);
                                  return `${x},${y}`;
                                });
                                
                                return `M ${points.join(' L ')} L 100,100 L 0,100 Z`;
                              })()}
                              fill="url(#balanceGradient)"
                              opacity="0.3"
                            />
                            
                            {/* Line */}
                            <path
                              d={(() => {
                                const points = reportsData.monthlyData.map((month, index) => {
                                  const x = (index / (reportsData.monthlyData.length - 1)) * 100;
                                  const normalizedBalance = chartData.balance.range > 0 ? (month.balance - chartData.balance.min) / chartData.balance.range : 0.5;
                                  const y = 100 - (normalizedBalance * 100);
                                  return `${x},${y}`;
                                });
                                
                                return `M ${points.join(' L ')}`;
                              })()}
                              stroke="#3B82F6"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            
                            {/* Data points with enhanced interactivity */}
                            {reportsData.monthlyData.map((month, index) => {
                              const x = (index / (reportsData.monthlyData.length - 1)) * 100;
                              const normalizedBalance = chartData.balance.range > 0 ? (month.balance - chartData.balance.min) / chartData.balance.range : 0.5;
                              const y = 100 - (normalizedBalance * 100);
                              
                              return (
                                <g key={index}>
                                  <title>{`${month.month}: ${formatCurrency(month.balance)}`}</title>
                                  <circle
                                    cx={`${x}%`}
                                    cy={`${y}%`}
                                    r="4"
                                    fill="#3B82F6"
                                    className="hover:r-6 transition-all duration-200 cursor-pointer"
                                    onMouseEnter={() => setHoveredChartPoint({
                                      x: x,
                                      y: y,
                                      data: month,
                                      chartType: 'balance'
                                    })}
                                    onMouseLeave={() => setHoveredChartPoint(null)}
                                  />
                                </g>
                              );
                            })}
                          </svg>
                          
                          {/* Enhanced tooltip */}
                          {hoveredChartPoint && hoveredChartPoint.chartType === 'balance' && (
                            <div 
                              className="absolute bg-slate-900 text-white text-xs rounded-lg px-2 py-1 pointer-events-none z-10"
                              style={{
                                left: `${hoveredChartPoint.x}%`,
                                top: `${hoveredChartPoint.y}%`,
                                transform: 'translate(-50%, -100%)',
                                marginTop: '-8px'
                              }}
                            >
                              <div className="font-medium">{hoveredChartPoint.data.month}</div>
                              <div className="text-blue-300">
                                {formatCurrency(hoveredChartPoint.data.balance)}
                              </div>
                            </div>
                          )}
                          
                          {/* X-axis labels */}
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                            {reportsData.monthlyData.map((month, index) => (
                              <div key={index} className="text-center">
                                {month.month}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <EmptyState 
                        title="No Chart Data"
                        description="Select a different time period or add more transactions to see chart data."
                        icon={BarChart3}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Expense Trend Chart */}
                <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <TrendingDown className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          Expense Trend
                        </CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Expenses over time
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 relative">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400 w-16">
                        {(() => {
                          const maxExpense = Math.max(...reportsData.monthlyData.map(m => m.expenses));
                          const minExpense = Math.min(...reportsData.monthlyData.map(m => m.expenses));
                          const range = maxExpense - minExpense;
                          const steps = 5;
                          return Array.from({ length: steps + 1 }, (_, i) => {
                            const value = minExpense + (range * i) / steps;
                            return (
                              <div key={i} className="text-right pr-2">
                                {formatCurrency(value)}
                              </div>
                            );
                          });
                        })()}
                      </div>
                      
                      {/* Chart area */}
                      <div className="ml-16 h-full relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                          {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="border-t border-slate-200 dark:border-slate-700 w-full" />
                          ))}
                        </div>
                        
                        {/* Line chart */}
                        <svg className="w-full h-full absolute inset-0">
                          <defs>
                            <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
                            </linearGradient>
                          </defs>
                          
                          {/* Area fill */}
                          <path
                            d={(() => {
                              if (reportsData.monthlyData.length === 0) return '';
                              const maxExpense = Math.max(...reportsData.monthlyData.map(m => m.expenses));
                              const minExpense = Math.min(...reportsData.monthlyData.map(m => m.expenses));
                              const range = maxExpense - minExpense;
                              
                              const points = reportsData.monthlyData.map((month, index) => {
                                const x = (index / (reportsData.monthlyData.length - 1)) * 100;
                                const normalizedExpense = range > 0 ? (month.expenses - minExpense) / range : 0.5;
                                const y = 100 - (normalizedExpense * 100);
                                return `${x},${y}`;
                              });
                              
                              return `M ${points.join(' L ')} L 100,100 L 0,100 Z`;
                            })()}
                            fill="url(#expenseGradient)"
                            opacity="0.3"
                          />
                          
                          {/* Line */}
                          <path
                            d={(() => {
                              if (reportsData.monthlyData.length === 0) return '';
                              const maxExpense = Math.max(...reportsData.monthlyData.map(m => m.expenses));
                              const minExpense = Math.min(...reportsData.monthlyData.map(m => m.expenses));
                              const range = maxExpense - minExpense;
                              
                              const points = reportsData.monthlyData.map((month, index) => {
                                const x = (index / (reportsData.monthlyData.length - 1)) * 100;
                                const normalizedExpense = range > 0 ? (month.expenses - minExpense) / range : 0.5;
                                const y = 100 - (normalizedExpense * 100);
                                return `${x},${y}`;
                              });
                              
                              return `M ${points.join(' L ')}`;
                            })()}
                            stroke="#EF4444"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Data points with enhanced interactivity */}
                          {reportsData.monthlyData.map((month, index) => {
                            const maxExpense = Math.max(...reportsData.monthlyData.map(m => m.expenses));
                            const minExpense = Math.min(...reportsData.monthlyData.map(m => m.expenses));
                            const range = maxExpense - minExpense;
                            const x = (index / (reportsData.monthlyData.length - 1)) * 100;
                            const normalizedExpense = range > 0 ? (month.expenses - minExpense) / range : 0.5;
                            const y = 100 - (normalizedExpense * 100);
                            
                            return (
                              <g key={index}>
                                <title>{`${month.month}: ${formatCurrency(month.expenses)}`}</title>
                                <circle
                                  cx={`${x}%`}
                                  cy={`${y}%`}
                                  r="4"
                                  fill="#EF4444"
                                  className="hover:r-6 transition-all duration-200 cursor-pointer"
                                  onMouseEnter={() => setHoveredChartPoint({
                                    x: x,
                                    y: y,
                                    data: month,
                                    chartType: 'expense'
                                  })}
                                  onMouseLeave={() => setHoveredChartPoint(null)}
                                />
                              </g>
                            );
                          })}
                        </svg>
                        
                        {/* Enhanced tooltip */}
                        {hoveredChartPoint && hoveredChartPoint.chartType === 'expense' && (
                          <div 
                            className="absolute bg-slate-900 text-white text-xs rounded-lg px-2 py-1 pointer-events-none z-10"
                            style={{
                              left: `${hoveredChartPoint.x}%`,
                              top: `${hoveredChartPoint.y}%`,
                              transform: 'translate(-50%, -100%)',
                              marginTop: '-8px'
                            }}
                          >
                            <div className="font-medium">{hoveredChartPoint.data.month}</div>
                            <div className="text-red-300">
                              {formatCurrency(hoveredChartPoint.data.expenses)}
                            </div>
                          </div>
                        )}
                        
                        {/* X-axis labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                          {reportsData.monthlyData.map((month, index) => (
                            <div key={index} className="text-center">
                              {month.month}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Error State */}
              {error && (
                <Card className="rounded-xl border-0 bg-red-50 dark:bg-red-950/20 backdrop-blur-sm shadow-lg border border-red-200 dark:border-red-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      <div>
                        <h3 className="font-medium text-red-800 dark:text-red-200">Unable to Load Data</h3>
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                      <Button 
                        onClick={handleRefresh} 
                        variant="outline" 
                        size="sm"
                        className="ml-auto border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Insights Section */}
              <Card className="rounded-xl border-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                        AI Financial Insights
                      </CardTitle>
                      <p className="text-slate-600 dark:text-slate-400">
                        Personalized recommendations and analysis based on your financial data
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {aiInsights.map((insight) => (
                      <div key={insight.id} className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-slate-700 dark:text-slate-300">
                                {insight.title}
                              </h4>
                              <Badge className={`text-xs ${getInsightPriorityColor(insight.priority)}`}>
                                {insight.priority}
                              </Badge>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
                              {insight.description}
                            </p>
                            {insight.actionRequired && (
                              <Button size="sm" variant="outline" className="text-xs">
                                Take Action
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Spending Patterns Analysis */}
              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Spending Patterns by Day
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Analyze when you spend the most during the week
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportsData.spendingPatterns.map((pattern, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                              {pattern.dayOfWeek.slice(0, 3)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">{pattern.dayOfWeek}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{pattern.transactionCount} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            {formatCurrency(pattern.averageSpending)}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            Average per transaction
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Budget vs Actual Comparison */}
              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Budget vs Actual
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Compare your spending against budgeted amounts
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportsData.budgetComparison.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {formatCurrency(item.actual)} / {formatCurrency(item.budgeted)}
                            </span>
                            <Badge className={`text-xs ${getBudgetStatusColor(item.status)}`}>
                              {item.status === 'under' ? 'Under' : item.status === 'over' ? 'Over' : 'On Track'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={Math.min((item.actual / item.budgeted) * 100, 100)} 
                            className="flex-1 h-2"
                            style={{ 
                              backgroundColor: item.status === 'over' ? '#FEE2E2' : item.status === 'under' ? '#DCFCE7' : '#DBEAFE'
                            }}
                          >
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                item.status === 'over' ? 'bg-red-500' : item.status === 'under' ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min((item.actual / item.budgeted) * 100, 100)}%` }}
                            />
                          </Progress>
                          <span className={`text-xs font-medium ${getBudgetStatusColor(item.status)}`}>
                            {item.variance > 0 ? '+' : ''}{formatCurrency(item.variance)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Financial Goals Tracking */}
              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Financial Goals Progress
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Track your progress towards financial milestones
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportsData.financialGoals.map((goal, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-slate-700 dark:text-slate-300">{goal.name}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Due: {new Date(goal.deadline).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`text-xs ${getGoalStatusBadge(goal.status)}`}>
                            {goal.status === 'ahead' ? 'Ahead' : goal.status === 'on-track' ? 'On Track' : 'Behind'}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                              {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                            </span>
                            <span className={`font-medium ${getGoalStatusColor(goal.status)}`}>
                              {goal.progress.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={goal.progress} className="h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cash Flow Analysis */}
              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <TrendingUpIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Cash Flow Analysis
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Quarterly cash flow trends and analysis
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportsData.cashFlowAnalysis.map((quarter, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50">
                        <div className="flex items-center gap-3">
                          {getCashFlowTrendIcon(quarter.trend)}
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">{quarter.period}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {quarter.trend === 'improving' ? 'Improving' : quarter.trend === 'declining' ? 'Declining' : 'Stable'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            quarter.netCashFlow > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {quarter.netCashFlow > 0 ? '+' : ''}{formatCurrency(quarter.netCashFlow)}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            Net cash flow
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Transaction Analysis */}
              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          Detailed Transaction Analysis
                        </CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Comprehensive breakdown of your financial transactions
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportReport('csv')}
                      className="rounded-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">Category</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">Amount</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {reportsData.monthlyData.slice(0, 10).map((month, index) => (
                          <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                              {month.date.toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">
                              {month.balance > 0 ? 'Net Income' : 'Net Expenses'}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                              {month.balance > 0 ? 'Income' : 'Expenses'}
                            </td>
                            <td className={`py-3 px-4 text-sm font-medium text-right ${
                              month.balance > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {month.balance > 0 ? '+' : ''}{formatCurrency(month.balance)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className={`text-xs ${
                                month.balance > 0 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {month.balance > 0 ? 'Income' : 'Expense'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Showing summary data. Use the export function for complete transaction details.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <PieChart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Spending by Category
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Breakdown of your expenses by category
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportsData.categoryBreakdown.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {category.category}
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {formatCurrency(category.amount)} ({category.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={category.percentage} className="h-2" style={{ backgroundColor: category.color + '20' }}>
                          <div 
                            className="h-full rounded-full transition-all duration-300" 
                            style={{ 
                              backgroundColor: category.color, 
                              width: `${category.percentage}%` 
                            }} 
                          />
                        </Progress>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Expenses */}
              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Top Expenses
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Your highest spending transactions
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportsData.topExpenses.map((expense, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">{expense.description}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{expense.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600 dark:text-red-400">
                            {formatCurrency(expense.amount)}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {expense.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Export Options Dialog */}
      <Dialog open={showExportOptions} onOpenChange={setShowExportOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Financial Reports</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={() => handleExportReport('pdf')}
                className="w-full justify-start"
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF Report (Comprehensive)
              </Button>
              <Button 
                onClick={() => handleExportReport('csv')}
                className="w-full justify-start"
                variant="outline"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                CSV Export (Data Analysis)
              </Button>
              <Button 
                onClick={() => handleExportReport('excel')}
                className="w-full justify-start"
                variant="outline"
              >
                <ChartBar className="w-4 h-4 mr-2" />
                Excel Report (Charts & Graphs)
              </Button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 text-center">
              Reports include data for the selected period: monthly
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Reports;
