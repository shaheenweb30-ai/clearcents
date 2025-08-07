import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FolderOpen,
  DollarSign,
  Target,
  Calendar,
  Palette,
  Type,
  MoreHorizontal,
  ShoppingBag,
  Car,
  Home,
  Utensils,
  Heart,
  Zap,
  Book,
  Plane,
  Coffee,
  Gift,
  Briefcase,
  GraduationCap,
  Gamepad2,
  Music,
  Camera,
  Dumbbell,
  Pizza,
  Beer,
  Smile,
  Wallet,
  PiggyBank,
  BarChart3,
  Receipt,
  CreditCard,
  Banknote,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

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
  category_id: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}

interface CategoryForm {
  name: string;
  color: string;
  icon: string;
  budget_amount: string;
  budget_period: 'weekly' | 'monthly' | 'yearly';
}



const ICONS = [
  { value: 'shopping-bag', label: 'Shopping', icon: ShoppingBag, emoji: '🛒' },
  { value: 'car', label: 'Transport', icon: Car, emoji: '🚗' },
  { value: 'home', label: 'Home', icon: Home, emoji: '🏠' },
  { value: 'utensils', label: 'Food', icon: Utensils, emoji: '🍽️' },
  { value: 'heart', label: 'Health', icon: Heart, emoji: '❤️' },
  { value: 'zap', label: 'Utilities', icon: Zap, emoji: '⚡' },
  { value: 'book', label: 'Education', icon: Book, emoji: '📚' },
  { value: 'plane', label: 'Travel', icon: Plane, emoji: '✈️' },
  { value: 'coffee', label: 'Entertainment', icon: Coffee, emoji: '☕' },
  { value: 'gift', label: 'Gifts', icon: Gift, emoji: '🎁' },
  { value: 'briefcase', label: 'Work', icon: Briefcase, emoji: '💼' },
  { value: 'graduation-cap', label: 'Education', icon: GraduationCap, emoji: '🎓' },
  { value: 'gamepad-2', label: 'Gaming', icon: Gamepad2, emoji: '🎮' },
  { value: 'music', label: 'Music', icon: Music, emoji: '🎵' },
  { value: 'camera', label: 'Photography', icon: Camera, emoji: '📷' },
  { value: 'dumbbell', label: 'Fitness', icon: Dumbbell, emoji: '💪' },
  { value: 'pizza', label: 'Dining', icon: Pizza, emoji: '🍕' },
  { value: 'beer', label: 'Social', icon: Beer, emoji: '🍺' },
  { value: 'smile', label: 'Other', icon: Smile, emoji: '😊' },
  { value: 'wallet', label: 'Wallet', icon: Wallet, emoji: '👛' },
  { value: 'piggy-bank', label: 'Savings', icon: PiggyBank, emoji: '🐷' },
  { value: 'bar-chart-3', label: 'Investment', icon: BarChart3, emoji: '📊' },
  { value: 'receipt', label: 'Bills', icon: Receipt, emoji: '🧾' },
  { value: 'credit-card', label: 'Credit Card', icon: CreditCard, emoji: '💳' },
  { value: 'banknote', label: 'Cash', icon: Banknote, emoji: '💵' }
];

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', 
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#A8E6CF', '#FF9F43', '#54A0FF',
  '#5F27CD', '#00D2D3', '#FF9FF3', '#FECA57', '#48DB71', '#FF6B6B'
];

