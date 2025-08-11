import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3,
  Plus,
  Target,
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Lightbulb,
  Zap
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
                Financial Dashboard
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">Track your financial health at a glance</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button 
                onClick={() => navigate('/categories-budget')}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
              >
                <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Categories & Budget
              </Button>
              <Button 
                onClick={() => navigate('/transactions')}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Add Transaction
              </Button>
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
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  $0.00
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-green-600 dark:text-green-400">
                    <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" />
                    $0.00 this month
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
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 dark:text-green-400">
                  $0.00
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
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400">
                  $0.00
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Lifetime spending
                </p>
              </CardContent>
            </Card>

            {/* Budget Summary */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Budget</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  $0.00 / $0.00
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: '0%' }}
                    />
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    No budgets set
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Welcome Message */}
          <Card className="rounded-xl border-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Welcome to Your Dashboard
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Start by adding your first transaction or setting up budgets
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
                      Getting Started
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Your dashboard is ready! Add transactions, set up budgets, and start tracking your finances. 
                      The sidebar navigation will help you move between different sections.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/transactions')}
                        className="rounded-full border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/50"
                      >
                        Add Transaction
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/categories-budget')}
                        className="rounded-full border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/50"
                      >
                        Set Up Budgets
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
