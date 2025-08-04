import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import AddTransactionDialog from "@/components/dashboard/AddTransactionDialog";
import EnhancedTransactionsTable from "@/components/dashboard/EnhancedTransactionsTable";
import { 
  LayoutDashboard, 
  DollarSign, 
  Wallet, 
  Calendar, 
  Target, 
  BarChart3, 
  User as UserIcon, 
  Bell, 
  Search,
  TrendingUp,
  TrendingDown,
  Plus
} from "lucide-react";

// Dashboard component with modern design
interface SummaryData {
  income: number;
  expenses: number;
  savings: number;
  totalBalance: number;
  incomeChange: number;
  expensesChange: number;
  savingsChange: number;
}

interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  budgeted: number;
  percentage: number;
  icon: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/login");
      } else if (session) {
        setLoading(false);
        fetchDashboardData();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/login");
      } else {
        setLoading(false);
        fetchDashboardData();
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch summary data with category_id
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, transaction_date, category_id')
        .eq('user_id', user.id);

      const { data: categories } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('user_id', user.id);

      // Calculate summary
      const income = transactions?.filter(t => Number(t.amount) > 0).reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const expenses = Math.abs(transactions?.filter(t => Number(t.amount) < 0).reduce((sum, t) => sum + Number(t.amount), 0) || 0);
      const totalBalance = income - expenses;
      const savings = totalBalance * 0.2; // Mock savings calculation

      setSummaryData({
        income,
        expenses,
        savings,
        totalBalance,
        incomeChange: 20,
        expensesChange: -5,
        savingsChange: 8
      });

      // Process budget categories
      const budgetData: BudgetCategory[] = categories?.map(cat => {
        const categoryTransactions = transactions?.filter(t => t.category_id === cat.id) || [];
        const spent = Math.abs(categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0));
        const percentage = cat.budgeted_amount > 0 ? (spent / Number(cat.budgeted_amount)) * 100 : 0;
        
        return {
          id: cat.id,
          name: cat.name,
          spent,
          budgeted: Number(cat.budgeted_amount),
          percentage: Math.min(percentage, 100),
          icon: getIconForCategory(cat.name)
        };
      }) || [];

      setBudgetCategories(budgetData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getIconForCategory = (name: string): string => {
    const categoryIcons: Record<string, string> = {
      'house': '🏠',
      'health': '💚',
      'clothes': '👕',
      'products': '📦',
      'restaurant': '🍽️',
      'games': '🎮'
    };
    return categoryIcons[name.toLowerCase()] || '📁';
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
    fetchDashboardData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Dark Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo and Brand */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-white font-bold text-lg">BUDGET BOOST</span>
          </div>
        </div>

        {/* Total Balance Circle */}
        <div className="p-6 flex justify-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={351.86}
                strokeDashoffset={87.97}
                className="text-lime-400"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="text-xs text-slate-400">TOTAL BALANCE</div>
              <div className="text-xl font-bold">{formatCurrency(summaryData?.totalBalance || 15540)}</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-2">
          <div className="space-y-1">
            <div className="flex items-center px-3 py-2 bg-lime-400 text-slate-900 rounded-lg font-medium">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </div>
            <div className="flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">
              <DollarSign className="w-5 h-5 mr-3" />
              Budget
            </div>
            <div className="flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">
              <Wallet className="w-5 h-5 mr-3" />
              Wallet
            </div>
            <div className="flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">
              <Calendar className="w-5 h-5 mr-3" />
              Calendar
            </div>
            <div className="flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">
              <Target className="w-5 h-5 mr-3" />
              Goals
            </div>
            <div className="flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">
              <BarChart3 className="w-5 h-5 mr-3" />
              Statistics
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">
            <UserIcon className="w-5 h-5 mr-3" />
            Profile
          </div>
          <div className="flex items-center px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">
            <Bell className="w-5 h-5 mr-3" />
            Notifications
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-slate-900 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search"
                  className="pl-10 bg-slate-800 border-slate-600 text-white w-64"
                />
              </div>
              <Button onClick={() => setShowAddDialog(true)} className="bg-lime-400 text-slate-900 hover:bg-lime-500">
                Add transaction
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 bg-slate-50">
          {/* Top Row - Summary Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Income Card */}
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-300 text-sm">Income</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-2xl font-bold">
                        {formatCurrency(summaryData?.income || 1405.20)}
                      </span>
                      <span className="text-xs text-slate-400">This month</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">+{summaryData?.incomeChange || 20}%</span>
                </div>
                {/* Mini sparkline placeholder */}
                <div className="mt-4 h-8 bg-slate-600 rounded opacity-50"></div>
              </CardContent>
            </Card>

            {/* Expenses Card */}
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-300 text-sm">Expenses</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-2xl font-bold">
                        {formatCurrency(summaryData?.expenses || 700.20)}
                      </span>
                      <span className="text-xs text-slate-400">This month</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">{summaryData?.expensesChange || -5}%</span>
                </div>
                {/* Mini sparkline placeholder */}
                <div className="mt-4 h-8 bg-slate-600 rounded opacity-50"></div>
              </CardContent>
            </Card>

            {/* Total Savings Card */}
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-300 text-sm">Total savings</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-2xl font-bold">
                        {formatCurrency(summaryData?.savings || 1200.20)}
                      </span>
                      <span className="text-xs text-slate-400">This month</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">+{summaryData?.savingsChange || 8}%</span>
                </div>
                {/* Mini sparkline placeholder */}
                <div className="mt-4 h-8 bg-slate-600 rounded opacity-50"></div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Goals Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Goals
                  <span className="text-sm text-slate-500">...</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      ⌚
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Apple watch</span>
                        <span className="text-sm text-slate-500">$600/$650</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">Started 24June/2023</p>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Budget Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Monthly budget
                  <span className="text-sm text-slate-500">$1200/$1700</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {budgetCategories.slice(0, 6).map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm font-medium capitalize">{category.name}</span>
                        </div>
                        <span className="text-xs text-slate-500">{Math.round(category.percentage)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>{formatCurrency(category.spent)}</span>
                        <span className="text-slate-500">{formatCurrency(category.budgeted)}</span>
                      </div>
                      <Progress value={category.percentage} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Transactions
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-xs">All</Button>
                  <Button variant="ghost" size="sm" className="text-xs text-slate-500">Expenses</Button>
                  <Button variant="ghost" size="sm" className="text-xs text-slate-500">Income</Button>
                  <span className="text-sm text-slate-500 ml-4">View all</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedTransactionsTable 
                dateRange={{
                  from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                  to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
                }}
                key={`transactions-${refreshKey}`} 
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <AddTransactionDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onSuccess={handleTransactionAdded} 
      />
    </div>
  );
};
export default Dashboard;