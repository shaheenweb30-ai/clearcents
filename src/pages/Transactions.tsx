import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  Calendar as CalendarIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  X,
  RefreshCw,
  Wallet,
  PiggyBank,
  BarChart3,
  Receipt,
  CreditCard,
  Banknote
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category_id: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  type?: 'income' | 'expense'; // Derived from amount
  categories?: {
    id: string;
    name: string;
  };
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

interface TransactionForm {
  type: 'income' | 'expense';
  transaction_name: string;
  amount: string;
  description: string;
  category_id: string;
  transaction_date: Date;
}

// UserSettings interface removed - now using settings context

interface Filters {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  category: string;
  amountRange: {
    min: string;
    max: string;
  };
  type: string;
}

const Transactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<Filters>({
    dateRange: { from: undefined, to: undefined },
    category: '',
    amountRange: { min: '', max: '' },
    type: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#1752F3',
    icon: 'tag'
  });
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const { formatCurrency, preferences } = useSettings();

  const [formData, setFormData] = useState<TransactionForm>({
    type: 'expense',
    transaction_name: '',
    amount: '',
    description: '',
    category_id: '',
    transaction_date: new Date()
  });

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchCategories();
    }
  }, [user]);

  // formatCurrency now comes from useSettings hook

  // Update filtered categories when categories or search term changes
  useEffect(() => {
    if (categorySearchTerm.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categories, categorySearchTerm]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories:category_id (
            id,
            name
          )
        `)
        .eq('user_id', user?.id)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      setTransactions((data || []) as Transaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount) {
      toast({
        title: "Validation Error",
        description: "Please enter an amount",
        variant: "destructive"
      });
      return;
    }

    try {
      const transactionData = {
        user_id: user?.id,
        amount: formData.type === 'expense' ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount)),
        description: formData.transaction_name,
        category_id: formData.category_id || null,
        transaction_date: format(formData.transaction_date, 'yyyy-MM-dd')
      };

      if (editingTransaction) {
        // Update existing transaction
        const { error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', editingTransaction.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Transaction updated successfully"
        });
      } else {
        // Create new transaction
        const { error } = await supabase
          .from('transactions')
          .insert([transactionData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Transaction added successfully"
        });
      }

      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast({
        title: "Error",
        description: "Failed to save transaction",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully"
      });
      
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.amount >= 0 ? 'income' : 'expense',
      transaction_name: transaction.description,
      amount: Math.abs(transaction.amount).toString(),
      description: transaction.description,
      category_id: transaction.category_id || '',
      transaction_date: new Date(transaction.transaction_date)
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      transaction_name: '',
      amount: '',
      description: '',
      category_id: '',
      transaction_date: new Date()
    });
    setEditingTransaction(null);
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: newCategory.name.trim(),
          color: newCategory.color,
          icon: newCategory.icon,
          user_id: user?.id,
          is_default: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Add the new category to the list
      setCategories(prev => [...prev, data]);
      
      // Set the new category as selected
      setFormData(prev => ({ ...prev, category_id: data.id }));
      
      // Reset the new category form
      setNewCategory({
        name: '',
        color: '#FF6B6B',
        icon: 'tag'
      });
      
      setShowCategoryDialog(false);
      
      toast({
        title: "Success",
        description: "Category created successfully"
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filters.type) {
      const transactionType = transaction.amount >= 0 ? 'income' : 'expense';
      if (transactionType !== filters.type) {
        return false;
      }
    }

    // Category filter
    if (filters.category && transaction.category_id !== filters.category) {
      return false;
    }

    // Amount range filter
    const amount = Math.abs(transaction.amount);
    if (filters.amountRange.min && amount < parseFloat(filters.amountRange.min)) {
      return false;
    }
    if (filters.amountRange.max && amount > parseFloat(filters.amountRange.max)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      const transactionDate = new Date(transaction.transaction_date);
      if (filters.dateRange.from && transactionDate < filters.dateRange.from) {
        return false;
      }
      if (filters.dateRange.to && transactionDate > filters.dateRange.to) {
        return false;
      }
    }

    return true;
  });

  const clearFilters = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      category: '',
      amountRange: { min: '', max: '' },
      type: ''
    });
    setSearchTerm('');
  };

  const totalIncome = filteredTransactions
    .filter(t => t.amount >= 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
              <p className="text-muted-foreground">View and manage all your income and expenses in one place</p>
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              + Add Transaction
            </Button>
          </div>

          {/* Summary Cards - Only show when there are transactions */}
          {transactions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Transactions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{filteredTransactions.length}</div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {transactions.length} total
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
                    {formatCurrency(totalIncome)}
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    From filtered results
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
                    {formatCurrency(totalExpenses)}
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    From filtered results
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Net Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-purple-900 dark:text-purple-100' : 'text-red-900 dark:text-red-100'}`}>
                    {formatCurrency(totalIncome - totalExpenses)}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    Income - Expenses
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search - Only show when there are transactions */}
          {transactions.length > 0 && (
            <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    Filters & Search
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="border-primary/20 hover:bg-primary/5"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="border-red-200 hover:bg-red-50 text-red-600 dark:border-red-800 dark:hover:bg-red-950/50 dark:text-red-400"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions by description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  {/* Type Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Transaction Type</Label>
                    <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="border-2 focus:border-primary focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Category</Label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="border-2 focus:border-primary focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Range */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Min Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={filters.amountRange.min}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        amountRange: { ...prev.amountRange, min: e.target.value }
                      }))}
                      className="border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Max Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={filters.amountRange.max}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        amountRange: { ...prev.amountRange, max: e.target.value }
                      }))}
                      className="border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Transactions Table */}
          <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                All Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-16">
                  {transactions.length === 0 ? (
                    // Empty State
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Receipt className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">No Transactions Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start tracking your expenses and income by adding your first transaction.
                      </p>
                      <Button 
                        onClick={() => {
                          resetForm();
                          setIsDialogOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/90 shadow-lg"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        + Add Transaction
                      </Button>
                    </div>
                  ) : (
                    // No Results State
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-12 h-12 text-gray-600 dark:text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">No Results Found</h3>
                      <p className="text-muted-foreground mb-6">
                        No transactions match your current filters. Try adjusting your search criteria.
                      </p>
                      <Button 
                        variant="outline"
                        onClick={clearFilters}
                        className="mr-2"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="group flex items-center justify-between p-4 bg-card/70 rounded-xl border border-border hover:bg-card hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.amount >= 0 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.amount >= 0 ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : (
                            <TrendingDown className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{transaction.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                            </span>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs font-medium">
                              {transaction.categories?.name || 'Uncategorized'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                            className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                            title="Edit Transaction"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                title="Delete Transaction"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this transaction? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(transaction.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Transaction Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[420px] p-0 border-0 shadow-xl">
            {/* Minimalist Header */}
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-semibold text-foreground">
                    {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
                  </DialogTitle>
                  <p className="text-muted-foreground text-sm mt-1">
                    {editingTransaction ? 'Update your transaction details' : 'Record your income or expense'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Minimalist Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.type === 'income' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                      className="flex-1"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Income
                    </Button>
                    <Button
                      type="button"
                      variant={formData.type === 'expense' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                      className="flex-1"
                    >
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Expense
                    </Button>
                  </div>
                </div>

                {/* Transaction Name Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Name <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input
                    placeholder="e.g., Grocery shopping, Salary, Coffee"
                    value={formData.transaction_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, transaction_name: e.target.value }))}
                  />
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Amount</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {preferences.currency_symbol}
                    </div>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                {/* Modern Category Selection - For Both Income and Expenses */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => {
                    if (value === 'create-new') {
                      setShowCategoryDialog(true);
                    } else {
                      setFormData(prev => ({ ...prev, category_id: value }));
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent className="w-[320px] max-h-[240px]">
                      <div className="p-3 border-b bg-muted/30">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search categories..."
                            className="pl-9 h-9 text-sm"
                            value={categorySearchTerm}
                            onChange={(e) => setCategorySearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-[180px] overflow-y-auto p-2">
                        <div className="space-y-1">
                          {filteredCategories.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">
                                {categorySearchTerm ? 'No categories found' : 'No categories available'}
                              </p>
                            </div>
                          ) : (
                            <>
                              {filteredCategories.map((category) => (
                                <SelectItem 
                                  key={category.id} 
                                  value={category.id} 
                                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                  <div 
                                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-medium shadow-sm"
                                    style={{ backgroundColor: category.color }}
                                  >
                                    {category.icon.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-medium">{category.name}</span>
                                </SelectItem>
                              ))}
                              <div className="border-t pt-2 mt-2">
                                <SelectItem 
                                  value="create-new" 
                                  className="flex items-center gap-3 p-3 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                >
                                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Plus className="h-4 w-4 text-primary" />
                                  </div>
                                  <span className="font-medium">Create New Category</span>
                                </SelectItem>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.transaction_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.transaction_date ? format(formData.transaction_date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.transaction_date}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, transaction_date: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>


              </form>
              
              {/* Minimalist Form Actions */}
              <div className="border-t p-6">
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={!formData.amount}
                  >
                    {editingTransaction ? 'Update' : 'Add'} Transaction
                  </Button>
                </div>
              </div>
          </DialogContent>
        </Dialog>

        {/* Create Category Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent className="sm:max-w-[420px] max-h-[75vh] overflow-hidden p-0 border-0 shadow-2xl">
            {/* Modern Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-xl font-semibold text-white">Create Category</DialogTitle>
                  <p className="text-white/80 text-sm mt-1">Add a custom category for your transactions</p>
                </div>
              </div>
              {/* Floating close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCategoryDialog(false);
                  setNewCategory({
                    name: '',
                    color: '#1752F3',
                    icon: 'tag'
                  });
                }}
                className="absolute top-4 right-4 h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col h-[calc(75vh-120px)]">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateCategory(); }} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Category Name */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Category Name</Label>
                  <Input
                    placeholder="e.g., Groceries, Bills, Entertainment"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                {/* Modern Color Picker */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Color</Label>
                  <div className="grid grid-cols-8 gap-3">
                    {[
                      '#1752F3', '#4A90E2', '#6BA5F7', '#8BB8FF', '#A8C8FF', '#C5D8FF', '#E2E8FF',
                      '#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF',
                      '#1E3A8A', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE',
                      '#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                        className={`relative w-10 h-10 rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                          newCategory.color === color 
                            ? 'border-foreground scale-110 shadow-lg' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {newCategory.color === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modern Icon Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Icon</Label>
                  <Select value={newCategory.icon} onValueChange={(value) => setNewCategory(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger className="h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="w-[300px] max-h-[200px]">
                      <div className="p-3 border-b bg-muted/30">
                        <div className="text-sm font-medium text-muted-foreground">Choose an icon</div>
                      </div>
                      <div className="max-h-[150px] overflow-y-auto p-3">
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            'tag', 'shopping-bag', 'coffee', 'car', 'home', 'heart', 'zap', 'book',
                            'plane', 'gift', 'briefcase', 'graduation-cap', 'gamepad-2', 'music', 
                            'camera', 'dumbbell', 'utensils', 'wifi', 'phone', 'laptop', 'tv',
                            'bicycle', 'bus', 'train', 'ship', 'rocket', 'star', 'moon', 'sun'
                          ].map((icon) => (
                            <SelectItem 
                              key={icon} 
                              value={icon} 
                              className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center mb-1">
                                <span className="text-xs font-medium">{icon}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{icon}</span>
                            </SelectItem>
                          ))}
                        </div>
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Modern Preview */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Preview</Label>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl border">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold shadow-sm"
                      style={{ backgroundColor: newCategory.color }}
                    >
                      {newCategory.icon.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        {newCategory.name || 'Category Name'}
                      </span>
                      <p className="text-xs text-muted-foreground">This is how your category will appear</p>
                    </div>
                  </div>
                </div>
              </form>

              {/* Modern Form Actions */}
              <div className="border-t bg-muted/20 p-6">
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCategoryDialog(false);
                      setNewCategory({
                        name: '',
                        color: '#1752F3',
                        icon: 'tag'
                      });
                    }}
                    className="px-6 py-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    onClick={handleCreateCategory}
                    className="px-6 py-2 bg-primary hover:bg-primary/90 shadow-lg"
                    disabled={!newCategory.name.trim()}
                  >
                    Create Category
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

export default Transactions;
