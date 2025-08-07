import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface ReportData {
  period: string;
  income: number;
  expenses: number;
  savings: number;
  topCategories: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

const Reports = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("last-12-months");
  const [loadingReport, setLoadingReport] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/login");
        } else if (session) {
          setLoading(false);
          fetchReportData();
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
        fetchReportData();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchReportData = async () => {
    setLoadingReport(true);
    try {
      // Mock report data - replace with actual API calls
      const mockReportData: ReportData = {
        period: "Last 12 Months",
        income: 125000,
        expenses: 98750,
        savings: 26250,
        topCategories: [
          { name: "Food & Dining", amount: 15600, percentage: 15.8 },
          { name: "Transportation", amount: 12400, percentage: 12.6 },
          { name: "Housing", amount: 36000, percentage: 36.5 },
          { name: "Entertainment", amount: 8400, percentage: 8.5 },
          { name: "Healthcare", amount: 7200, percentage: 7.3 }
        ],
        monthlyTrend: [
          { month: "Jan", income: 10500, expenses: 8200 },
          { month: "Feb", income: 10200, expenses: 7900 },
          { month: "Mar", income: 10800, expenses: 8300 },
          { month: "Apr", income: 10400, expenses: 8100 },
          { month: "May", income: 10600, expenses: 8200 },
          { month: "Jun", income: 10300, expenses: 8000 },
          { month: "Jul", income: 10700, expenses: 8400 },
          { month: "Aug", income: 10500, expenses: 8200 },
          { month: "Sep", income: 10900, expenses: 8500 },
          { month: "Oct", income: 10400, expenses: 8100 },
          { month: "Nov", income: 10600, expenses: 8300 },
          { month: "Dec", income: 10800, expenses: 8400 }
        ]
      };

      setReportData(mockReportData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive",
      });
    } finally {
      setLoadingReport(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getSavingsRate = (income: number, expenses: number) => {
    return ((income - expenses) / income) * 100;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="space-y-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Financial Reports
                </h1>
                <p className="text-muted-foreground mt-1 font-body">
                  Comprehensive analysis of your financial performance
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={fetchReportData}
                  disabled={loadingReport}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingReport ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {reportData ? (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                          <p className="text-2xl font-bold">{formatCurrency(reportData.income)}</p>
                          <p className="text-xs text-green-600">+8.5% vs last period</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                          <p className="text-2xl font-bold">{formatCurrency(reportData.expenses)}</p>
                          <p className="text-xs text-red-600">+5.2% vs last period</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Net Savings</p>
                          <p className="text-2xl font-bold">{formatCurrency(reportData.savings)}</p>
                          <p className="text-xs text-blue-600">+12.3% vs last period</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
                          <p className="text-2xl font-bold">{formatPercentage(getSavingsRate(reportData.income, reportData.expenses))}</p>
                          <p className="text-xs text-purple-600">+2.1% vs last period</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Spending Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center space-x-2">
                      <PieChart className="w-5 h-5" />
                      <span>Top Spending Categories</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.topCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-muted-foreground">{formatPercentage(category.percentage)} of total</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatCurrency(category.amount)}</p>
                            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${category.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trends Tab */}
              <TabsContent value="trends" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center space-x-2">
                      <LineChart className="w-5 h-5" />
                      <span>Monthly Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Income vs Expenses Chart */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Income vs Expenses</h4>
                        <div className="grid grid-cols-12 gap-2 h-64 items-end">
                          {reportData.monthlyTrend.map((month, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2">
                              <div className="flex flex-col items-center space-y-1 w-full">
                                <div 
                                  className="w-full bg-green-500 rounded-t"
                                  style={{ height: `${(month.income / 12000) * 100}%` }}
                                ></div>
                                <div 
                                  className="w-full bg-red-500 rounded-t"
                                  style={{ height: `${(month.expenses / 12000) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-muted-foreground">{month.month}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span className="text-sm">Income</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span className="text-sm">Expenses</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Monthly Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Average Monthly Income</p>
                          <p className="text-xl font-bold">{formatCurrency(reportData.income / 12)}</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Average Monthly Expenses</p>
                          <p className="text-xl font-bold">{formatCurrency(reportData.expenses / 12)}</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Average Monthly Savings</p>
                          <p className="text-xl font-bold">{formatCurrency(reportData.savings / 12)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center space-x-2">
                      <PieChart className="w-5 h-5" />
                      <span>Category Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reportData.topCategories.map((category, index) => (
                        <div key={index} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">{index + 1}</span>
                              </div>
                              <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-muted-foreground">{formatPercentage(category.percentage)} of total expenses</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">{formatCurrency(category.amount)}</p>
                              <p className="text-sm text-muted-foreground">Total spent</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Monthly Average</span>
                              <span className="font-medium">{formatCurrency(category.amount / 12)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Daily Average</span>
                              <span className="font-medium">{formatCurrency(category.amount / 365)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${category.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Detailed Tab */}
              <TabsContent value="detailed" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Detailed Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Financial Health Score */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 border rounded-lg">
                          <h4 className="font-medium mb-4">Financial Health Score</h4>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">85</div>
                            <p className="text-sm text-muted-foreground">Excellent</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 border rounded-lg">
                          <h4 className="font-medium mb-4">Budget Adherence</h4>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">92%</div>
                            <p className="text-sm text-muted-foreground">On Track</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Key Insights */}
                      <div>
                        <h4 className="font-medium mb-4">Key Insights</h4>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-green-800">Strong Savings Rate</p>
                              <p className="text-sm text-green-700">Your savings rate of 21% is above the recommended 20%.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                            <Eye className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-yellow-800">Housing Costs High</p>
                              <p className="text-sm text-yellow-700">Housing represents 36.5% of your expenses, consider if this can be optimized.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-800">Consistent Income</p>
                              <p className="text-sm text-blue-700">Your income has been stable with only 5% variance month-over-month.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Report Data Available</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your transactions to generate comprehensive reports.
                </p>
                <Button onClick={() => navigate('/transactions')}>
                  Add Transactions
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports; 