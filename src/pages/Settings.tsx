import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  User as UserIcon, 
  Bell, 
  Palette, 
  Globe, 
  CreditCard,
  Download,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "react-i18next";
import { useUserRole } from "@/hooks/useUserRole";
import { FormSubmissions } from "@/components/admin/FormSubmissions";
import { NewsletterSubscribers } from "@/components/admin/NewsletterSubscribers";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ReactNode;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [savedStates, setSavedStates] = useState({
    profile: false,
    preferences: false
  });
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const { preferences, userProfile, updatePreferences, updateUserProfile } = useSettings();
  const { isAdmin } = useUserRole(authUser);

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    email: userProfile.email,
    phone: userProfile.phone,
    address: userProfile.address,
    timezone: userProfile.timezone,
    language: userProfile.language
  });



  const [preferencesForm, setPreferencesForm] = useState({
    theme: preferences.theme as 'light' | 'dark' | 'system',
    currency: preferences.currency,
    dateFormat: preferences.dateFormat,
    timeFormat: preferences.timeFormat as '12h' | '24h',
    notifications: preferences.notifications
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/login");
        } else if (session) {
          setLoading(false);
          // Load user profile data
          loadUserProfile(session.user);
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
        loadUserProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'preferences', 'billing', 'admin', 'newsletter'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const loadUserProfile = async (user: User) => {
    try {
      // Load user profile from your profiles table if you have one
      // For now, we'll use the auth user data
      setProfileForm({
        firstName: user.user_metadata?.first_name || "",
        lastName: user.user_metadata?.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.user_metadata?.address || "",
        timezone: user.user_metadata?.timezone || "UTC",
        language: user.user_metadata?.language || "en"
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profileForm.firstName,
          last_name: profileForm.lastName,
          address: profileForm.address,
          timezone: profileForm.timezone,
          language: profileForm.language
        }
      });

      if (error) throw error;

      // Update the context with new profile data
      updateUserProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        address: profileForm.address,
        timezone: profileForm.timezone,
        language: profileForm.language
      });

      setSavedStates(prev => ({ ...prev, profile: true }));
      toast({
        title: "Profile Updated! ✨",
        description: "Your profile information has been saved successfully.",
      });

      // Reset saved state after 3 seconds
      setTimeout(() => {
        setSavedStates(prev => ({ ...prev, profile: false }));
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };



  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPreferences(true);
    
    try {
      // Update preferences through the context
      updatePreferences({
        theme: preferencesForm.theme,
        currency: preferencesForm.currency,
        dateFormat: preferencesForm.dateFormat,
        timeFormat: preferencesForm.timeFormat,
        notifications: preferencesForm.notifications
      });
      
      setSavedStates(prev => ({ ...prev, preferences: true }));
      toast({
        title: "Preferences Saved! ⚙️",
        description: "Your preferences have been updated successfully.",
      });

      // Reset saved state after 3 seconds
      setTimeout(() => {
        setSavedStates(prev => ({ ...prev, preferences: false }));
      }, 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(user?.id || "");
      
      if (error) throw error;

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });

      navigate("/");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
      return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email address cannot be changed
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        value={profileForm.timezone}
                        onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        value={profileForm.language}
                        onChange={(e) => setProfileForm({ ...profileForm, language: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button type="submit" className="flex items-center gap-2" disabled={savingProfile}>
                      {savingProfile ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                    <Save className="h-4 w-4" />
                    Save Changes
                        </>
                      )}
                  </Button>
                    {savedStates.profile && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Saved!</span>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance & Display
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setPreferencesForm({ ...preferencesForm, theme: 'light' })}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                            preferencesForm.theme === 'light'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                            <span className="text-sm font-medium">Light</span>
                          </div>
                          <div className="space-y-1">
                            <div className="w-full h-2 bg-gray-200 rounded"></div>
                            <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                            <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                          </div>
                          {preferencesForm.theme === 'light' && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPreferencesForm({ ...preferencesForm, theme: 'dark' })}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                            preferencesForm.theme === 'dark'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                            <span className="text-sm font-medium">Dark</span>
                          </div>
                          <div className="space-y-1">
                            <div className="w-full h-2 bg-gray-700 rounded"></div>
                            <div className="w-3/4 h-2 bg-gray-700 rounded"></div>
                            <div className="w-1/2 h-2 bg-gray-700 rounded"></div>
                          </div>
                          {preferencesForm.theme === 'dark' && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPreferencesForm({ ...preferencesForm, theme: 'system' })}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                            preferencesForm.theme === 'system'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium">System</span>
                          </div>
                          <div className="space-y-1">
                            <div className="w-full h-2 bg-gradient-to-r from-gray-200 to-gray-700 rounded"></div>
                            <div className="w-3/4 h-2 bg-gradient-to-r from-gray-200 to-gray-700 rounded"></div>
                            <div className="w-1/2 h-2 bg-gradient-to-r from-gray-200 to-gray-700 rounded"></div>
                          </div>
                          {preferencesForm.theme === 'system' && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            </div>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Choose your preferred theme. System will automatically match your device settings.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        value={preferencesForm.currency}
                        onChange={(e) => setPreferencesForm({ ...preferencesForm, currency: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD - US Dollar ($)</option>
                        <option value="EUR">EUR - Euro (€)</option>
                        <option value="GBP">GBP - British Pound (£)</option>
                        <option value="JPY">JPY - Japanese Yen (¥)</option>
                        <option value="CAD">CAD - Canadian Dollar (C$)</option>
                        <option value="AUD">AUD - Australian Dollar (A$)</option>
                        <option value="CHF">CHF - Swiss Franc (CHF)</option>
                        <option value="CNY">CNY - Chinese Yuan (¥)</option>
                        <option value="INR">INR - Indian Rupee (₹)</option>
                        <option value="BRL">BRL - Brazilian Real (R$)</option>
                        <option value="MXN">MXN - Mexican Peso ($)</option>
                        <option value="KRW">KRW - South Korean Won (₩)</option>
                        <option value="SGD">SGD - Singapore Dollar (S$)</option>
                        <option value="HKD">HKD - Hong Kong Dollar (HK$)</option>
                        <option value="NZD">NZD - New Zealand Dollar (NZ$)</option>
                        <option value="SEK">SEK - Swedish Krona (kr)</option>
                        <option value="NOK">NOK - Norwegian Krone (kr)</option>
                        <option value="DKK">DKK - Danish Krone (kr)</option>
                        <option value="PLN">PLN - Polish Złoty (zł)</option>
                        <option value="CZK">CZK - Czech Koruna (Kč)</option>
                        <option value="HUF">HUF - Hungarian Forint (Ft)</option>
                        <option value="RUB">RUB - Russian Ruble (₽)</option>
                        <option value="TRY">TRY - Turkish Lira (₺)</option>
                        <option value="ZAR">ZAR - South African Rand (R)</option>
                        <option value="ILS">ILS - Israeli Shekel (₪)</option>
                        <option value="AED">AED - UAE Dirham (د.إ)</option>
                        <option value="SAR">SAR - Saudi Riyal (ر.س)</option>
                        <option value="QAR">QAR - Qatari Riyal (ر.ق)</option>
                        <option value="KWD">KWD - Kuwaiti Dinar (د.ك)</option>
                        <option value="BHD">BHD - Bahraini Dinar (ب.د)</option>
                        <option value="OMR">OMR - Omani Rial (ر.ع)</option>
                        <option value="JOD">JOD - Jordanian Dinar (د.ا)</option>
                        <option value="LBP">LBP - Lebanese Pound (ل.ل)</option>
                        <option value="EGP">EGP - Egyptian Pound (ج.م)</option>
                        <option value="NGN">NGN - Nigerian Naira (₦)</option>
                        <option value="GHS">GHS - Ghanaian Cedi (₵)</option>
                        <option value="KES">KES - Kenyan Shilling (KSh)</option>
                        <option value="UGX">UGX - Ugandan Shilling (USh)</option>
                        <option value="TZS">TZS - Tanzanian Shilling (TSh)</option>
                        <option value="ZMW">ZMW - Zambian Kwacha (ZK)</option>
                        <option value="BWP">BWP - Botswana Pula (P)</option>
                        <option value="NAD">NAD - Namibian Dollar (N$)</option>
                        <option value="MUR">MUR - Mauritian Rupee (₨)</option>
                        <option value="SCR">SCR - Seychellois Rupee (₨)</option>
                        <option value="MAD">MAD - Moroccan Dirham (د.م)</option>
                        <option value="TND">TND - Tunisian Dinar (د.ت)</option>
                        <option value="DZD">DZD - Algerian Dinar (د.ج)</option>
                        <option value="LYD">LYD - Libyan Dinar (ل.د)</option>
                        <option value="SDG">SDG - Sudanese Pound (ج.س)</option>
                        <option value="ETB">ETB - Ethiopian Birr (Br)</option>
                        <option value="SOS">SOS - Somali Shilling (S)</option>
                        <option value="DJF">DJF - Djiboutian Franc (Fdj)</option>
                        <option value="KMF">KMF - Comorian Franc (CF)</option>
                        <option value="MGA">MGA - Malagasy Ariary (Ar)</option>
                        <option value="XOF">XOF - West African CFA Franc (CFA)</option>
                        <option value="XAF">XAF - Central African CFA Franc (FCFA)</option>
                        <option value="XPF">XPF - CFP Franc (₣)</option>
                        <option value="CLP">CLP - Chilean Peso ($)</option>
                        <option value="COP">COP - Colombian Peso ($)</option>
                        <option value="PEN">PEN - Peruvian Sol (S/)</option>
                        <option value="ARS">ARS - Argentine Peso ($)</option>
                        <option value="UYU">UYU - Uruguayan Peso ($)</option>
                        <option value="PYG">PYG - Paraguayan Guaraní (₲)</option>
                        <option value="BOB">BOB - Bolivian Boliviano (Bs)</option>
                        <option value="VEF">VEF - Venezuelan Bolívar (Bs)</option>
                        <option value="GTQ">GTQ - Guatemalan Quetzal (Q)</option>
                        <option value="HNL">HNL - Honduran Lempira (L)</option>
                        <option value="NIO">NIO - Nicaraguan Córdoba (C$)</option>
                        <option value="CRC">CRC - Costa Rican Colón (₡)</option>
                        <option value="PAB">PAB - Panamanian Balboa (B/)</option>
                        <option value="DOP">DOP - Dominican Peso (RD$)</option>
                        <option value="JMD">JMD - Jamaican Dollar (J$)</option>
                        <option value="TTD">TTD - Trinidad and Tobago Dollar (TT$)</option>
                        <option value="BBD">BBD - Barbadian Dollar (Bds$)</option>
                        <option value="XCD">XCD - East Caribbean Dollar (EC$)</option>
                        <option value="ANG">ANG - Netherlands Antillean Guilder (ƒ)</option>
                        <option value="AWG">AWG - Aruban Florin (ƒ)</option>
                        <option value="KYD">KYD - Cayman Islands Dollar (CI$)</option>
                        <option value="BMD">BMD - Bermudian Dollar (BD$)</option>
                        <option value="BZD">BZD - Belize Dollar (BZ$)</option>
                        <option value="GYD">GYD - Guyanese Dollar (G$)</option>
                        <option value="SRD">SRD - Surinamese Dollar ($)</option>
                        <option value="FJD">FJD - Fijian Dollar (FJ$)</option>
                        <option value="WST">WST - Samoan Tālā (T)</option>
                        <option value="TOP">TOP - Tongan Paʻanga (T$)</option>
                        <option value="VUV">VUV - Vanuatu Vatu (VT)</option>
                        <option value="SBD">SBD - Solomon Islands Dollar (SI$)</option>
                        <option value="PGK">PGK - Papua New Guinean Kina (K)</option>
                        <option value="NIO">NIO - Nicaraguan Córdoba (C$)</option>
                        <option value="HTG">HTG - Haitian Gourde (G)</option>
                        <option value="CUP">CUP - Cuban Peso ($)</option>
                        <option value="CUC">CUC - Cuban Convertible Peso (CUC$)</option>
                        <option value="BSD">BSD - Bahamian Dollar (B$)</option>
                        <option value="KHR">KHR - Cambodian Riel (៛)</option>
                        <option value="LAK">LAK - Lao Kip (₭)</option>
                        <option value="MMK">MMK - Myanmar Kyat (K)</option>
                        <option value="THB">THB - Thai Baht (฿)</option>
                        <option value="VND">VND - Vietnamese Dong (₫)</option>
                        <option value="PHP">PHP - Philippine Peso (₱)</option>
                        <option value="MYR">MYR - Malaysian Ringgit (RM)</option>
                        <option value="IDR">IDR - Indonesian Rupiah (Rp)</option>
                        <option value="BDT">BDT - Bangladeshi Taka (৳)</option>
                        <option value="LKR">LKR - Sri Lankan Rupee (Rs)</option>
                        <option value="NPR">NPR - Nepalese Rupee (₨)</option>
                        <option value="PKR">PKR - Pakistani Rupee (₨)</option>
                        <option value="AFN">AFN - Afghan Afghani (؋)</option>
                        <option value="IRR">IRR - Iranian Rial (﷼)</option>
                        <option value="IQD">IQD - Iraqi Dinar (ع.د)</option>
                        <option value="KZT">KZT - Kazakhstani Tenge (₸)</option>
                        <option value="UZS">UZS - Uzbekistani Som (so'm)</option>
                        <option value="TJS">TJS - Tajikistani Somoni (ЅМ)</option>
                        <option value="TMT">TMT - Turkmenistan Manat (T)</option>
                        <option value="GEL">GEL - Georgian Lari (₾)</option>
                        <option value="AMD">AMD - Armenian Dram (֏)</option>
                        <option value="AZN">AZN - Azerbaijani Manat (₼)</option>
                        <option value="BYN">BYN - Belarusian Ruble (Br)</option>
                        <option value="MDL">MDL - Moldovan Leu (L)</option>
                        <option value="UAH">UAH - Ukrainian Hryvnia (₴)</option>
                        <option value="RSD">RSD - Serbian Dinar (дин)</option>
                        <option value="BAM">BAM - Bosnia-Herzegovina Convertible Mark (KM)</option>
                        <option value="HRK">HRK - Croatian Kuna (kn)</option>
                        <option value="BGN">BGN - Bulgarian Lev (лв)</option>
                        <option value="RON">RON - Romanian Leu (lei)</option>
                        <option value="ALL">ALL - Albanian Lek (L)</option>
                        <option value="MKD">MKD - Macedonian Denar (ден)</option>
                        <option value="MNT">MNT - Mongolian Tögrög (₮)</option>
                        <option value="KGS">KGS - Kyrgyzstani Som (с)</option>
                        <option value="TJS">TJS - Tajikistani Somoni (ЅМ)</option>
                        <option value="TMT">TMT - Turkmenistan Manat (T)</option>
                        <option value="UZS">UZS - Uzbekistani Som (so'm)</option>
                        <option value="KZT">KZT - Kazakhstani Tenge (₸)</option>
                        <option value="GEL">GEL - Georgian Lari (₾)</option>
                        <option value="AMD">AMD - Armenian Dram (֏)</option>
                        <option value="AZN">AZN - Azerbaijani Manat (₼)</option>
                        <option value="BYN">BYN - Belarusian Ruble (Br)</option>
                        <option value="MDL">MDL - Moldovan Leu (L)</option>
                        <option value="UAH">UAH - Ukrainian Hryvnia (₴)</option>
                        <option value="RSD">RSD - Serbian Dinar (дин)</option>
                        <option value="BAM">BAM - Bosnia-Herzegovina Convertible Mark (KM)</option>
                        <option value="HRK">HRK - Croatian Kuna (kn)</option>
                        <option value="BGN">BGN - Bulgarian Lev (лв)</option>
                        <option value="RON">RON - Romanian Leu (lei)</option>
                        <option value="ALL">ALL - Albanian Lek (L)</option>
                        <option value="MKD">MKD - Macedonian Denar (ден)</option>
                        <option value="MNT">MNT - Mongolian Tögrög (₮)</option>
                        <option value="KGS">KGS - Kyrgyzstani Som (с)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <select
                        id="dateFormat"
                        value={preferencesForm.dateFormat}
                        onChange={(e) => setPreferencesForm({ ...preferencesForm, dateFormat: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <select
                        id="timeFormat"
                        value={preferencesForm.timeFormat}
                        onChange={(e) => setPreferencesForm({ ...preferencesForm, timeFormat: e.target.value as '12h' | '24h' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="12h">12-hour</option>
                        <option value="24h">24-hour</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button type="submit" className="flex items-center gap-2" disabled={savingPreferences}>
                      {savingPreferences ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                    <Save className="h-4 w-4" />
                    Save Preferences
                        </>
                      )}
                  </Button>
                    {savedStates.preferences && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Preferences Saved!</span>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Transaction Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when transactions are added
                    </p>
                  </div>
                  <Switch
                    checked={preferencesForm.notifications.transactions}
                    onCheckedChange={(checked) => setPreferencesForm({
                      ...preferencesForm,
                      notifications: { ...preferencesForm.notifications, transactions: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Budget Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you're close to budget limits
                    </p>
                  </div>
                  <Switch
                    checked={preferencesForm.notifications.budgets}
                    onCheckedChange={(checked) => setPreferencesForm({
                      ...preferencesForm,
                      notifications: { ...preferencesForm.notifications, budgets: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Report Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new reports are available
                    </p>
                  </div>
                  <Switch
                    checked={preferencesForm.notifications.reports}
                    onCheckedChange={(checked) => setPreferencesForm({
                      ...preferencesForm,
                      notifications: { ...preferencesForm.notifications, reports: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Security Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified about security events
                    </p>
                  </div>
                  <Switch
                    checked={preferencesForm.notifications.security}
                    onCheckedChange={(checked) => setPreferencesForm({
                      ...preferencesForm,
                      notifications: { ...preferencesForm.notifications, security: checked }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription & Billing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Current Plan</h4>
                      <p className="text-sm text-muted-foreground">Free Plan</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Data Export</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Export your financial data
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Account Backup</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Create a backup of your account
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Backup Account
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Permanently delete your account
                      </p>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full"
                        onClick={handleAccountDeletion}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

                        {/* Admin Tab */}
              {isAdmin && (
                <TabsContent value="admin" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Admin Panel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormSubmissions />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Newsletter Tab */}
              {isAdmin && (
                <TabsContent value="newsletter" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Newsletter Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <NewsletterSubscribers />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
        </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}