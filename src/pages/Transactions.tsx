import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Edit, Trash2, Filter, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown, DollarSign, BarChart3, Target, X, CalendarDays, Tag, FileText, CreditCard } from "lucide-react";
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useCategories, Category } from "@/hooks/useCategories";

interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  description?: string;
  amount: number;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}



const Transactions = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  // Filters
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [amountRange, setAmountRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all');
  
  // Sorting
  const [sortField, setSortField] = useState<'date' | 'amount' | 'category'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  
  // Filter side panel
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    date: new Date(),
    category_id: '',
    description: '',
    amount: '',
    type: 'expense' as 'expense' | 'income'
  });





  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories(user?.id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/login");
        } else if (session) {
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [transactions, dateRange, selectedCategory, amountRange, transactionType, sortField, sortDirection]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      console.log('Fetching transactions for user:', user.id);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      
      console.log('Fetched transactions:', data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: `Failed to load transactions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };



  const applyFilters = () => {
    let filtered = [...transactions];
    console.log('Applying filters to', transactions.length, 'transactions');

    // Date range filter
    if (dateRange?.from && dateRange?.to) {
      const beforeDateFilter = filtered.length;
      filtered = filtered.filter(transaction => {
        const transactionDate = parseISO(transaction.transaction_date);
        return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      });
      console.log('After date filter:', filtered.length, 'transactions (was', beforeDateFilter, ')');
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const beforeCategoryFilter = filtered.length;
      filtered = filtered.filter(transaction => transaction.categories?.name === selectedCategory);
      console.log('After category filter:', filtered.length, 'transactions (was', beforeCategoryFilter, ')');
    }

    // Amount range filter
    const beforeAmountFilter = filtered.length;
    filtered = filtered.filter(transaction => {
      const amount = Math.abs(transaction.amount);
      return amount >= amountRange.min && amount <= amountRange.max;
    });
    console.log('After amount filter:', filtered.length, 'transactions (was', beforeAmountFilter, ')');

    // Transaction type filter
    if (transactionType !== 'all') {
      const beforeTypeFilter = filtered.length;
      filtered = filtered.filter(transaction => {
        if (transactionType === 'income') {
          return transaction.amount > 0;
        } else if (transactionType === 'expense') {
          return transaction.amount < 0;
        }
        return true;
      });
      console.log('After type filter:', filtered.length, 'transactions (was', beforeTypeFilter, ')');
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'date':
          aValue = new Date(a.transaction_date);
          bValue = new Date(b.transaction_date);
          break;
        case 'amount':
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case 'category':
          aValue = a.categories?.name || '';
          bValue = b.categories?.name || '';
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    console.log('Final filtered transactions:', filtered.length);
    setFilteredTransactions(filtered);
  };

  const handleSort = (field: 'date' | 'amount' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: 'date' | 'amount' | 'category') => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleAddTransaction = async () => {
    if (!user) return;

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

    if (!formData.type) {
      toast({
        title: "Error",
        description: "Please select a transaction type",
        variant: "destructive",
      });
      return;
    }

    try {
      // Determine amount sign based on transaction type
      const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
      
      console.log('Adding transaction with data:', {
        user_id: user.id,
        amount: finalAmount,
        type: formData.type,
        category_id: formData.category_id,
        description: formData.description,
        transaction_date: format(formData.date, 'yyyy-MM-dd')
      });

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: finalAmount,
          category_id: formData.category_id,
          description: formData.description,
          transaction_date: format(formData.date, 'yyyy-MM-dd')
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Transaction added successfully:', data);

      toast({
        title: "Success",
        description: `${formData.type === 'income' ? 'Income' : 'Expense'} transaction added successfully`,
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: `Failed to add transaction: ${error instanceof Error ? error.message : 'Unknown error'}. Please try refreshing the page.`,
        variant: "destructive",
      });
    }
  };

  const handleEditTransaction = async () => {
    if (!editingTransaction) return;

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
      // Determine amount sign based on transaction type
      const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
      
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: finalAmount,
          category_id: formData.category_id,
          description: formData.description,
          transaction_date: format(formData.date, 'yyyy-MM-dd')
        })
        .eq('id', editingTransaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${formData.type === 'income' ? 'Income' : 'Expense'} transaction updated successfully`,
      });

      setIsEditDialogOpen(false);
      setEditingTransaction(null);
      resetForm();
      fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', deletingTransaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      setDeletingTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date(),
      category_id: '',
      description: '',
      amount: '',
      type: 'expense'
    });
  };

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: parseISO(transaction.transaction_date),
      category_id: transaction.category_id,
      description: transaction.description || '',
      amount: Math.abs(transaction.amount).toString(),
      type: transaction.amount < 0 ? 'expense' : 'income'
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const getQuickDateRange = (range: string) => {
    const now = new Date();
    switch (range) {
      case 'this-week':
        return { from: startOfWeek(now), to: endOfWeek(now) };
      case 'this-month':
        return { from: startOfMonth(now), to: endOfMonth(now) };
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      default:
        return dateRange;
    }
  };

  const clearAllFilters = () => {
    setDateRange(undefined);
    setSelectedCategory("all");
    setAmountRange({ min: 0, max: 1000000 });
    setTransactionType('all');
    setSortField('date');
    setSortDirection('desc');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    try {
      const totalTransactions = filteredTransactions.length;
      const totalIncome = filteredTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = filteredTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const netAmount = totalIncome - totalExpenses;
      
      // Get unique categories used
      const uniqueCategories = new Set(filteredTransactions.map(t => t.category_id)).size;
      
      // Get date range
      const dates = filteredTransactions.map(t => new Date(t.transaction_date));
      const minDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
      const maxDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;
      
      return {
        totalTransactions,
        totalIncome,
        totalExpenses,
        netAmount,
        uniqueCategories,
        dateRange: minDate && maxDate ? { min: minDate, max: maxDate } : null
      };
    } catch (error) {
      console.error('Error calculating summary stats:', error);
      return {
        totalTransactions: 0,
        totalIncome: 0,
        totalExpenses: 0,
        netAmount: 0,
        uniqueCategories: 0,
        dateRange: null
      };
    }
  }, [filteredTransactions]);

  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
          
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-1 sm:mb-2">
              Transactions
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage and track all your financial activities
            </p>
            {categories.length === 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>No categories available.</strong> Please create categories first to add transactions.
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto text-yellow-800 underline"
                    onClick={() => navigate('/categories')}
                  >
                    Go to Categories
                  </Button>
                </p>
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryStats.totalTransactions}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredTransactions.length === transactions.length ? 'All transactions' : 'Filtered results'}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summaryStats.totalIncome)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Positive transactions
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(summaryStats.totalExpenses)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Negative transactions
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${summaryStats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summaryStats.netAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Income minus expenses
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterPanelOpen(true)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(selectedCategory !== "all" || dateRange || transactionType !== "all") && (
                  <Badge variant="secondary" className="ml-1">
                    Active
                  </Badge>
                )}
              </Button>
              <span className="text-sm text-muted-foreground">Clear filters</span>
              {(selectedCategory !== "all" || dateRange || transactionType !== "all") && (
                <Button 
                  variant="ghost" 
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear filters
                </Button>
              )}
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()} disabled={categories.length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl">Add New Transaction</DialogTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        resetForm();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Transaction Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Transaction Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={formData.type === 'expense' ? 'default' : 'outline'}
                        className="h-12 flex items-center gap-2"
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                      >
                        <TrendingDown className="h-4 w-4" />
                        Expense
                      </Button>
                      <Button
                        type="button"
                        variant={formData.type === 'income' ? 'default' : 'outline'}
                        className="h-12 flex items-center gap-2"
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                      >
                        <TrendingUp className="h-4 w-4" />
                        Income
                      </Button>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Date</Label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={formData.date ? format(formData.date, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          if (!isNaN(date.getTime())) {
                            setFormData(prev => ({ ...prev, date }));
                          }
                        }}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Category</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length === 0 ? (
                          <div className="p-2">
                            <p className="text-sm text-muted-foreground mb-2">No categories available.</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => navigate('/categories')}
                            >
                              Create Categories
                            </Button>
                          </div>
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
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Description (Optional)</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="e.g., Dinner at Italian Bistro"
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Amount</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <Button 
                      onClick={handleAddTransaction}
                      className="w-full h-11"
                    >
                      Add Transaction
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter Side Panel */}
          {isFilterPanelOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsFilterPanelOpen(false)} />
              <div className="relative w-full sm:w-96 h-[80vh] sm:h-auto bg-white rounded-t-xl sm:rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
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
                  {/* Date Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Date Range</Label>
                    <Select
                      value="custom"
                      onValueChange={(value) => setDateRange(getQuickDateRange(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                    {dateRange && (
                      <div className="flex space-x-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs">
                              {format(dateRange.from, "MMM dd")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateRange.from}
                              onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                            />
                          </PopoverContent>
                        </Popover>
                        <span className="text-xs text-muted-foreground self-center">to</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs">
                              {format(dateRange.to, "MMM dd")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateRange.to}
                              onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.length === 0 ? (
                          <div className="p-2">
                            <p className="text-sm text-muted-foreground mb-2">No categories available.</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => navigate('/categories')}
                            >
                              Create Categories
                            </Button>
                          </div>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{category.icon}</span>
                                <span>{category.name}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Amount Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={amountRange.min}
                        onChange={(e) => setAmountRange({ ...amountRange, min: parseFloat(e.target.value) || 0 })}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={amountRange.max}
                        onChange={(e) => setAmountRange({ ...amountRange, max: parseFloat(e.target.value) || 10000 })}
                      />
                    </div>
                  </div>

                  {/* Transaction Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Type</Label>
                    <Select
                      value={transactionType}
                      onValueChange={(value: 'all' | 'income' | 'expense') => setTransactionType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="income">Income Only</SelectItem>
                        <SelectItem value="expense">Expenses Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200/50 bg-gray-50/50">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={clearAllFilters}
                      className="flex-1"
                    >
                      Clear All
                    </Button>
                    <Button 
                      onClick={() => {
                        applyFilters();
                        setIsFilterPanelOpen(false);
                      }}
                      className="flex-1"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Transactions ({filteredTransactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('date')}
                          className="h-auto p-0 font-medium"
                        >
                          Date {getSortIcon('date')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('category')}
                          className="h-auto p-0 font-medium"
                        >
                          Category {getSortIcon('category')}
                        </Button>
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('amount')}
                          className="h-auto p-0 font-medium"
                        >
                          Amount {getSortIcon('amount')}
                        </Button>
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No transactions found. Add your first transaction to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {format(parseISO(transaction.transaction_date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const category = transaction.categories;
                              return (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  {category?.icon && <span>{category.icon}</span>}
                                  {category?.name || 'Unknown Category'}
                                </Badge>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {transaction.description || '-'}
                          </TableCell>
                          <TableCell className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.amount >= 0 ? 'default' : 'destructive'}>
                              {transaction.amount >= 0 ? 'Income' : 'Expense'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(transaction)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(transaction)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Transaction Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Transaction</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    type="date"
                    value={formData.date ? format(formData.date, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (!isNaN(date.getTime())) {
                        setFormData(prev => ({ ...prev, date }));
                      }
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Transaction Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'expense' | 'income') => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <span>Expense</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="income">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Income</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description (Optional)</Label>
                  <Input
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Dinner at Italian Bistro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditTransaction}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Transaction</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p>Are you sure you want to delete this transaction?</p>
                {deletingTransaction && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="font-medium">{deletingTransaction.description || 'No description'}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(deletingTransaction.amount)} • {deletingTransaction.category}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteTransaction}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions; 