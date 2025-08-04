import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight } from "lucide-react";
import ProfileInfoCard from "@/components/profile/ProfileInfoCard";
import SubscriptionCard from "@/components/profile/SubscriptionCard";
import SecurityCard from "@/components/profile/SecurityCard";
import DangerZoneCard from "@/components/profile/DangerZoneCard";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
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

    // Check for existing session
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
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <span 
              className="hover:text-primary cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-foreground">My Profile</span>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account details, subscription, and preferences.
          </p>
        </div>

        {/* Profile Cards */}
        <div className="space-y-6">
          <ProfileInfoCard user={user} />
          <SubscriptionCard />
          <SecurityCard user={user} />
          <DangerZoneCard user={user} />
        </div>
      </main>
    </div>
  );
};

export default Profile;