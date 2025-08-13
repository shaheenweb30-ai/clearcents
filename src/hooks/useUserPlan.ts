import { useAuth } from '@/contexts/AuthContext';

export type UserPlan = 'free' | 'pro' | 'enterprise';

export function useUserPlan() {
  const { user } = useAuth();
  
  // For now, all users are on the free plan
  // In the future, this would check the user's subscription status from the database
  const currentPlan: UserPlan = 'free';
  
  const isFreePlan = currentPlan === 'free';
  const isProPlan = currentPlan === 'pro';
  const isEnterprisePlan = currentPlan === 'enterprise';
  
  const getPlanLimits = () => {
    switch (currentPlan) {
      case 'free':
        return {
          maxTransactions: 10,
          maxCategories: 10,
          maxBudgets: 10,
          aiInsightsPerMonth: 5,
          canExportData: false,
          canUseCustomCategories: true,
          canUseAdvancedAnalytics: false,
          canUseTeamFeatures: false,
          canUseAPI: false
        };
      case 'pro':
        return {
          maxTransactions: -1, // unlimited
          maxCategories: -1, // unlimited
          maxBudgets: -1, // unlimited
          aiInsightsPerMonth: 50,
          canExportData: true,
          canUseCustomCategories: true,
          canUseAdvancedAnalytics: true,
          canUseTeamFeatures: true,
          canUseAPI: true
        };
      case 'enterprise':
        return {
          maxTransactions: -1, // unlimited
          maxCategories: -1, // unlimited
          maxBudgets: -1, // unlimited
          aiInsightsPerMonth: -1, // unlimited
          canExportData: true,
          canUseCustomCategories: true,
          canUseAdvancedAnalytics: true,
          canUseTeamFeatures: true,
          canUseAPI: true
        };
      default:
        return {
          maxTransactions: 10,
          maxCategories: 10,
          maxBudgets: 10,
          aiInsightsPerMonth: 5,
          canExportData: false,
          canUseCustomCategories: true,
          canUseAdvancedAnalytics: false,
          canUseTeamFeatures: false,
          canUseAPI: false
        };
    }
  };
  
  return {
    currentPlan,
    isFreePlan,
    isProPlan,
    isEnterprisePlan,
    getPlanLimits,
    limits: getPlanLimits()
  };
}
