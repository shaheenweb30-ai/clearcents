import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import ClearCentsNavigation from "@/components/ClearCentsNavigation";
import BudgetCategories from "@/components/dashboard/BudgetCategories";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, AlertTriangle } from "lucide-react";

const Budgets = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
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
          <p className="text-muted-foreground">Loading budgets...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock data for demonstration
  const totalBudget = 3000;
  const totalSpent = 2150;
  const budgetProgress = (totalSpent / totalBudget) * 100;
  const remainingDays = 12;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <ClearCentsNavigation user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                Budgets
              </h1>
              <p className="text-muted-foreground mt-1 font-body">
                Track your spending against your monthly budget
              </p>
            </div>
            <Button className="w-fit">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Overall Budget Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading flex items-center justify-between">
              Monthly Budget Overview
              <span className="text-sm font-normal text-muted-foreground">
                {remainingDays} days left
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              {/* Circular Progress */}
              <div className="flex items-center space-x-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke={budgetProgress > 80 ? "hsl(var(--destructive))" : budgetProgress > 50 ? "hsl(var(--accent))" : "hsl(var(--secondary))"}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${budgetProgress * 3.39} 339`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.round(budgetProgress)}%</div>
                      <div className="text-xs text-muted-foreground">spent</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    ${totalSpent.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of ${totalBudget.toLocaleString()} budget
                  </div>
                  <div className="text-sm">
                    ${(totalBudget - totalSpent).toLocaleString()} remaining
                  </div>
                </div>
              </div>

              {/* Budget Status */}
              <div className="flex flex-col space-y-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Budget Status</div>
                  {budgetProgress > 80 ? (
                    <div className="flex items-center justify-center space-x-2 text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Over Budget Risk</span>
                    </div>
                  ) : budgetProgress > 50 ? (
                    <div className="text-accent font-medium">On Track</div>
                  ) : (
                    <div className="text-secondary font-medium">Excellent</div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Daily Average</div>
                  <div className="font-medium">
                    ${(totalSpent / (30 - remainingDays)).toFixed(2)}/day
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <BudgetCategories />
      </main>
    </div>
  );
};

export default Budgets;