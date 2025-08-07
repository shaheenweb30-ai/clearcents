import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  TrendingUp, 
  DollarSign,
  Grid3X3,
  List,
  Target,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  X,
  Palette,
  Smile,
  SlidersHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useCategories, Category } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";


interface Budget {
  id: string;
  category_id: string;
  amount: number;
  period: string;
  category: Category;
}

const Categories = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetsLoading, setBudgetsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  
  // Delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  
  // Enhanced form states
  const [selectedCategoryType, setSelectedCategoryType] = useState<'income' | 'expense'>('expense');
  const [selectedIcon, setSelectedIcon] = useState('🍎');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  
  // Filter states
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedFilterType, setSelectedFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<'all' | 'with-budget' | 'without-budget'>('all');
  const [budgetAmountRange, setBudgetAmountRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'weekly' | 'monthly' | 'yearly'>('all');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const { categories, loading: categoriesLoading, addCategory, updateCategory, deleteCategory } = useCategories(user?.id);


  const resetFormState = () => {
    setSelectedCategoryType('expense');
    setSelectedIcon('🍎');
    setSelectedColor('#3B82F6');
    setShowIconPicker(false);
    setIconSearchTerm('');
  };

  const clearAllFilters = () => {
    setSelectedFilterType('all');
    setSelectedBudgetRange('all');
    setBudgetAmountRange({ min: 0, max: 1000000 });
    setSelectedPeriod('all');
  };

  const hasActiveFilters = () => {
    return selectedFilterType !== 'all' || 
           selectedBudgetRange !== 'all' || 
           selectedPeriod !== 'all' ||
           budgetAmountRange.min > 0 || 
           budgetAmountRange.max < 1000000;
  };

  // Emoji categories for better organization
  const emojiCategories = {
    food: ['🍎', '🍕', '🍔', '🍟', '🌮', '🍜', '🍣', '🍙', '🥗', '🥪', '🍰', '🍦', '☕', '🍺', '🍷'],
    transport: ['🚗', '🚕', '🚌', '🚲', '🛵', '✈️', '🚅', '🚇', '🚢', '⛽', '🛣️', '🅿️'],
    shopping: ['🛍️', '👕', '👖', '👟', '👜', '💄', '💍', '📱', '💻', '📺', '🎮', '📚'],
    home: ['🏠', '🛋️', '🛏️', '🚿', '🧹', '🔧', '💡', '🌱', '🪑', '🖼️', '🎨', '📻'],
    health: ['💊', '🏥', '👨‍⚕️', '🦷', '👁️', '🩺', '🩹', '🧬', '💉', '🫀', '🧠', '🦴'],
    entertainment: ['🎬', '🎭', '🎨', '🎵', '🎮', '🎪', '🎯', '🎲', '🎳', '🎸', '🎹', '🎤'],
    work: ['💼', '🏢', '💻', '📊', '📈', '📋', '✏️', '📱', '🎓', '📚', '🔬', '⚖️'],
    finance: ['💰', '💳', '🏦', '📊', '📈', '💵', '🪙', '💎', '🏆', '🎯', '📋', '🔒'],
    travel: ['✈️', '🏖️', '🗺️', '🏨', '🎫', '🧳', '📸', '🌍', '🗽', '🗼', '🏰', '⛰️'],
    education: ['📚', '🎓', '✏️', '📝', '🎨', '🔬', '🧮', '🌍', '📖', '📋', '🎯', '🏆'],
    utilities: ['💡', '💧', '🔥', '❄️', '📡', '📶', '🔌', '🔋', '⚡', '🌐', '📱', '📺'],
    income: ['💰', '💵', '💳', '🏦', '📈', '📊', '🎯', '🏆', '💎', '🪙', '💼', '📋']
  };

  const colorPalette = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
    '#14B8A6', '#F43F5E', '#A855F7', '#EAB308', '#22C55E'
  ];

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBudgets();
      fetchTransactions();
    }
  }, [user, categories]);

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

  const fetchBudgets = async () => {
    if (!user) return;

    try {
      setBudgetsLoading(true);
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          id,
          category_id,
          amount,
          period,
          categories!budgets_category_id_fkey (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Budget interface
      const transformedData: Budget[] = (data || []).map((item: any) => ({
        id: item.id,
        category_id: item.category_id,
        amount: item.amount,
        period: item.period,
        category: item.categories
      }));

      setBudgets(transformedData);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast({
        title: "Error",
        description: "Failed to load budgets.",
        variant: "destructive",
      });
    } finally {
      setBudgetsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setTransactionsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          category_id,
          amount,
          transaction_date,
          created_at
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions.",
        variant: "destructive",
      });
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleAddCategoryAndBudget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const icon = selectedIcon;
    const color = selectedColor;
    const budgetAmount = formData.get('budgetAmount') as string;
    const period = formData.get('period') as string;

    // For expense categories, budget is required
    if (selectedCategoryType === 'expense' && !budgetAmount) {
      toast({
        title: "Error",
        description: "Please fill in all fields including budget amount.",
        variant: "destructive",
      });
      return;
    }

    if (!name || !icon || !color) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, create the category
      const newCategory = await addCategory(name, icon, color);
      
      if (!newCategory) {
        throw new Error("Failed to create category");
      }

      // Then, create the budget for this category (only for expenses)
      if (selectedCategoryType === 'expense' && budgetAmount) {
        const { error: budgetError } = await supabase
          .from('budgets')
          .insert({
            user_id: user!.id,
            category_id: newCategory.id,
            amount: parseFloat(budgetAmount),
            period: period || 'monthly'
          });

        if (budgetError) throw budgetError;
      }

      setShowAddForm(false);
      resetFormState();
      toast({
        title: "Category Created! ✅",
        description: "Your category has been created successfully.",
      });
      

    } catch (error) {
      console.error('Error adding category and budget:', error);
      toast({
        title: "Error",
        description: "Failed to create category and budget. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const icon = formData.get('icon') as string;
    const color = formData.get('color') as string;

    if (!name || !icon || !color) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateCategory(editingCategory.id, name, icon, color);
      setShowEditForm(false);
      setEditingCategory(null);
      toast({
        title: "Category Updated! ✨",
        description: "Your category has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    console.log('Delete category clicked:', { categoryId, categoryName });
    
    // Set the category to delete and open the dialog
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    console.log('Delete confirmed, proceeding...');

    try {
      await deleteCategory(categoryToDelete.id);
      console.log('Category deleted successfully');
      toast({
        title: "Category Deleted! 🗑️",
        description: "Your category has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleUpdateBudget = async (budgetId: string, newAmount: number) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .update({ amount: newAmount })
        .eq('id', budgetId)
        .eq('user_id', user!.id);

      if (error) throw error;

      setBudgets(budgets.map(budget => 
        budget.id === budgetId 
          ? { ...budget, amount: newAmount }
          : budget
      ));

      toast({
        title: "Budget Updated! ✨",
        description: "Your budget has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredCategories = categories.filter(category => {
    try {
      // Search filter
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter (income/expense) - for now we'll use a placeholder logic
      // In a real app, you'd have a type field in the category
      const matchesType = selectedFilterType === 'all' || 
                         (selectedFilterType === 'expense' && category.name.toLowerCase().includes('expense')) ||
                         (selectedFilterType === 'income' && category.name.toLowerCase().includes('income'));
      
      // Budget filter
      const budget = getBudgetForCategory(category.id);
      const hasBudget = !!budget;
      const matchesBudgetRange = selectedBudgetRange === 'all' ||
                                (selectedBudgetRange === 'with-budget' && hasBudget) ||
                                (selectedBudgetRange === 'without-budget' && !hasBudget);
      
      // Budget amount filter
      const budgetAmount = budget?.amount || 0;
      const matchesAmountRange = budgetAmount >= budgetAmountRange.min && budgetAmount <= budgetAmountRange.max;
      
      // Period filter
      const matchesPeriod = selectedPeriod === 'all' || 
                           (budget && budget.period === selectedPeriod);
      
      return matchesSearch && matchesType && matchesBudgetRange && matchesAmountRange && matchesPeriod;
    } catch (error) {
      console.error('Error filtering category:', category, error);
      // Fallback to just search filter if there's an error
      return category.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const getBudgetForCategory = (categoryId: string) => {
    return budgets.find(budget => budget.category_id === categoryId);
  };

  const calculateTotalSpent = () => {
    try {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Get all expense transactions for current month
      const monthlyExpenses = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();
        
        // Only include expenses (negative amounts) from current month
        return transaction.amount < 0 && 
               transactionMonth === currentMonth && 
               transactionYear === currentYear;
      });
      
      return Math.abs(monthlyExpenses.reduce((sum, transaction) => sum + transaction.amount, 0));
    } catch (error) {
      console.error('Error calculating total spent:', error);
      return 0;
    }
  };

  const calculateBudgetProgress = (budget: Budget) => {
    try {
      // Get current date for period calculations
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Filter transactions for this category and current period
      const categoryTransactions = transactions.filter(transaction => {
        if (transaction.category_id !== budget.category_id) return false;
        
        const transactionDate = new Date(transaction.transaction_date);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();
        
        // Only include expenses (negative amounts) and filter by period
        if (transaction.amount >= 0) return false; // Skip income transactions
        
        switch (budget.period) {
          case 'weekly':
            // Get transactions from the last 7 days
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return transactionDate >= weekAgo;
          case 'monthly':
            // Get transactions from current month
            return transactionMonth === currentMonth && transactionYear === currentYear;
          case 'yearly':
            // Get transactions from current year
            return transactionYear === currentYear;
          default:
            return transactionMonth === currentMonth && transactionYear === currentYear;
        }
      });
      
      // Calculate total spent (absolute value of negative amounts)
      const spent = Math.abs(categoryTransactions.reduce((sum, transaction) => sum + transaction.amount, 0));
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      return { spent, percentage };
    } catch (error) {
      console.error('Error calculating budget progress:', error);
      // Fallback to placeholder calculation
      const spent = budget.amount * 0.6;
      const percentage = (spent / budget.amount) * 100;
      return { spent, percentage };
    }
  };

  if (loading || !user || transactionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Categories
            </h1>
            <p className="text-muted-foreground">
              Organize your transactions with custom categories
            </p>
          </div>

          {/* Budget Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${budgets.reduce((sum, budget) => sum + budget.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly budget allocation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spent</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${calculateTotalSpent().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  This month's expenses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(budgets.reduce((sum, budget) => sum + budget.amount, 0) - calculateTotalSpent()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Budget remaining this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsFilterPanelOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters() && (
                    <Badge variant="secondary" className="ml-1">
                      Active
                    </Badge>
                  )}
                </Button>
                {hasActiveFilters() && (
                  <Button 
                    variant="ghost" 
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => setShowAddForm(true)} 
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>

          {/* Categories Display */}
          {categoriesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms." : "Create your first category and budget to get started."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => {
                const budget = getBudgetForCategory(category.id);
                const progress = budget ? calculateBudgetProgress(budget) : null;
                
                return (
                  <Card key={category.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            {category.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{category.name}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategory(category);
                              setShowEditForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id, category.name);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {budget ? (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Budget</span>
                            <span className="font-medium">${budget.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Spent</span>
                            <span className="font-medium">${progress!.spent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <Progress value={progress!.percentage} className="h-2" />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{progress!.percentage.toFixed(0)}% used</span>
                            <span className="text-muted-foreground">{budget.period}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 text-center py-4 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                          <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">No budget set</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              // TODO: Add budget creation modal
                              toast({
                                title: "Coming Soon",
                                description: "Budget creation for existing categories will be available soon.",
                              });
                            }}
                          >
                            Set Budget
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCategories.map((category) => {
                const budget = getBudgetForCategory(category.id);
                const progress = budget ? calculateBudgetProgress(budget) : null;
                
                return (
                  <Card key={category.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            {category.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base truncate">{category.name}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategory(category);
                              setShowEditForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id, category.name);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {budget ? (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Budget: ${budget.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className="text-muted-foreground">Spent: ${progress!.spent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <Progress value={progress!.percentage} className="h-1" />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{progress!.percentage.toFixed(0)}% used</span>
                            <span className="text-muted-foreground">{budget.period}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 text-center py-2 border border-dashed border-muted-foreground/20 rounded">
                          <p className="text-xs text-muted-foreground">No budget set</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Add Category & Budget Form */}
          {showAddForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
              <Card className="w-full max-w-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Create New Category</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAddForm(false);
                        resetFormState();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCategoryAndBudget} className="space-y-6">
                    {/* Category Type Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Category Type</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={selectedCategoryType === 'expense' ? 'default' : 'outline'}
                          className="h-12 flex items-center gap-2"
                          onClick={() => setSelectedCategoryType('expense')}
                        >
                          <TrendingDown className="h-4 w-4" />
                          Expense
                        </Button>
                        <Button
                          type="button"
                          variant={selectedCategoryType === 'income' ? 'default' : 'outline'}
                          className="h-12 flex items-center gap-2"
                          onClick={() => setSelectedCategoryType('income')}
                        >
                          <TrendingUp className="h-4 w-4" />
                          Income
                        </Button>
                      </div>
                    </div>

                    {/* Category Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Category Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g., Groceries, Salary, Freelance"
                        className="h-11"
                        required
                      />
                    </div>

                    {/* Icon Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Icon</Label>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-colors"
                          style={{ backgroundColor: `${selectedColor}20` }}
                          onClick={() => setShowIconPicker(true)}
                        >
                          {selectedIcon}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowIconPicker(true)}
                          className="flex-1 h-11"
                        >
                          <Smile className="h-4 w-4 mr-2" />
                          Choose Icon
                        </Button>
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Color</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {colorPalette.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              selectedColor === color 
                                ? 'border-gray-900 scale-110' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Budget Section - Only for Expenses */}
                    {selectedCategoryType === 'expense' && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Budget Settings</Label>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="budgetAmount" className="text-sm font-medium">Budget Amount</Label>
                            <Input
                              id="budgetAmount"
                              name="budgetAmount"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="500.00"
                              className="h-11"
                              required={selectedCategoryType === 'expense'}
                            />
                          </div>
                          <div>
                            <Label htmlFor="period" className="text-sm font-medium">Budget Period</Label>
                            <Select name="period" defaultValue="monthly">
                              <SelectTrigger className="h-11">
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
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setShowAddForm(false);
                          resetFormState();
                        }}
                        className="flex-1 h-11"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 h-11">
                        Create Category
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Icon Picker Modal */}
          {showIconPicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
              <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Choose Icon</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowIconPicker(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search emojis..."
                      value={iconSearchTerm}
                      onChange={(e) => setIconSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="overflow-y-auto max-h-[60vh]">
                  <div className="space-y-4">
                    {Object.entries(emojiCategories).map(([category, emojis]) => {
                      const filteredEmojis = emojis.filter(emoji => 
                        iconSearchTerm === '' || emoji.includes(iconSearchTerm)
                      );
                      
                      if (filteredEmojis.length === 0) return null;
                      
                      return (
                        <div key={category} className="space-y-2">
                          <Label className="text-sm font-medium capitalize">{category}</Label>
                          <div className="grid grid-cols-8 gap-2">
                            {filteredEmojis.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg hover:bg-gray-100 transition-colors ${
                                  selectedIcon === emoji ? 'bg-primary text-primary-foreground' : ''
                                }`}
                                onClick={() => {
                                  setSelectedIcon(emoji);
                                  setShowIconPicker(false);
                                }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filter Side Panel */}
          {isFilterPanelOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsFilterPanelOpen(false)} />
              <div className="relative w-full sm:w-96 h-[80vh] sm:h-auto bg-white rounded-t-xl sm:rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Filters</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsFilterPanelOpen(false)}
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[calc(80vh-120px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Category Type Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Category Type</Label>
                    <Select
                      value={selectedFilterType}
                      onValueChange={(value: 'all' | 'income' | 'expense') => setSelectedFilterType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget Status Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Budget Status</Label>
                    <Select
                      value={selectedBudgetRange}
                      onValueChange={(value: 'all' | 'with-budget' | 'without-budget') => setSelectedBudgetRange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="with-budget">With Budget</SelectItem>
                        <SelectItem value="without-budget">Without Budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget Amount Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Budget Amount Range</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Min Amount</Label>
                        <Input
                          type="number"
                          value={budgetAmountRange.min}
                          onChange={(e) => setBudgetAmountRange({ ...budgetAmountRange, min: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Max Amount</Label>
                        <Input
                          type="number"
                          value={budgetAmountRange.max}
                          onChange={(e) => setBudgetAmountRange({ ...budgetAmountRange, max: parseFloat(e.target.value) || 1000000 })}
                          placeholder="1000000"
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Budget Period Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Budget Period</Label>
                    <Select
                      value={selectedPeriod}
                      onValueChange={(value: 'all' | 'weekly' | 'monthly' | 'yearly') => setSelectedPeriod(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Periods</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={clearAllFilters}
                      className="flex-1"
                    >
                      Clear All
                    </Button>
                    <Button 
                      onClick={() => setIsFilterPanelOpen(false)}
                      className="flex-1"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Category Form */}
          {showEditForm && editingCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <Card className="w-96">
                <CardHeader>
                  <CardTitle>Edit Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Category Name</Label>
                      <Input
                        id="edit-name"
                        name="name"
                        defaultValue={editingCategory.name}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-icon">Icon</Label>
                      <Input
                        id="edit-icon"
                        name="icon"
                        defaultValue={editingCategory.icon}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-color">Color</Label>
                      <Input
                        id="edit-color"
                        name="color"
                        type="color"
                        defaultValue={editingCategory.color}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="submit" className="flex-1">
                        Update Category
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setShowEditForm(false);
                          setEditingCategory(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {isDeleteDialogOpen && categoryToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <Card className="w-96">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    Delete Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Delete "{categoryToDelete.name}"?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      This action cannot be undone. This will permanently delete the category and remove all associated data including:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 mb-6">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        All budgets for this category
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        All transactions in this category
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        Category settings and preferences
                      </li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsDeleteDialogOpen(false);
                        setCategoryToDelete(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={confirmDeleteCategory}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete Category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Categories; 