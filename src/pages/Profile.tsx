import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Edit2, 
  Save, 
  X, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Camera,
  Shield,
  Calendar,
  Globe,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Crown,
  Sparkles,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }
      
      setUser(user);
      setEmail(user.email || "");
      setDisplayName(user.user_metadata?.name || "");
      setFirstName(user.user_metadata?.first_name || "");
      setLastName(user.user_metadata?.last_name || "");
    } catch (error) {
      console.error("Error getting user:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          name: displayName,
          first_name: firstName,
          last_name: lastName
        }
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setEditing(false);
      getUser();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error updating profile",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordChange(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error updating password",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string, lastName: string, email: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, color: "bg-gray-200", text: "" };
    if (password.length < 6) return { strength: 1, color: "bg-red-500", text: "Weak" };
    if (password.length < 10) return { strength: 2, color: "bg-yellow-500", text: "Fair" };
    if (password.length < 12) return { strength: 3, color: "bg-blue-500", text: "Good" };
    return { strength: 4, color: "bg-green-500", text: "Strong" };
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300 animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                <Sparkles className="h-4 w-4" />
                Profile Management
              </div>
              <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl leading-tight text-gray-900 dark:text-white">
                Profile Settings
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Manage your account information, security settings, and personalize your experience.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Profile Overview */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Card */}
                <Card className="border-0 shadow-2xl bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/50 dark:border-slate-700/50">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div className="relative inline-block">
                        <Avatar className="h-32 w-32 border-4 border-blue-600/20 shadow-2xl">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                            {getInitials(firstName, lastName, user.email || "")}
                          </AvatarFallback>
                        </Avatar>
                        <Button 
                          size="sm" 
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 shadow-lg hover:scale-110 transition-transform bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {firstName && lastName ? `${firstName} ${lastName}` : displayName || user.email?.split('@')[0]}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{email}</p>
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2 rounded-full shadow-lg">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium Member
                        </Badge>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Member since {new Date(user.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/50 dark:border-slate-700/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                      Account Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Last Sign In</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <Separator className="bg-gray-200 dark:bg-slate-700" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Account ID</span>
                      <span className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {user.id.slice(0, 8)}...
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Settings */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card className="border-0 shadow-2xl bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 px-6 py-4">
                    <CardHeader className="p-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center text-gray-900 dark:text-white">
                          <UserIcon className="h-5 w-5 mr-3 text-blue-600" />
                          Personal Information
                        </CardTitle>
                        {!editing ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditing(true)}
                            className="hover:bg-blue-600 hover:text-white transition-colors border-gray-300 dark:border-slate-600"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditing(false)}
                              className="hover:bg-red-600 hover:text-white transition-colors border-gray-300 dark:border-slate-600"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={handleSaveProfile}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-lg"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-900 dark:text-white">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={!editing}
                          placeholder="Enter your first name"
                          className="h-11 border-gray-300 dark:border-slate-600 focus:border-blue-600 focus:ring-blue-600/20 transition-colors bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-900 dark:text-white">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={!editing}
                          placeholder="Enter your last name"
                          className="h-11 border-gray-300 dark:border-slate-600 focus:border-blue-600 focus:ring-blue-600/20 transition-colors bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="displayName" className="text-sm font-medium text-gray-900 dark:text-white">
                          Display Name
                        </Label>
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          disabled={!editing}
                          placeholder="Enter your display name"
                          className="h-11 border-gray-300 dark:border-slate-600 focus:border-blue-600 focus:ring-blue-600/20 transition-colors bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          value={email}
                          disabled
                          className="h-11 bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="border-0 shadow-2xl bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 px-6 py-4">
                    <CardHeader className="p-0">
                      <CardTitle className="text-xl flex items-center text-gray-900 dark:text-white">
                        <Shield className="h-5 w-5 mr-3 text-orange-500" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Change Password</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Update your password to keep your account secure
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="hover:bg-orange-500 hover:text-white transition-colors border-gray-300 dark:border-slate-600"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>

                    {showPasswordChange && (
                      <div className="space-y-6 p-6 border border-gray-200/50 dark:border-slate-700/50 rounded-2xl bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-slate-800/50 dark:to-slate-700/50">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-900 dark:text-white">
                              New Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="h-11 border-gray-300 dark:border-slate-600 focus:border-blue-600 focus:ring-blue-600/20 transition-colors pr-10 bg-white dark:bg-slate-800"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                            {newPassword && (
                              <div className="space-y-2">
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4].map((level) => {
                                    const { strength, color } = getPasswordStrength(newPassword);
                                    return (
                                      <div
                                        key={level}
                                        className={`h-2 flex-1 rounded-full transition-all ${
                                          level <= strength ? color : 'bg-gray-200'
                                        }`}
                                      />
                                    );
                                  })}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {getPasswordStrength(newPassword).text}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900 dark:text-white">
                              Confirm Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="h-11 border-gray-300 dark:border-slate-600 focus:border-blue-600 focus:ring-blue-600/20 transition-colors pr-10 bg-white dark:bg-slate-800"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                            {confirmPassword && newPassword && (
                              <div className="flex items-center space-x-2">
                                {newPassword === confirmPassword ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className={`text-xs ${
                                  newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button 
                            onClick={handleChangePassword}
                            disabled={newPassword !== confirmPassword || newPassword.length < 6}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 shadow-lg"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Update Password
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowPasswordChange(false)}
                            className="hover:bg-red-600 hover:text-white transition-colors border-gray-300 dark:border-slate-600"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Account Information */}
                <Card className="border-0 shadow-2xl bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 px-6 py-4">
                    <CardHeader className="p-0">
                      <CardTitle className="text-xl flex items-center text-gray-900 dark:text-white">
                        <Globe className="h-5 w-5 mr-3 text-blue-500" />
                        Account Information
                      </CardTitle>
                    </CardHeader>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Account Created</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {new Date(user.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Last Sign In</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {user.last_sign_in_at ? 
                                new Date(user.last_sign_in_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'Never'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;