import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658'];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/signup");
      return;
    }
    
    setUser(session.user);
    await fetchReportData();
    setLoading(false);
  };

  const fetchReportData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get last 6 months data
      const monthsData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const { data: transactions } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .gte('transaction_date', startOfMonth.toISOString().split('T')[0])
          .lte('transaction_date', endOfMonth.toISOString().split('T')[0]);

        const totalSpent = Math.abs(
          transactions?.reduce((sum, txn) => sum + (Number(txn.amount) < 0 ? Number(txn.amount) : 0), 0) || 0
        );

        monthsData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          amount: totalSpent
        });
      }

      // Get current month category breakdown
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { data: categoryTransactions } = await supabase
        .from('transactions')
        .select(`
          amount,
          budget_categories(name)
        `)
        .eq('user_id', user.id)
        .gte('transaction_date', startOfMonth.toISOString().split('T')[0])
        .lte('transaction_date', endOfMonth.toISOString().split('T')[0])
        .lt('amount', 0);

      const categoryTotals: { [key: string]: number } = {};
      categoryTransactions?.forEach(txn => {
        const categoryName = txn.budget_categories?.name || 'Uncategorized';
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Math.abs(Number(txn.amount));
      });

      const categoriesData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value
      }));

      setMonthlyData(monthsData);
      setCategoryData(categoriesData);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your reports...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground font-heading">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your spending patterns and budget performance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Monthly Spending Chart */}
          <Card className="col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-heading">Monthly Spending Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spent']}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-heading">Category Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">Current month expenses by category</p>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spent']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No spending data for this month
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">Highest Spending Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {monthlyData.length > 0 
                  ? monthlyData.reduce((max, month) => month.amount > max.amount ? month : max).month
                  : 'N/A'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Last 6 months
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">Average Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${monthlyData.length > 0 
                  ? Math.round(monthlyData.reduce((sum, month) => sum + month.amount, 0) / monthlyData.length)
                  : 0
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Last 6 months
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {categoryData.length > 0 
                  ? categoryData.reduce((max, cat) => cat.value > max.value ? cat : max).name
                  : 'N/A'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;