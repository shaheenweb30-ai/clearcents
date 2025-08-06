import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Moon, 
  Sun, 
  Bell, 
  DollarSign, 
  Keyboard, 
  Shield, 
  Globe, 
  Database,
  Upload,
  Download,
  RotateCcw,
  Palette,
  Edit2,
  Save,
  X
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useOptimizedBrandingSettings } from "@/hooks/useOptimizedBrandingSettings";
import { SettingsLayout } from "@/components/SettingsLayout";

const SettingsWithTabs = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [authentication, setAuthentication] = useState(true);
  const [incomeTracking, setIncomeTracking] = useState(true);
  const [displayCents, setDisplayCents] = useState(true);
  const [upcomingLogs, setUpcomingLogs] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  
  // Profile state
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useUserRole(user);
  const { settings: brandingSettings } = useOptimizedBrandingSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'settings';

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

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-h1 font-heading font-book text-primary mb-2">
          Profile Settings
        </h1>
        <p className="text-body text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-h3 font-heading font-book text-foreground">
            Personal Information
          </CardTitle>
          {!editing ? (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">
                {getInitials(displayName, user.email || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {displayName || user.email?.split('@')[0]}
              </h3>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={!editing}
                placeholder="Enter your display name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={user.email || ""}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-h1 font-heading font-book text-primary mb-2">
          Settings
        </h1>
        <p className="text-body text-muted-foreground">
          Configure your application preferences and account settings.
        </p>
      </div>

      {/* User Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>User Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Settings */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode</Label>
              <div className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4 text-muted-foreground" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Moon className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <Separator />

          {/* Notification Settings */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive notifications for important updates
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <Separator />

          {/* Authentication Settings */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication</Label>
              <div className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </div>
            </div>
            <Switch
              checked={authentication}
              onCheckedChange={setAuthentication}
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Financial Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Income Tracking */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Income Tracking</Label>
              <div className="text-sm text-muted-foreground">
                Track your income sources and categories
              </div>
            </div>
            <Switch
              checked={incomeTracking}
              onCheckedChange={setIncomeTracking}
            />
          </div>

          <Separator />

          {/* Display Settings */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Display Cents</Label>
              <div className="text-sm text-muted-foreground">
                Show decimal places in currency amounts
              </div>
            </div>
            <Switch
              checked={displayCents}
              onCheckedChange={setDisplayCents}
            />
          </div>

          <Separator />

          {/* Upcoming Logs */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Upcoming Logs</Label>
              <div className="text-sm text-muted-foreground">
                Show upcoming transactions and reminders
              </div>
            </div>
            <Switch
              checked={upcomingLogs}
              onCheckedChange={setUpcomingLogs}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cloud Sync */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Cloud Sync</Label>
              <div className="text-sm text-muted-foreground">
                Sync your data across all devices
              </div>
            </div>
            <Switch
              checked={cloudSync}
              onCheckedChange={setCloudSync}
            />
          </div>

          <Separator />

          {/* Export/Import */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Data Export</Label>
              <div className="text-sm text-muted-foreground">
                Export your financial data
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin - Branding Management */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Website Administration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Branding */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Brand Management</Label>
                <div className="text-sm text-muted-foreground">
                  Manage business logo, name, and brand colors
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/admin/branding")}>
                Manage
              </Button>
            </div>

            <Separator />

            {/* Pages */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Page Management</Label>
                <div className="text-sm text-muted-foreground">
                  Create and manage dynamic pages
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/admin/pages")}>
                Manage
              </Button>
            </div>

            <Separator />

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Footer Management</Label>
                <div className="text-sm text-muted-foreground">
                  Manage footer links and social media
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/admin/footer")}>
                Manage
              </Button>
            </div>

            <Separator />

            {/* FAQ */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">FAQ Management</Label>
                <div className="text-sm text-muted-foreground">
                  Add and manage frequently asked questions
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/admin/faq")}>
                Manage
              </Button>
            </div>

            <Separator />

            {/* Packages */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Pricing Management</Label>
                <div className="text-sm text-muted-foreground">
                  Manage pricing packages and content
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/admin/packages")}>
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset Section */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="font-heading flex items-center space-x-2 text-destructive">
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-destructive mb-2">Reset All Settings</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This will reset all your settings to their default values. This action cannot be undone.
              </p>
              <Button variant="destructive" size="sm">
                Reset Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <SettingsLayout activeTab={currentTab}>
      {currentTab === 'profile' ? renderProfileTab() : renderSettingsTab()}
    </SettingsLayout>
  );
};

export default SettingsWithTabs; 