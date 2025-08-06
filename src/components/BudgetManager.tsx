import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PiggyBank, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/hooks/useCategories";

interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'under' | 'over' | 'warning';
}

interface BudgetManagerProps {
  userId: string;
  transactions: any[];
  selectedCategory?: string;
  action?: string;
}

export const BudgetManager = ({ userId, transactions, selectedCategory, action }: BudgetManagerProps) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetProgress, setBudgetProgress] = useState<BudgetProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly'
  });

  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories(userId);

  useEffect(() => {
    fetchBudgets();
  }, [userId]);

  useEffect(() => {
    calculateBudgetProgress();
  }, [budgets, transactions]);

  // Handle navigation from insights
  useEffect(() => {
    if (selectedCategory && action === 'set-budget' && categories.length > 0) {
      // Find the category by name
      const category = categories.find(cat => cat.name === selectedCategory);
      if (category) {
        setFormData(prev => ({
          ...prev,
          category_id: category.id
        }));
        setIsAddDialogOpen(true);
      }
    }
  }, [selectedCategory, action, categories]);

  const fetchBudgets = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching budgets:', error);
        toast({
          title: "Error",
          description: "Failed to load budgets. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast({
        title: "Error",
        description: "Failed to load budgets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateBudgetProgress = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const progress = budgets.map(budget => {
      // Filter transactions for this category and period
      const periodTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        const isCorrectCategory = transaction.category_id === budget.category_id;
        const isCorrectPeriod = transactionDate >= startOfMonth && transactionDate <= endOfMonth;
        const isExpense = transaction.amount < 0;
        
        return isCorrectCategory && isCorrectPeriod && isExpense;
      });

      const spent = Math.abs(periodTransactions.reduce((sum, t) => sum + t.amount, 0));
      const remaining = budget.amount - spent;
      const percentage = Math.min((spent / budget.amount) * 100, 100);

      let status: 'under' | 'over' | 'warning' = 'under';
      if (percentage >= 100) {
        status = 'over';
      } else if (percentage >= 80) {
        status = 'warning';
      }

      return {
        budget,
        spent,
        remaining,
        percentage,
        status
      };
    });

    setBudgetProgress(progress);
  };

  const handleAddBudget = async () => {
    if (!userId) return;

    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category_id) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: userId,
          category_id: formData.category_id,
          amount: amount,
          period: formData.period
        })
        .select();

      if (error) {
        console.error('Error adding budget:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Budget added successfully",
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchBudgets();
    } catch (error) {
      console.error('Error adding budget:', error);
      toast({
        title: "Error",
        description: "Failed to add budget",
        variant: "destructive",
      });
    }
  };

  const handleEditBudget = async () => {
    if (!editingBudget) return;

    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          amount: amount,
          period: formData.period
        })
        .eq('id', editingBudget.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingBudget(null);
      resetForm();
      fetchBudgets();
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });

      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      amount: '',
      period: 'monthly'
    });
  };

  const openEditDialog = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category_id: budget.category_id,
      amount: budget.amount.toString(),
      period: budget.period
    });
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case 'under':
        return <Target className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Budget Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading budgets...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Budget Management
          </h2>
          <p className="text-muted-foreground">
            Set and track budgets for your spending categories
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set New Budget</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="" disabled>
                        Loading categories...
                      </SelectItem>
                    ) : categories.length === 0 ? (
                      <SelectItem value="" disabled>
                        No categories available. Please create categories first.
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {!categoriesLoading && categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    You need to create categories first. Go to the{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => window.location.href = '/categories'}
                    >
                      Categories page
                    </Button>{" "}
                    to create some categories.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Budget Period</Label>
                <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value as 'monthly' | 'weekly' | 'yearly' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBudget}>
                Set Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Cards */}
      {budgetProgress.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Budgets Set</h3>
            <p className="text-muted-foreground mb-4">
              Set budgets for your spending categories to track your financial goals.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Set Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgetProgress.map((progress) => (
            <Card key={progress.budget.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{progress.budget.categories?.icon}</span>
                    <div>
                      <h3 className="font-semibold">{progress.budget.categories?.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {progress.budget.period} Budget
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(progress.status)}
                    <Badge className={`text-xs ${getStatusColor(progress.status)}`}>
                      {progress.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spent</span>
                    <span className="font-semibold">${progress.spent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Budget</span>
                    <span className="font-semibold">${progress.budget.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining</span>
                    <span className={`font-semibold ${progress.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${progress.remaining.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <Progress value={progress.percentage} className="h-2" />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progress.percentage.toFixed(1)}% used</span>
                  <span>{progress.budget.period}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(progress.budget)}
                    className="flex-1"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBudget(progress.budget.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Budget Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Budget Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-period">Budget Period</Label>
              <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value as 'monthly' | 'weekly' | 'yearly' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBudget}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 