const Categories = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { formatCurrency, preferences } = useSettings();

  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    color: COLORS[0],
    icon: ICONS[0].value,
    budget_amount: '',
    budget_period: 'monthly'
  });

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchBudgets();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user?.id)
        .order('name');

      if (error) throw error;
      setCategories((data || []) as Category[]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setBudgets((data || []) as Budget[]);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name",
        variant: "destructive"
      });
      return;
    }

    try {
      const categoryData = {
        name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon,
        user_id: user?.id
      };

      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Category updated successfully"
        });
      } else {
        // Create new category
        const { data: newCategory, error } = await supabase
          .from('categories')
          .insert([categoryData])
          .select()
          .single();

        if (error) throw error;

        // Create budget if amount is provided
        if (formData.budget_amount && parseFloat(formData.budget_amount) > 0) {
          const budgetData = {
            user_id: user?.id,
            category_id: newCategory.id,
            amount: parseFloat(formData.budget_amount),
            period: formData.budget_period
          };

          const { error: budgetError } = await supabase
            .from('budgets')
            .insert([budgetData]);

          if (budgetError) {
            console.error('Error creating budget:', budgetError);
          }
        }

        toast({
          title: "Success",
          description: "Category created successfully"
        });
      }

      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
      fetchCategories();
      fetchBudgets();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      // Check if category has transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('id')
        .eq('category_id', category.id)
        .limit(1);

      if (transactionsError) throw transactionsError;

      if (transactions && transactions.length > 0) {
        toast({
          title: "Cannot Delete",
          description: "This category has transactions. Please reassign them first.",
          variant: "destructive"
        });
        return;
      }

      // Delete category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: Category) => {
    const budget = budgets.find(b => b.category_id === category.id);
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon,
      budget_amount: budget?.amount.toString() || '',
      budget_period: budget?.period || 'monthly'
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: COLORS[0],
      icon: ICONS[0].value,
      budget_amount: '',
      budget_period: 'monthly'
    });
    setEditingCategory(null);
  };

  const getBudgetForCategory = (categoryId: string) => {
    return budgets.find(b => b.category_id === categoryId);
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      default: return period;
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconData = ICONS.find(icon => icon.value === iconName);
    return iconData ? iconData.icon : ShoppingBag;
  };

  const getIconEmoji = (iconName: string) => {
    const iconData = ICONS.find(icon => icon.value === iconName);
    return iconData ? iconData.emoji : '📁';
  };



  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
              <h1 className="text-3xl font-bold text-foreground">Manage Categories</h1>
              <p className="text-muted-foreground">Create and manage your spending categories and assign a budget to each one.</p>
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              + Add Category
            </Button>
          </div>

          {/* Content */}
          {categories.length === 0 ? (
            // Empty State
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FolderOpen className="w-16 h-16 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">No Categories Yet</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Start by creating your first spending category.
                </p>
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md shadow-lg text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  + Add Category
                </Button>
              </div>
            </div>
          ) : (
            // Populated State
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => {
                const budget = getBudgetForCategory(category.id);
                
                return (
                  <Card key={category.id} className="rounded-lg border bg-card text-card-foreground shadow-sm group hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                            style={{ backgroundColor: category.color }}
                          >
                            {getIconEmoji(category.icon)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{category.name}</h3>
                            {budget ? (
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm font-medium text-foreground">
                                  {formatCurrency(budget.amount)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {getPeriodLabel(budget.period)}
                                </Badge>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground mt-1">No budget set</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            className="hover:bg-primary/10 hover:text-primary"
                            title="Edit Category"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="hover:bg-destructive/10 hover:text-destructive"
                                title="Delete Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{category.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(category)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Add/Edit Category Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden p-0 border-0 shadow-2xl">
            {/* Modern Header */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-xl font-semibold text-white">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </DialogTitle>
                  <p className="text-white/80 text-sm mt-1">
                    {editingCategory ? 'Update your category details' : 'Create a new spending category'}
                  </p>
                </div>
              </div>
              {/* Floating close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                className="absolute top-4 right-4 h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col h-[calc(85vh-120px)]">
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Category Name */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Category Name</Label>
                  <Input
                    placeholder="e.g., Groceries, Bills, Entertainment"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>

                {/* Icon Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Select Icon</Label>
                  <div className="grid grid-cols-6 gap-3">
                    {ICONS.map((iconData) => (
                      <button
                        key={iconData.value}
                        type="button"
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.icon === iconData.value 
                            ? 'border-blue-500 bg-blue-50 scale-110' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, icon: iconData.value }))}
                      >
                        <div className="text-2xl mb-1">{iconData.emoji}</div>
                        <p className="text-xs text-center text-muted-foreground">{iconData.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Choose Color</Label>
                  <div className="grid grid-cols-8 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          formData.color === color ? 'border-gray-900 scale-110 shadow-lg' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                </div>

                {/* Budget Amount */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Budget Amount (Optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {preferences.currency_symbol}
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.budget_amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget_amount: e.target.value }))}
                      className="pl-12 h-12 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Budget Period */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Budget Reset Frequency</Label>
                  <Select value={formData.budget_period} onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setFormData(prev => ({ ...prev, budget_period: value }))}>
                    <SelectTrigger className="h-12 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>

              {/* Modern Form Actions */}
              <div className="border-t bg-muted/20 p-6">
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 shadow-lg"
                    disabled={!formData.name.trim()}
                  >
                    {editingCategory ? 'Update' : 'Create'} Category
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Categories;
