import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SubscriptionCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Default to free plan for all users
  const subscription = {
    planName: "Free Plan",
    status: "active" as const,
    renewalDate: "Forever",
    price: "Free"
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleUpgrade = () => {
    navigate('/checkout?plan=pro');
  };

  const handleManageSubscription = () => {
    navigate('/subscription');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-green-600" />
          Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {subscription.planName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current Plan
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {subscription.price}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {subscription.renewalDate}
            </div>
          </div>
        </div>

        {getStatusBadge(subscription.status)}

        <div className="space-y-2">
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Pro
          </Button>
          <Button 
            onClick={handleManageSubscription}
            variant="outline" 
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Enjoy your free features. Upgrade to Pro when you need more.
        </p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;