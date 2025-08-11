import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Target, 
  PiggyBank, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  DollarSign,
  Calendar,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  Sparkles,
  Zap
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/contexts/TransactionContext";

const CategoriesBudget = () => {
  const navigate = useNavigate();
  const { categories, setBudget } = useTransactions();
  
  // State for categories and budgets
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newBudget, setNewBudget] = useState({ categoryId: '', amount: '', period: 'monthly' as 'weekly' | 'monthly' | 'yearly' });

  const getBudgetStatus = (spent: number, budget: number) => {
    if (budget === 0) return { color: 'text-slate-600 dark:text-slate-400', icon: Eye, status: 'No Budget Set' };
    
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return { color: 'text-red-600 dark:text-red-400', icon: AlertCircle, status: 'Over Budget' };
    if (percentage >= 75) return { color: 'text-yellow-600 dark:text-yellow-400', icon: Clock, status: 'Warning' };
    return { color: 'text-green-700 dark:text-green-400', icon: CheckCircle, status: 'On Track' };
  };

  const handleAddBudget = () => {
    if (!newBudget.categoryId || !newBudget.amount) return;
    
    setBudget(newBudget.categoryId, parseFloat(newBudget.amount));
    
    setNewBudget({ categoryId: '', amount: '', period: 'monthly' });
    setShowAddBudget(false);
    setEditingCategory(null);
  };

  const handleUpdateBudget = () => {
    if (!editingCategory || !editingCategory.budget) return;
    
    setBudget(editingCategory.id, editingCategory.budget);
    
    setEditingCategory(null);
  };

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const customCategoriesCount = categories.filter(cat => cat.isCustom).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                Categories & Budget
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
                Manage Your Budgets
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                Organize spending by categories and set budget limits
                {customCategoriesCount > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <Zap className="w-4 h-4" />
                    {customCategoriesCount} custom categories
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
              >
                ← Back to Dashboard
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

          {/* Period Selector */}
          <div className="flex items-center justify-center">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-2 border border-white/20 dark:border-slate-700/30 shadow-lg">
              <Select value={selectedPeriod} onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setSelectedPeriod(value)}>
                <SelectTrigger className="w-32 border-0 bg-transparent focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Categories</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {categories.length}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {customCategoriesCount > 0 ? `${customCategoriesCount} custom` : 'All predefined'}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Budget</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <PiggyBank className="h-3 w-3 sm:h-4 sm:h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  ${totalBudget.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} budget
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Spent</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400">
                  ${totalSpent.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} spending
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Remaining</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${totalRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ${totalRemaining.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Available to spend
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((category) => {
              const percentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
              const status = getBudgetStatus(category.spent, category.budget);
              const StatusIcon = status.icon;
              
              return (
                <Card key={category.id} className={`rounded-xl border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${
                  category.isCustom 
                    ? 'bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-700/50' 
                    : 'bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/30'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                              {category.name}
                            </CardTitle>
                            {category.isCustom && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                Custom
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${status.color}`} />
                            <Badge variant="secondary" className="text-xs">
                              {status.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                          ${category.spent.toLocaleString()} / ${category.budget.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.budget > 0 ? (
                      <>
                        <Progress value={percentage} className="h-2 bg-slate-200 dark:bg-slate-700" />
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span>${category.spent.toLocaleString()} spent</span>
                          <span>${(category.budget - category.spent).toLocaleString()} remaining</span>
                        </div>
                        <div className="flex justify-center pt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setEditingCategory({ id: category.id, budget: category.budget });
                              setNewBudget({ categoryId: category.id, amount: category.budget.toString(), period: selectedPeriod });
                              setShowAddBudget(true);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit Budget
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setNewBudget({ categoryId: category.id, amount: '', period: selectedPeriod });
                            setShowAddBudget(true);
                          }}
                          className="w-full text-xs border-dashed"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Set Budget
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add Budget Dialog */}
          <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Budget for Category' : 'Set Budget for Category'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget-amount">Budget Amount</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="budget-period">Period</Label>
                  <Select value={newBudget.period} onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setNewBudget({...newBudget, period: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setShowAddBudget(false);
                    setEditingCategory(null);
                    setNewBudget({ categoryId: '', amount: '', period: 'monthly' });
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={editingCategory ? handleUpdateBudget : handleAddBudget}>
                    {editingCategory ? 'Update Budget' : 'Set Budget'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Welcome Message */}
          <Card className="rounded-xl border-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200/50 dark:border-green-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Categories & Budgets Working!
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Now automatically includes custom categories from transactions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-green-200/50 dark:border-green-700/50">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-3">
                  The Categories & Budget page now automatically syncs with your transactions! When you add a transaction with a custom category, it appears here as a budget card.
                </p>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                  <li>• Custom categories automatically appear with unique icons and colors</li>
                  <li>• Set budgets for any category (predefined or custom)</li>
                  <li>• Track spending against budgets in real-time</li>
                  <li>• Visual indicators show budget status (On Track, Warning, Over Budget)</li>
                  <li>• Seamless integration between Transactions and Categories pages</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/transactions')}
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                  >
                    Add Transaction
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CategoriesBudget;
