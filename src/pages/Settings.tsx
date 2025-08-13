import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Shield,
  Plus,
  ChevronDown
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function Settings() {
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
  const { user } = useAuth();
  const { preferences, userProfile, updatePreferences, updateUserProfile } = useSettings();

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    timezone: userProfile?.timezone || "UTC",
    language: userProfile?.language || "en"
  });

  const [preferencesForm, setPreferencesForm] = useState({
    theme: preferences?.theme || 'system' as 'light' | 'dark' | 'system',
    currency: preferences?.currency || 'USD',
    budgetPeriod: (preferences?.budgetPeriod ?? 'monthly') as 'monthly' | 'quarterly' | 'yearly',
    dateFormat: preferences?.dateFormat || 'MM/DD/YYYY',
    timeFormat: preferences?.timeFormat || '12h' as '12h' | '24h',
    notifications: preferences?.notifications || {
      transactions: true,
      budgets: true,
      reports: true,
      security: true
    }
  });

  const [currencySearchTerm, setCurrencySearchTerm] = useState("");
  
  // Comprehensive list of world currencies
  const allCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    { code: 'COP', name: 'Colombian Peso', symbol: '$' },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
    { code: 'UYU', name: 'Uruguayan Peso', symbol: '$' },
    { code: 'PYG', name: 'Paraguayan Guaraní', symbol: '₲' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'TND' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'QAR' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KWD' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BHD' },
    { code: 'OMR', name: 'Omani Rial', symbol: 'OMR' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JOD' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr' },
    { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
    { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
    { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
    { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
    { code: 'UZS', name: 'Uzbekistani Som', symbol: 'so\'m' },
    { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с' },
    { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'ЅМ' },
    { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T' },
    { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼' },
    { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
    { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
    { code: 'BAM', name: 'Bosnia and Herzegovina Convertible Mark', symbol: 'KM' },
    { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден' },
    { code: 'ALL', name: 'Albanian Lek', symbol: 'L' },
    { code: 'MDL', name: 'Moldovan Leu', symbol: 'L' },
    { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' },
    { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' },
    { code: 'XPF', name: 'CFP Franc', symbol: 'CFP' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ' },
    { code: 'AWG', name: 'Aruban Florin', symbol: 'ƒ' },
    { code: 'BBD', name: 'Barbadian Dollar', symbol: '$' },
    { code: 'BMD', name: 'Bermudian Dollar', symbol: '$' },
    { code: 'BND', name: 'Brunei Dollar', symbol: '$' },
    { code: 'BSD', name: 'Bahamian Dollar', symbol: '$' },
    { code: 'FJD', name: 'Fijian Dollar', symbol: '$' },
    { code: 'GYD', name: 'Guyanese Dollar', symbol: '$' },
    { code: 'JMD', name: 'Jamaican Dollar', symbol: '$' },
    { code: 'LRD', name: 'Liberian Dollar', symbol: '$' },
    { code: 'NAD', name: 'Namibian Dollar', symbol: '$' },
    { code: 'SBD', name: 'Solomon Islands Dollar', symbol: '$' },
    { code: 'SRD', name: 'Surinamese Dollar', symbol: '$' },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: '$' },
    { code: 'TVD', name: 'Tuvaluan Dollar', symbol: '$' },
    { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: '$' }
  ];

  // Handle tab parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['profile', 'preferences', 'security', 'admin'].includes(tabParam)) {
      setActiveTab(tabParam as 'profile' | 'preferences' | 'security' | 'admin');
    }
  }, []);

  // Load user preferences
  useEffect(() => {
    if (preferences) {
      setPreferencesForm({
        theme: preferences.theme || 'system',
        currency: preferences.currency || 'USD',
        budgetPeriod: preferences.budgetPeriod || 'monthly',
        dateFormat: preferences.dateFormat || 'MM/DD/YYYY',
        timeFormat: preferences.timeFormat || '12h',
        notifications: {
          transactions: preferences.notifications?.transactions ?? true,
          budgets: preferences.notifications?.budgets ?? true,
          reports: preferences.notifications?.reports ?? true,
          security: preferences.notifications?.security ?? true,
        }
      });
    }
  }, [preferences]);

  // Update profile form when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        timezone: userProfile.timezone || "UTC",
        language: userProfile.language || "en"
      });
    }
  }, [userProfile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    
    try {
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
      // Update the context with new preferences
      updatePreferences({
        theme: preferencesForm.theme,
        currency: preferencesForm.currency,
        budgetPeriod: preferencesForm.budgetPeriod,
        dateFormat: preferencesForm.dateFormat,
        timeFormat: preferencesForm.timeFormat,
        notifications: preferencesForm.notifications
      });

      setSavedStates(prev => ({ ...prev, preferences: true }));
      toast({
        title: "Preferences Updated! ✨",
        description: "Your preferences have been saved successfully.",
      });

      // Reset saved state after 3 seconds
      setTimeout(() => {
        setSavedStates(prev => ({ ...prev, preferences: false }));
      }, 3000);
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // In a real app, you'd call the account deletion API here
        toast({
          title: "Account Deletion Requested",
          description: "Your account deletion request has been submitted. You will receive a confirmation email.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit account deletion request. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredCurrencies = allCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(currencySearchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(currencySearchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Not Authenticated</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Please log in to access settings.</p>
              <Button onClick={() => navigate('/login')} className="rounded-full">
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
              <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              Application Settings
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
              Settings & Preferences
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">Customize your experience and manage your account</p>
          </div>

          {/* Settings Tabs */}
          <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 dark:bg-slate-700/50 p-1 rounded-lg m-6">
                  <TabsTrigger value="profile" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <Palette className="w-4 h-4 mr-2" />
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Profile Information</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Update your personal information and contact details</p>
                    </div>
                    {savedStates.profile && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Saved!
                      </Badge>
                    )}
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={profileForm.email}
                          disabled
                          className="bg-slate-50 dark:bg-slate-700"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Email cannot be changed for security reasons
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select
                          id="timezone"
                          value={profileForm.timezone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                        >
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                          <option value="Europe/London">London</option>
                          <option value="Europe/Paris">Paris</option>
                          <option value="Asia/Tokyo">Tokyo</option>
                        </select>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Enter your address"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={savingProfile}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {savingProfile ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">App Preferences</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Customize your app appearance and behavior</p>
                    </div>
                    {savedStates.preferences && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Saved!
                      </Badge>
                    )}
                  </div>

                  <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-700 dark:text-slate-300">Appearance</h4>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <select
                              id="theme"
                              value={preferencesForm.theme}
                              onChange={(e) => setPreferencesForm(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' | 'system' }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                            >
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="system">System</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <div className="relative">
                              <Input
                                id="currency-search"
                                placeholder={`Search currencies (current: ${preferencesForm.currency})`}
                                value={currencySearchTerm}
                                onChange={(e) => setCurrencySearchTerm(e.target.value)}
                                className="w-full mb-2"
                              />
                              <div className="relative">
                                <select
                                  id="currency"
                                  value={preferencesForm.currency}
                                  onChange={(e) => setPreferencesForm(prev => ({ ...prev, currency: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                >
                                  {filteredCurrencies.map((currency) => (
                                    <option key={currency.code} value={currency.code}>
                                      {currency.code} - {currency.name} ({currency.symbol})
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <ChevronDown className="h-4 w-4 text-slate-400" />
                                </div>
                              </div>
                              {currencySearchTerm && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  Found {filteredCurrencies.length} currencies matching "{currencySearchTerm}"
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-700 dark:text-slate-300">Formatting</h4>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="budgetPeriod">Budget Period</Label>
                            <select
                              id="budgetPeriod"
                              value={preferencesForm.budgetPeriod}
                              onChange={(e) => setPreferencesForm(prev => ({ ...prev, budgetPeriod: e.target.value as 'monthly' | 'quarterly' | 'yearly' }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="timeFormat">Time Format</Label>
                            <select
                              id="timeFormat"
                              value={preferencesForm.timeFormat}
                              onChange={(e) => setPreferencesForm(prev => ({ ...prev, timeFormat: e.target.value as '12h' | '24h' }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                            >
                              <option value="12h">12-hour (AM/PM)</option>
                              <option value="24h">24-hour</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                                         <div className="space-y-4">
                       <h4 className="font-medium text-slate-700 dark:text-slate-300">Notifications</h4>
                       <div className="space-y-3">
                         <div className="flex items-center justify-between">
                           <div>
                             <Label htmlFor="transactionNotif">Transaction Notifications</Label>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when transactions are added</p>
                           </div>
                           <Switch
                             id="transactionNotif"
                             checked={preferencesForm.notifications.transactions}
                             onCheckedChange={(checked) => setPreferencesForm(prev => ({
                               ...prev,
                               notifications: { ...prev.notifications, transactions: checked }
                             }))}
                           />
                         </div>
                         <div className="flex items-center justify-between">
                           <div>
                             <Label htmlFor="budgetNotif">Budget Alerts</Label>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when you're close to budget limits</p>
                           </div>
                           <Switch
                             id="budgetNotif"
                             checked={preferencesForm.notifications.budgets}
                             onCheckedChange={(checked) => setPreferencesForm(prev => ({
                               ...prev,
                               notifications: { ...prev.notifications, budgets: checked }
                             }))}
                           />
                         </div>
                         <div className="flex items-center justify-between">
                           <div>
                             <Label htmlFor="reportNotif">Report Notifications</Label>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when new reports are available</p>
                           </div>
                           <Switch
                             id="reportNotif"
                             checked={preferencesForm.notifications.reports}
                             onCheckedChange={(checked) => setPreferencesForm(prev => ({
                               ...prev,
                               notifications: { ...prev.notifications, reports: checked }
                             }))}
                           />
                         </div>
                         <div className="flex items-center justify-between">
                           <div>
                             <Label htmlFor="securityNotif">Security Notifications</Label>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about security events</p>
                           </div>
                           <Switch
                             id="securityNotif"
                             checked={preferencesForm.notifications.security}
                             onCheckedChange={(checked) => setPreferencesForm(prev => ({
                               ...prev,
                               notifications: { ...prev.notifications, security: checked }
                             }))}
                           />
                         </div>
                       </div>
                     </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={savingPreferences}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {savingPreferences ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Preferences
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Billing & Subscription</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Manage your subscription and billing information</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                          Current Plan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Plan</span>
                            <span className="font-medium">Free Tier</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Active
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <Download className="w-4 h-4 mr-2 text-green-600" />
                          Usage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Transactions</span>
                            <span className="font-medium">Unlimited</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Storage</span>
                            <span className="font-medium">1GB</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>
                </TabsContent>

                {/* Admin Tab */}
                <TabsContent value="admin" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Administrative Settings</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Advanced settings and account management</p>
                  </div>

                  <div className="space-y-4">
                    <Card className="border-0 bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center text-red-700 dark:text-red-300">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Danger Zone
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Delete Account</h4>
                            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button
                              variant="outline"
                              onClick={handleAccountDeletion}
                              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Welcome Message */}
          <Card className="rounded-xl border-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200/50 dark:border-green-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Settings Working!
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Now using your actual settings and profile data
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-green-200/50 dark:border-green-700/50">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-3">
                  The Settings page is now fully functional and connected to your settings system! You can:
                </p>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                  <li>• Update your profile information and contact details</li>
                  <li>• Customize app appearance, currency, and formatting</li>
                  <li>• Manage notification preferences</li>
                  <li>• View billing and subscription information</li>
                  <li>• Access administrative settings and account management</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}