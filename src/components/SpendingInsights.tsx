import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  Target, 
  AlertTriangle,
  DollarSign,
  Calendar,
  BarChart3
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface SpendingInsight {
  id: string;
  type: 'tip' | 'warning' | 'achievement';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  amount?: number;
  percentage?: number;
}

interface SpendingAnalysis {
  totalSpent: number;
  averageDaily: number;
  topCategories: Array<{ name: string; amount: number; percentage: number }>;
  recentTrend: 'increasing' | 'decreasing' | 'stable';
  monthlyComparison: number;
  potentialSavings: number;
  insights: SpendingInsight[];
}

interface SpendingInsightsProps {
  userId: string;
  transactions: any[];
}

export const SpendingInsights = ({ userId, transactions }: SpendingInsightsProps) => {
  const [analysis, setAnalysis] = useState<SpendingAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (transactions.length > 0) {
      analyzeSpending(transactions);
    }
  }, [transactions]);

  const analyzeSpending = (transactions: any[]) => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    // Filter transactions for analysis
    const recentTransactions = transactions.filter(t => 
      new Date(t.transaction_date) >= thirtyDaysAgo && t.amount < 0
    );
    const previousTransactions = transactions.filter(t => 
      new Date(t.transaction_date) >= sixtyDaysAgo && 
      new Date(t.transaction_date) < thirtyDaysAgo && 
      t.amount < 0
    );

    // Calculate basic metrics
    const totalSpent = Math.abs(recentTransactions.reduce((sum, t) => sum + t.amount, 0));
    const averageDaily = totalSpent / 30;
    const previousTotal = Math.abs(previousTransactions.reduce((sum, t) => sum + t.amount, 0));
    const monthlyComparison = ((totalSpent - previousTotal) / previousTotal) * 100;

    // Analyze categories
    const categorySpending: { [key: string]: number } = {};
    recentTransactions.forEach(t => {
      const categoryName = t.categories?.name || 'Uncategorized';
      categorySpending[categoryName] = (categorySpending[categoryName] || 0) + Math.abs(t.amount);
    });

    const topCategories = Object.entries(categorySpending)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: (amount / totalSpent) * 100
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Determine trend
    const recentTrend = monthlyComparison > 5 ? 'increasing' : 
                       monthlyComparison < -5 ? 'decreasing' : 'stable';

    // Generate insights
    const insights = generateInsights(recentTransactions, topCategories, totalSpent, averageDaily, monthlyComparison);

    // Calculate potential savings
    const potentialSavings = calculatePotentialSavings(insights, totalSpent);

    setAnalysis({
      totalSpent,
      averageDaily,
      topCategories,
      recentTrend,
      monthlyComparison,
      potentialSavings,
      insights
    });
    setLoading(false);
  };

  const generateInsights = (
    transactions: any[], 
    topCategories: any[], 
    totalSpent: number, 
    averageDaily: number, 
    monthlyComparison: number
  ): SpendingInsight[] => {
    const insights: SpendingInsight[] = [];

    // High spending category insights
    topCategories.forEach(category => {
      if (category.percentage > 30) {
        insights.push({
          id: `high-category-${category.name}`,
          type: 'warning',
          title: `High Spending in ${category.name}`,
          description: `${category.name} accounts for ${category.percentage.toFixed(1)}% of your spending. Consider setting a budget limit.`,
          action: `Set a monthly budget for ${category.name}`,
          priority: 'high',
          category: category.name,
          amount: category.amount,
          percentage: category.percentage
        });
      }
    });

    // Daily spending insights
    if (averageDaily > 50) {
      insights.push({
        id: 'high-daily-spending',
        type: 'warning',
        title: 'High Daily Spending',
        description: `You're spending an average of $${averageDaily.toFixed(2)} per day. This could impact your savings goals.`,
        action: 'Review daily expenses and identify non-essential purchases',
        priority: 'high',
        amount: averageDaily
      });
    }

    // Trend insights
    if (monthlyComparison > 10) {
      insights.push({
        id: 'increasing-spending',
        type: 'warning',
        title: 'Spending Increasing',
        description: `Your spending has increased by ${Math.abs(monthlyComparison).toFixed(1)}% compared to last month.`,
        action: 'Review recent purchases and identify spending patterns',
        priority: 'medium'
      });
    } else if (monthlyComparison < -10) {
      insights.push({
        id: 'decreasing-spending',
        type: 'achievement',
        title: 'Great Progress!',
        description: `Your spending has decreased by ${Math.abs(monthlyComparison).toFixed(1)}% compared to last month.`,
        action: 'Keep up the good work!',
        priority: 'low'
      });
    }

    // Budget optimization insights
    if (topCategories.length > 0) {
      const largestCategory = topCategories[0];
      if (largestCategory.percentage > 40) {
        insights.push({
          id: 'category-diversification',
          type: 'tip',
          title: 'Consider Diversifying Spending',
          description: `${largestCategory.name} dominates your spending. Consider spreading expenses across more categories.`,
          action: 'Explore other categories for better budget distribution',
          priority: 'medium',
          category: largestCategory.name,
          percentage: largestCategory.percentage
        });
      }
    }

    // Savings opportunity insights
    const smallTransactions = transactions.filter(t => Math.abs(t.amount) < 10);
    if (smallTransactions.length > 20) {
      const smallTotal = Math.abs(smallTransactions.reduce((sum, t) => sum + t.amount, 0));
      insights.push({
        id: 'small-transactions',
        type: 'tip',
        title: 'Small Purchases Add Up',
        description: `You have ${smallTransactions.length} small purchases totaling $${smallTotal.toFixed(2)}. These add up quickly!`,
        action: 'Track small purchases and consider reducing impulse buys',
        priority: 'medium',
        amount: smallTotal
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const calculatePotentialSavings = (insights: SpendingInsight[], totalSpent: number): number => {
    let potentialSavings = 0;

    insights.forEach(insight => {
      if (insight.type === 'warning' && insight.amount) {
        // Estimate 20% savings on high-spending categories
        if (insight.category && insight.percentage && insight.percentage > 30) {
          potentialSavings += (insight.amount * 0.2);
        }
        // Estimate 15% savings on high daily spending
        if (insight.title.includes('High Daily Spending')) {
          potentialSavings += (insight.amount * 30 * 0.15);
        }
      }
    });

    return Math.min(potentialSavings, totalSpent * 0.3); // Cap at 30% of total spending
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'achievement':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleInsightAction = (insight: SpendingInsight) => {
    if (insight.action.includes('Set a monthly budget for') && insight.category) {
      // Navigate to budget page with category info
      navigate('/budget', { 
        state: { 
          selectedCategory: insight.category,
          action: 'set-budget'
        }
      });
    } else if (insight.action.includes('Review daily expenses')) {
      navigate('/transactions');
    } else if (insight.action.includes('Review recent purchases')) {
      navigate('/transactions');
    } else if (insight.action.includes('Explore other categories')) {
      navigate('/categories');
    } else if (insight.action.includes('Track small purchases')) {
      navigate('/transactions');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyzing your spending patterns...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Add some transactions to get personalized spending insights.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent (30 days)</p>
                <p className="text-2xl font-bold">${analysis.totalSpent.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Average</p>
                <p className="text-2xl font-bold">${analysis.averageDaily.toFixed(2)}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Change</p>
                <p className={`text-2xl font-bold ${analysis.monthlyComparison > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.monthlyComparison > 0 ? '+' : ''}{analysis.monthlyComparison.toFixed(1)}%
                </p>
              </div>
              {analysis.recentTrend === 'increasing' ? (
                <TrendingUp className="h-8 w-8 text-red-500" />
              ) : analysis.recentTrend === 'decreasing' ? (
                <TrendingDown className="h-8 w-8 text-green-500" />
              ) : (
                <BarChart3 className="h-8 w-8 text-blue-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold text-green-600">${analysis.potentialSavings.toFixed(2)}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${category.amount.toFixed(2)}</p>
                  <Progress value={category.percentage} className="w-24 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Personalized Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.insights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleInsightAction(insight)}
                      >
                        {insight.action}
                      </Button>
                      {insight.amount && (
                        <span className="text-sm text-muted-foreground">
                          ${insight.amount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 