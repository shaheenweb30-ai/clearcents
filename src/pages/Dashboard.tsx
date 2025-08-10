import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  PiggyBank, 
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Eye,
  Lightbulb,
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  Wallet,
  Activity,
  RefreshCw,
  Target,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";
import { useBudgets } from "@/hooks/useBudgets";
import { useResponsive } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { user } = useAuth();
  const { formatCurrency, preferences } = useSettings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isMobile, isSmallMobile } = useResponsive();
  
  // Date filter state
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  
  // Use monthly as default period for budget calculations
  const selectedPeriod: 'weekly' | 'monthly' | 'yearly' = 'monthly';
  
  // Use the real-time dashboard hook with date filters
  const { dashboardData, loading, refetch } = useRealtimeDashboard(startDate, endDate);
  
  // Use the budgets hook for conversion logic
  const { getConvertedBudgets, getTotalConvertedBudgetAmount } = useBudgets(user?.id);

  // Safely access dashboard data with fallbacks
  const safeData = {
    totalBalance: dashboardData?.totalBalance || 0,
    monthlyNetChange: dashboardData?.monthlyNetChange || 0,
    totalIncome: dashboardData?.totalIncome || 0,
    totalExpenses: dashboardData?.totalExpenses || 0,
    monthlyBudgetSpent: dashboardData?.monthlyBudgetSpent || 0,
    monthlyBudgetTotal: dashboardData?.monthlyBudgetTotal || 0,
    fixedCostsTotal: dashboardData?.fixedCostsTotal || 0,
    totalTransactions: dashboardData?.totalTransactions || 0,
    periodTransactions: dashboardData?.periodTransactions || 0,
    periodIncome: dashboardData?.periodIncome || 0,
    periodExpenses: dashboardData?.periodExpenses || 0,
    averageTransactionAmount: dashboardData?.averageTransactionAmount || 0,
    transactionFrequency: dashboardData?.transactionFrequency || 'monthly',
    aiInsightCount: dashboardData?.aiInsightCount || 0,
    categoryBudgets: dashboardData?.categoryBudgets || [],
    subscriptions: dashboardData?.subscriptions || [],
    recentTransactions: dashboardData?.recentTransactions || []
  };

  const getBalanceColor = (balance: number) => {
    return balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';
  };

  const getBudgetStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-red-600 dark:text-red-400', icon: AlertCircle };
    if (percentage >= 75) return { color: 'text-yellow-600 dark:text-yellow-400', icon: Clock };
    return { color: 'text-green-600 dark:text-green-400', icon: CheckCircle };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-3 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4 sm:space-y-6">
              <div className="h-6 sm:h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 sm:w-1/4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 sm:h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-48 sm:h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'}`}>
            <div className={`${isMobile ? 'text-center' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                Dashboard
              </div>
              <h1 className={`${isMobile ? 'text-2xl sm:text-3xl' : 'text-4xl md:text-5xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3`}>
                Financial Dashboard
              </h1>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} text-slate-600 dark:text-slate-400`}>Track your financial health at a glance</p>
            </div>
            <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center gap-3'}`}>
              <Button 
                onClick={refetch} 
                variant="outline" 
                size={isMobile ? "sm" : "sm"}
                className={`${isMobile ? 'w-full' : ''} rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300`}
                disabled={loading}
              >
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={() => navigate('/categories-budget')}
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                className={`${isMobile ? 'w-full' : ''} rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300`}
              >
                <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Categories & Budget
              </Button>
              <Button 
                onClick={() => navigate('/transactions')}
                className={`${isMobile ? 'w-full' : ''} rounded-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Date Filter */}
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className={`${isMobile ? 'w-full' : ''} bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-2 sm:p-3 border border-white/20 dark:border-slate-700/30 shadow-lg`}>
              <div className={`${isMobile ? 'flex flex-col space-y-3' : 'flex items-center gap-4'}`}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">From:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-transparent border-0 text-xs sm:text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-0"
                  />
                </div>
                {!isMobile && <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>}
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">To:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-transparent border-0 text-xs sm:text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-0"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refetch}
                  className={`${isMobile ? 'w-full' : 'ml-2'} h-7 sm:h-8 px-2 sm:px-3 text-xs rounded-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700`}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Top Hero Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Total Balance */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Balance</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${isMobile ? 'text-xl sm:text-2xl' : 'text-3xl'} font-bold ${getBalanceColor(safeData.totalBalance)}`}>
                  {formatCurrency(safeData.totalBalance)}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 text-xs sm:text-sm ${safeData.monthlyNetChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {safeData.monthlyNetChange >= 0 ? (
                      <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" />
                    ) : (
                      <TrendingDown className="w-2 h-2 sm:w-3 sm:h-3" />
                    )}
                    {formatCurrency(Math.abs(safeData.monthlyNetChange))} this month
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Total Income */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Income</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${isMobile ? 'text-xl sm:text-2xl' : 'text-3xl'} font-bold text-green-600 dark:text-green-400`}>
                  {formatCurrency(safeData.totalIncome)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Lifetime earnings
                </p>
              </CardContent>
            </Card>

            {/* Total Expenses */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Expenses</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${isMobile ? 'text-xl sm:text-2xl' : 'text-3xl'} font-bold text-red-600 dark:text-red-400`}>
                  {formatCurrency(safeData.totalExpenses)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Lifetime spending
                </p>
              </CardContent>
            </Card>

            {/* Budget Summary */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Budget</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${isMobile ? 'text-lg sm:text-xl' : 'text-2xl'} font-bold text-slate-900 dark:text-slate-100`}>
                  {formatCurrency(safeData.monthlyBudgetSpent)} / {formatCurrency(getTotalConvertedBudgetAmount(selectedPeriod))}
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${getTotalConvertedBudgetAmount(selectedPeriod) ? Math.min((safeData.monthlyBudgetSpent / getTotalConvertedBudgetAmount(selectedPeriod)) * 100, 100) : 0}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {getTotalConvertedBudgetAmount(selectedPeriod) ? `${Math.min((safeData.monthlyBudgetSpent / getTotalConvertedBudgetAmount(selectedPeriod)) * 100, 100).toFixed(0)}% used` : 'No budgets set'}
                  </div>
                  {preferences.fixedCosts && preferences.fixedCosts.length > 0 && (
                    <div className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Fixed costs: <strong>{formatCurrency(safeData.fixedCostsTotal)}</strong>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {/* Total Transactions */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Transactions</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Receipt className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${isMobile ? 'text-xl sm:text-2xl' : 'text-3xl'} font-bold text-indigo-600 dark:text-indigo-400`}>
                  {safeData.totalTransactions}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {safeData.periodTransactions} this {selectedPeriod}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Lifetime transactions
                </p>
              </CardContent>
            </Card>

            {/* Period Summary */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Summary</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Income:</span>
                    <span className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-green-600 dark:text-green-400`}>
                      {formatCurrency(safeData.periodIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Expenses:</span>
                    <span className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-red-600 dark:text-red-400`}>
                      {formatCurrency(safeData.periodExpenses)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Net:</span>
                      <span className={`${isMobile ? 'text-base' : 'text-lg'} font-bold ${safeData.periodIncome - safeData.periodExpenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(safeData.periodIncome - safeData.periodExpenses)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Analytics */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Transaction Analytics</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Avg. Amount:</span>
                    <span className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-900 dark:text-slate-100`}>
                      {formatCurrency(Math.abs(safeData.averageTransactionAmount))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Frequency:</span>
                    <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                      {safeData.transactionFrequency}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Period:</span>
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {selectedPeriod}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Card */}
          <Card className="rounded-xl border-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-800 dark:text-slate-200`}>
                    AI Insights
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {safeData.aiInsightCount} new insights today
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-purple-200/50 dark:border-purple-700/50">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium mb-2">
                      Smart Spending Tip
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Cut food delivery by 12% by batching orders, or set a soft cap on your highest category. 
                      Consider meal prepping to reduce impulse spending.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/reports-insights')}
                      className="mt-3 rounded-full border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/50"
                    >
                      View All Insights
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Utilization and Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Budget Utilization */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <PiggyBank className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 dark:text-slate-200`}>
                      Budget Utilization
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Track your spending against budgets
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {safeData.categoryBudgets.length > 0 ? (
                  safeData.categoryBudgets.map((item) => {
                    const convertedBudget = getConvertedBudgets(selectedPeriod).find(b => b.id === item.budget.id);
                    const convertedAmount = convertedBudget?.convertedAmount || item.budget.amount;
                    const convertedPercentage = convertedAmount && convertedAmount > 0 
                      ? Math.min((item.spent / convertedAmount) * 100, 100) 
                      : 0;
                    const status = getBudgetStatus(convertedPercentage);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div key={item.category.id} className="space-y-3 p-3 sm:p-4 rounded-lg bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50">
                        <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex items-center justify-between'}`}>
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-sm" 
                              style={{ backgroundColor: '#6b7280' }}
                            />
                            <span className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">{item.category.name}</span>
                            <StatusIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${status.color}`} />
                          </div>
                          <div className={`${isMobile ? 'text-center' : 'text-right'} text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300`}>
                            {formatCurrency(item.spent)} / {formatCurrency(getConvertedBudgets(selectedPeriod).find(b => b.id === item.budget.id)?.convertedAmount || item.budget.amount)}
                            {item.budget.period !== selectedPeriod && (
                              <div className="text-xs text-slate-500 dark:text-slate-500">
                                ({item.budget.period} → {selectedPeriod})
                              </div>
                            )}
                          </div>
                        </div>
                        <Progress value={convertedPercentage} className="h-2 bg-slate-200 dark:bg-slate-700" />
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span>{convertedPercentage.toFixed(1)}% used</span>
                          <span>{formatCurrency(Math.max(0, (getConvertedBudgets(selectedPeriod).find(b => b.id === item.budget.id)?.convertedAmount || item.budget.amount) - item.spent))} remaining</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <PiggyBank className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-700 dark:text-slate-300 mb-2`}>No Budgets Set Up Yet</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Start budgeting to track your spending and stay on top of your finances
                    </p>
                    <Button 
                      variant="outline" 
                      className="rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                      onClick={() => navigate('/settings')}
                    >
                      Set Up Budgets
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Receipt className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-800 dark:text-slate-200`}>
                      Recent Transactions
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Your latest financial activity • {safeData.totalTransactions} total
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Subscriptions block (if detected) */}
                {safeData.subscriptions.length > 0 && (
                  <div className="space-y-3 mb-4 sm:mb-6">
                    <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Active Subscriptions</div>
                    {safeData.subscriptions.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-700/50 dark:to-blue-900/20 border border-slate-200/50 dark:border-slate-600/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${sub.color}20` }}>
                            <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: sub.color }} />
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">{sub.name}</p>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{formatCurrency(sub.amount)}/month</p>
                          </div>
                        </div>
                        <span className="px-2 sm:px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700">
                          {sub.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {safeData.recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Recent Activity</div>
                    {safeData.recentTransactions.map((transaction) => {
                      const isIncome = transaction.amount > 0;
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors duration-200">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full shadow-sm ${
                              isIncome ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">{transaction.description}</p>
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                Uncategorized
                              </p>
                            </div>
                          </div>
                          <div className={`${isMobile ? 'text-center' : 'text-right'}`}>
                            <p className={`font-bold ${isMobile ? 'text-base' : 'text-lg'} ${
                              isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {new Date(transaction.transaction_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-700 dark:text-slate-300 mb-2`}>No Transactions Yet</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Start tracking your finances by adding your first transaction
                    </p>
                    <Button 
                      variant="outline" 
                      className="rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                      onClick={() => navigate('/transactions')}
                    >
                      Add Your First Transaction
                    </Button>
                  </div>
                )}

                {/* Transaction Summary Footer */}
                {safeData.totalTransactions > 0 && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                      <div>
                        <div className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-900 dark:text-slate-100`}>
                          {safeData.periodTransactions}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          This {selectedPeriod}
                        </div>
                      </div>
                      <div>
                        <div className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-green-600 dark:text-green-400`}>
                          {formatCurrency(safeData.periodIncome)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Period Income
                        </div>
                      </div>
                      <div>
                        <div className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-red-600 dark:text-red-400`}>
                          {formatCurrency(safeData.periodExpenses)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Period Expenses
                        </div>
                      </div>
                      <div>
                        <div className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-900 dark:text-slate-100`}>
                          {safeData.transactionFrequency}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Frequency
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
