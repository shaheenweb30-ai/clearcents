import React, { useState, useEffect, useMemo } from 'react';
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
  Banknote,
  Tag
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/use-mobile";

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
  const { isMobile, isSmallMobile } = useResponsive();
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

  // Debug effect for showFilters
  useEffect(() => {
    console.log('showFilters state changed to:', showFilters);
  }, [showFilters]);

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

  // Group transactions by date for a modern timeline rendering
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach((t) => {
      const key = format(new Date(t.transaction_date), 'PPP');
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const orderedDates = useMemo(() => {
    return Object.keys(groupedByDate).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedByDate]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'}`}>
            <div className={`${isMobile ? 'text-center' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
                <Receipt className="w-3 h-3 sm:w-4 sm:h-4" />
                Transactions
              </div>
              <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3 ${isMobile ? 'text-center' : ''}`}>Track and manage money flow</h1>
              <p className={`text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 ${isMobile ? 'text-center' : ''}`}>Fast entry, powerful filters, real-time totals</p>
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className={`${isMobile ? 'w-full max-w-sm mx-auto' : ''} rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 h-12 sm:h-auto`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {/* Summary Cards - Only show when there are transactions */}
          {transactions.length > 0 && (
            <div className={`grid gap-3 sm:gap-4 md:gap-6 ${
              isMobile 
                ? 'grid-cols-1 sm:grid-cols-2' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Transactions</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{filteredTransactions.length}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {transactions.length} total
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Income</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(totalIncome)}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    From filtered results
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Expenses</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(totalExpenses)}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    From filtered results
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Net Balance</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl sm:text-3xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(totalIncome - totalExpenses)}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Income - Expenses
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search - Always show */}
          <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-sm sm:text-base">Filters & Search</span>
                </CardTitle>
                <div className={`flex ${isMobile ? 'flex-col space-y-2 w-full' : 'items-center space-x-2'}`}>
                  <div className="text-xs text-slate-500 mr-2">State: {showFilters ? 'true' : 'false'}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('Button clicked! Current showFilters:', showFilters);
                      setShowFilters(!showFilters);
                      console.log('Setting showFilters to:', !showFilters);
                    }}
                    className={`border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-200 ${isMobile ? 'w-full' : ''}`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className={`border-red-200 hover:bg-red-50 text-red-600 dark:border-red-700 dark:hover:bg-red-950/50 dark:text-red-400 transition-all duration-200 ${isMobile ? 'w-full' : ''}`}
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
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search transactions by description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400 transition-all duration-200"
                />
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className={`grid gap-4 pt-4 border-t border-gray-100 ${
                  isMobile 
                    ? 'grid-cols-1 sm:grid-cols-2' 
                    : 'grid-cols-1 md:grid-cols-6'
                }`}>
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

                {/* Enhanced Category Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</Label>
                  <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="h-10 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400 transition-all duration-200">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent className="w-[280px] max-h-[300px] border-0 shadow-2xl rounded-xl">
                      {/* Header */}
                      <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-200 dark:from-slate-800 dark:to-blue-900/20">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-3 h-3 text-white" />
                          </div>
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Category</div>
                        </div>
                      </div>
                      
                      {/* Categories List */}
                      <div className="max-h-[200px] overflow-y-auto p-2">
                        <SelectItem value="" className="py-2 px-3 hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center">
                              <X className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">All categories</span>
                          </div>
                        </SelectItem>
                        
                        {categories.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id} 
                            className="py-2 px-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-xs font-medium shadow-sm"
                                style={{ backgroundColor: category.color }}
                              >
                                {category.icon.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter - From */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:hover:border-blue-600 dark:focus:border-blue-400 transition-all duration-200",
                          !filters.dateRange.from && "text-slate-500 dark:text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? format(filters.dateRange.from, "MMM dd") : <span>From</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-2xl rounded-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => setFilters(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, from: date }
                        }))}
                        initialFocus
                        className="rounded-xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date Range Filter - To */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:hover:border-blue-600 dark:focus:border-blue-400 transition-all duration-200",
                          !filters.dateRange.to && "text-slate-500 dark:text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? format(filters.dateRange.to, "MMM dd") : <span>To</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-2xl rounded-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => setFilters(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, to: date }
                        }))}
                        initialFocus
                        className="rounded-xl"
                      />
                    </PopoverContent>
                  </Popover>
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
                                          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Receipt className="w-12 h-12 text-white" />
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
                        className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                      </Button>
                    </div>
                  ) : (
                    // No Results State
                    <div className="max-w-md mx-auto">
                                          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Search className="w-12 h-12 text-white" />
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
                    <div key={transaction.id} className={`group flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} p-4 bg-card/70 rounded-xl border border-border hover:bg-card hover:shadow-md transition-all duration-200`}>
                      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-4'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.amount >= 0 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.amount >= 0 ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : (
                            <TrendingDown className="w-5 h-5" />
                          )}
                        </div>
                        <div className={`${isMobile ? 'text-center' : ''}`}>
                          <p className="font-semibold text-foreground">{transaction.description}</p>
                          <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'items-center space-x-2'} text-sm text-muted-foreground`}>
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                            </span>
                            {!isMobile && <span>•</span>}
                            <Badge variant="secondary" className="text-xs font-medium">
                              {transaction.categories?.name || 'Uncategorized'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex ${isMobile ? 'flex-col space-y-3 items-center' : 'items-center space-x-3'}`}>
                        <div className={`text-right ${isMobile ? 'text-center' : ''}`}>
                          <p className={`font-bold text-lg ${
                            transaction.amount >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        
                        <div className={`flex items-center space-x-1 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
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
          <DialogContent className={`${isMobile ? 'w-[95vw] max-w-none mx-2' : 'sm:max-w-[480px]'} p-0 border-0 shadow-2xl rounded-2xl overflow-hidden`}>
            {/* Enhanced Header with Gradient */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-4 sm:p-6 text-white">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  {editingTransaction ? (
                    <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  ) : (
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                    {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
                  </DialogTitle>
                  <p className="text-blue-100 text-xs sm:text-sm mt-1">
                    {editingTransaction ? 'Update your transaction details' : 'Record your income or expense'}
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
                className="absolute top-3 right-3 sm:top-4 sm:right-4 h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Enhanced Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Transaction Type</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={formData.type === 'income' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                      className={`flex-1 h-12 transition-all duration-200 ${
                        formData.type === 'income' 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg' 
                          : 'border-2 border-slate-200 hover:border-green-300 hover:bg-green-50 dark:border-slate-700 dark:hover:border-green-600 dark:hover:bg-green-950/20'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Income
                    </Button>
                    <Button
                      type="button"
                      variant={formData.type === 'expense' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                      className={`flex-1 h-12 transition-all duration-200 ${
                        formData.type === 'expense' 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg' 
                          : 'border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 dark:border-slate-700 dark:hover:border-red-600 dark:hover:bg-red-950/20'
                      }`}
                    >
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Expense
                    </Button>
                  </div>
                </div>

                {/* Transaction Name Input */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name <span className="text-slate-500 dark:text-slate-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    placeholder="e.g., Grocery shopping, Salary, Coffee"
                    value={formData.transaction_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, transaction_name: e.target.value }))}
                    className="h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400 transition-all duration-200"
                  />
                </div>

                {/* Amount Input */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">
                      {preferences.currency_symbol}
                    </div>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="pl-8 h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Enhanced Category Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => {
                    if (value === 'create-new') {
                      setShowCategoryDialog(true);
                    } else {
                      setFormData(prev => ({ ...prev, category_id: value }));
                    }
                  }}>
                    <SelectTrigger className="h-12 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400 transition-all duration-200">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent className="w-[360px] max-h-[400px] border-0 shadow-2xl rounded-xl">
                      {/* Enhanced Header */}
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-blue-900/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">Categories</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Select or create a new one</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Search Bar */}
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Search categories..."
                            className="pl-9 h-10 text-sm border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400 transition-all duration-200"
                            value={categorySearchTerm}
                            onChange={(e) => setCategorySearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {/* Categories List */}
                      <div className="max-h-[280px] overflow-y-auto">
                        {filteredCategories.length === 0 ? (
                          <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Search className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                              {categorySearchTerm ? 'No categories found' : 'No categories available'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              {categorySearchTerm ? 'Try a different search term' : 'Create your first category'}
                            </p>
                          </div>
                        ) : (
                          <div className="p-2 space-y-1">
                            {filteredCategories.map((category) => (
                              <SelectItem 
                                key={category.id} 
                                value={category.id} 
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                              >
                                <div 
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm"
                                  style={{ backgroundColor: category.color }}
                                >
                                  {category.icon.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-slate-700 dark:text-slate-300">{category.name}</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">Category</div>
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Create New Category Option */}
                      <div className="border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20">
                        <SelectItem 
                          value="create-new" 
                          className="flex items-center gap-3 p-4 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Plus className="h-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-blue-700 dark:text-blue-300">Create New Category</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">Add a custom category</div>
                          </div>
                        </SelectItem>
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Date Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:hover:border-blue-600 dark:focus:border-blue-400 transition-all duration-200",
                          !formData.transaction_date && "text-slate-500 dark:text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.transaction_date ? format(formData.transaction_date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-2xl rounded-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.transaction_date}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, transaction_date: date }))}
                        initialFocus
                        className="rounded-xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Enhanced Form Actions */}
                <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-4 sm:p-6">
                  <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'justify-end gap-3'}`}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                      className={`px-6 py-2 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-200 ${isMobile ? 'w-full' : ''}`}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!formData.amount}
                      className={`px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 ${isMobile ? 'w-full' : ''}`}
                    >
                      {editingTransaction ? 'Update' : 'Add'} Transaction
                    </Button>
                  </div>
                </div>
              </form>
          </DialogContent>
        </Dialog>

        {/* Create Category Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent className={`${isMobile ? 'w-[95vw] max-w-none mx-2' : 'sm:max-w-[420px]'} max-h-[75vh] overflow-hidden p-0 border-0 shadow-2xl`}>
            {/* Modern Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-4 sm:p-6 text-white">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-lg sm:text-xl font-semibold text-white">Create Category</DialogTitle>
                  <p className="text-white/80 text-xs sm:text-sm mt-1">Add a custom category for your transactions</p>
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
                className="absolute top-3 right-3 sm:top-4 sm:right-4 h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col h-[calc(75vh-120px)]">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateCategory(); }} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
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
                  <div className={`grid gap-3 ${
                    isMobile ? 'grid-cols-6' : 'grid-cols-8'
                  }`}>
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
                        <div className={`grid gap-2 ${
                          isMobile ? 'grid-cols-3' : 'grid-cols-4'
                        }`}>
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
              <div className="border-t bg-muted/20 p-4 sm:p-6">
                <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'justify-end gap-3'}`}>
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
                    className={`px-6 py-2 ${isMobile ? 'w-full' : ''}`}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    onClick={handleCreateCategory}
                    className={`px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 ${isMobile ? 'w-full' : ''}`}
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
