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
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { useCategories } from "@/hooks/useCategories";
import { useBudgets } from "@/hooks/useBudgets";
import { useNavigate } from "react-router-dom";

const CategoriesBudget = () => {
  const { user } = useAuth();
  const { formatCurrency, preferences } = useSettings();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { categories, loading: categoriesLoading, addCategory, updateCategory, deleteCategory } = useCategories(user?.id);
  const { budgets, loading: budgetsLoading, addBudget, updateBudget, deleteBudget, getTotalBudgetAmount, getConvertedBudgets, getTotalConvertedBudgetAmount } = useBudgets(user?.id);
  
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '📁', color: '#3B82F6' });
  const [newBudget, setNewBudget] = useState({ categoryId: '', amount: '', period: 'monthly' as const });

  const loading = categoriesLoading || budgetsLoading;

  const iconOptions = ['📁', '🍔', '🚗', '🏠', '💊', '🎮', '👕', '📚', '🎬', '✈️', '💻', '🎵', '🏋️', '💄', '🎨', '🔧', '📱', '💡', '🎯', '💰'];
  const colorOptions = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    
    try {
      await addCategory(newCategory.name, newCategory.icon, newCategory.color);
      setNewCategory({ name: '', icon: '📁', color: '#3B82F6' });
      setShowAddCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddBudget = async () => {
    if (!newBudget.categoryId || !newBudget.amount) return;
    
    try {
      await addBudget(newBudget.categoryId, parseFloat(newBudget.amount), newBudget.period);
      setNewBudget({ categoryId: '', amount: '', period: 'monthly' });
      setShowAddBudget(false);
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    
    try {
      await updateCategory(editingCategory.id, editingCategory.name, editingCategory.icon, editingCategory.color);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleUpdateBudget = async () => {
    if (!editingBudget || !editingBudget.amount) return;
    
    try {
      await updateBudget(editingBudget.id, parseFloat(editingBudget.amount), editingBudget.period);
      setEditingBudget(null);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all associated budgets.')) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(budgetId);
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return { color: 'text-red-600 dark:text-red-400', icon: AlertCircle, status: 'Over Budget' };
    if (percentage >= 75) return { color: 'text-yellow-600 dark:text-yellow-400', icon: Clock, status: 'Warning' };
    return { color: 'text-green-600 dark:text-green-400', icon: CheckCircle, status: 'On Track' };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg mb-4">
                <Target className="w-4 h-4" />
                Categories & Budget
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-3">
                Manage Your Categories & Budgets
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">Organize your spending and set financial goals</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                onClick={() => navigate('/dashboard')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
              <Button 
                onClick={() => setShowAddCategory(true)}
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex items-center justify-center">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-2 border border-white/20 dark:border-slate-700/30 shadow-lg">
              <Select value={selectedPeriod} onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setSelectedPeriod(value)}>
                <SelectTrigger className="w-32 border-0 bg-transparent">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Categories */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Categories</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {categories.length}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Organized spending areas
                </p>
              </CardContent>
            </Card>

            {/* Total Budget */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Budget</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <PiggyBank className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(getTotalConvertedBudgetAmount(selectedPeriod))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Total converted budget ({selectedPeriod})
                </p>
              </CardContent>
            </Card>

            {/* Budgeted Categories */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Budgeted Categories</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {budgets.filter(b => b.period === selectedPeriod).length}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Categories with budgets
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories Management */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Categories
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Organize your spending into categories
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddCategory(true)}
                    className="rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.length > 0 ? (
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{category.icon}</div>
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">{category.name}</p>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full shadow-sm" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                {budgets.filter(b => b.category_id === category.id).length} budgets
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingCategory(category)}
                            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Categories Yet</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Create your first category to start organizing your spending
                    </p>
                    <Button 
                      variant="outline" 
                      className="rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                      onClick={() => setShowAddCategory(true)}
                    >
                      Create First Category
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budgets Management */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <PiggyBank className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Budgets
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Set spending limits for each category
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddBudget(true)}
                    className="rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Budget
                  </Button>
                </div>
              </CardHeader>
                            <CardContent className="space-y-4">
                {budgets.length > 0 ? (
                  <div className="space-y-3">
                    {getConvertedBudgets(selectedPeriod).map((budget) => (
                      <div key={budget.id} className="space-y-3 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-xl">{budget.category.icon}</div>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{budget.category.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingBudget(budget)}
                              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteBudget(budget.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(budget.convertedAmount)}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {selectedPeriod} budget
                          </div>
                          {budget.originalPeriod !== selectedPeriod && (
                            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              Originally {formatCurrency(budget.originalAmount)} ({budget.originalPeriod})
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <PiggyBank className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No {selectedPeriod} Budgets</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Set up budgets for your categories to track spending
                    </p>
                    <Button 
                      variant="outline" 
                      className="rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                      onClick={() => setShowAddBudget(true)}
                    >
                      Set Up Budgets
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Insight Card */}
          <Card className="rounded-xl border-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Smart Budgeting Tips
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400">
                    AI-powered recommendations for better financial management
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 border border-purple-200/50 dark:border-purple-700/50">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">
                      Budget Optimization
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Consider setting budgets for your top 3 spending categories first. 
                      Start with realistic amounts and adjust based on your actual spending patterns. 
                      Remember to review and update budgets monthly.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Food & Dining"
              />
            </div>
            <div>
              <Label>Icon</Label>
              <div className="grid grid-cols-10 gap-2 mt-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, icon })}
                    className={`p-2 rounded-lg text-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      newCategory.icon === icon ? 'bg-blue-100 dark:bg-blue-900' : ''
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-10 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newCategory.color === color ? 'border-slate-900 dark:border-slate-100' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Budget Dialog */}
      <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget-category">Category</Label>
              <Select value={newBudget.categoryId} onValueChange={(value) => setNewBudget({ ...newBudget, categoryId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget-amount">Amount</Label>
              <Input
                id="budget-amount"
                type="number"
                value={newBudget.amount}
                onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="budget-period">Period</Label>
              <Select value={newBudget.period} onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setNewBudget({ ...newBudget, period: value })}>
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
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddBudget(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBudget}>Add Budget</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g., Food & Dining"
                />
              </div>
              <div>
                <Label>Icon</Label>
                <div className="grid grid-cols-10 gap-2 mt-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setEditingCategory({ ...editingCategory, icon })}
                      className={`p-2 rounded-lg text-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        editingCategory.icon === icon ? 'bg-blue-100 dark:bg-blue-900' : ''
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Color</Label>
                <div className="grid grid-cols-10 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditingCategory({ ...editingCategory, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        editingCategory.color === color ? 'border-slate-900 dark:border-slate-100' : 'border-slate-300 dark:border-slate-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCategory}>Update Category</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          {editingBudget && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-budget-amount">Amount</Label>
                <Input
                  id="edit-budget-amount"
                  type="number"
                  value={editingBudget.amount}
                  onChange={(e) => setEditingBudget({ ...editingBudget, amount: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="edit-budget-period">Period</Label>
                <Select value={editingBudget.period} onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setEditingBudget({ ...editingBudget, period: value })}>
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
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingBudget(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateBudget}>Update Budget</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CategoriesBudget;
