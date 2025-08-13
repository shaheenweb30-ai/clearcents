import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradePopupProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: 'transactions' | 'categories' | 'budgets' | 'aiInsights';
  currentCount: number;
  maxCount: number;
}

const UpgradePopup: React.FC<UpgradePopupProps> = ({
  isOpen,
  onClose,
  limitType,
  currentCount,
  maxCount
}) => {
  const navigate = useNavigate();

  const getLimitMessage = () => {
    switch (limitType) {
      case 'transactions':
        return `You've reached your limit of ${maxCount} transactions on the Free plan.`;
      case 'categories':
        return `You've reached your limit of ${maxCount} categories on the Free plan.`;
      case 'budgets':
        return `You've reached your limit of ${maxCount} budget on the Free plan.`;
      case 'aiInsights':
        return `You've reached your limit of ${maxCount} AI insights this month on the Free plan.`;
      default:
        return `You've reached a limit on the Free plan.`;
    }
  };

  const getFeatureTitle = () => {
    switch (limitType) {
      case 'transactions':
        return 'Unlimited Transactions';
      case 'categories':
        return 'Unlimited Categories';
      case 'budgets':
        return 'Unlimited Budgets';
      case 'aiInsights':
        return 'Unlimited AI Insights';
      default:
        return 'Unlimited Access';
    }
  };

  const handleUpgrade = () => {
    navigate('/checkout?plan=pro');
    onClose();
  };

  const handleViewPricing = () => {
    navigate('/pricing');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-slate-800 dark:text-slate-200">
            🚀 Upgrade to Pro
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Limit Message */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {getLimitMessage()}
            </p>
            <p className="text-slate-800 dark:text-slate-200 font-medium mt-2">
              Current: {currentCount} / {maxCount}
            </p>
          </div>

          {/* Pro Plan Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/30">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Pro Plan Benefits
              </h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Unlimited transactions</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Unlimited categories & budgets</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>50+ AI insights per month</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Advanced analytics & reports</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Team collaboration features</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              $12<span className="text-sm font-normal text-slate-600 dark:text-slate-400">/month</span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              or $115.20/year (save 20%)
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleViewPricing}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View All Plans
            </Button>
          </div>

          {/* Free Plan Info */}
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You can continue using the Free plan with current limits, 
              or upgrade anytime to unlock unlimited access.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePopup;
