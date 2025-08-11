import { useMemo, useState } from "react";
import { Check, X, ChevronDown, ChevronUp, Sparkles, Trophy, Zap, Shield, ArrowRight, TrendingUp, Crown, Users, BarChart3, CreditCard, Globe, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOptimizedPricingContent } from "@/hooks/useOptimizedPricingContent";
import { usePricingComparison } from "@/hooks/usePricingComparison";

const features = [
  {
    feature: "Real-time expense tracking",
    free: true,
    pro: true,
    enterprise: true,
    description: "Instant updates vs. manual entry"
  },
  {
    feature: "Budget categories",
    free: "10 categories",
    pro: "Unlimited",
    enterprise: "Unlimited",
    description: "Basic vs. comprehensive organization"
  },
  {
    feature: "Budget limits",
    free: "1 budget",
    pro: "Unlimited",
    enterprise: "Unlimited",
    description: "Single vs. multiple budget tracking"
  },
  {
    feature: "AI insights per month",
    free: "5 tips",
    pro: "50+ tips",
    enterprise: "Unlimited",
    description: "Basic vs. comprehensive AI guidance"
  },
  {
    feature: "Recurring detection & alerts",
    free: false,
    pro: true,
    enterprise: true,
    description: "Manual vs. automatic subscription tracking"
  },
  {
    feature: "Multi-currency support",
    free: "Viewer only",
    pro: "Full with live FX",
    enterprise: "Full with live FX",
    description: "Basic vs. real-time currency conversion"
  },
  {
    feature: "CSV import/export",
    free: true,
    pro: true,
    enterprise: true,
    description: "Data portability for all plans"
  },
  {
    feature: "Receipt attachments",
    free: false,
    pro: true,
    enterprise: true,
    description: "Manual vs. automated receipt management"
  },
  {
    feature: "Advanced analytics & reports",
    free: false,
    pro: true,
    enterprise: true,
    description: "Basic vs. comprehensive insights"
  },
  {
    feature: "Priority support",
    free: false,
    pro: true,
    enterprise: "24/7 priority",
    description: "Community vs. dedicated support"
  },
  {
    feature: "Data retention",
    free: "6 months",
    pro: "24 months",
    enterprise: "Unlimited",
    description: "Limited vs. extended data history"
  },
  {
    feature: "Team collaboration",
    free: false,
    pro: "Up to 5 users",
    enterprise: "Unlimited team members",
    description: "Individual vs. team financial management"
  },
  {
    feature: "Advanced security & compliance",
    free: false,
    pro: false,
    enterprise: true,
    description: "Enterprise-grade security features"
  },
  {
    feature: "Custom integrations & API access",
    free: false,
    pro: false,
    enterprise: true,
    description: "Advanced connectivity options"
  },
  {
    feature: "Dedicated account manager",
    free: false,
    pro: false,
    enterprise: true,
    description: "Personalized support and guidance"
  },
  {
    feature: "Custom reporting & analytics",
    free: false,
    pro: false,
    enterprise: true,
    description: "Tailored insights for organizations"
  },
  {
    feature: "White-label options",
    free: false,
    pro: false,
    enterprise: true,
    description: "Brand customization for organizations"
  }
];

export const ComparisonSimple = () => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const { getContentBySection } = useOptimizedPricingContent();
  const freeName = (getContentBySection('free')?.title || 'Free') as string;
  const proName = (getContentBySection('pro')?.title || 'Pro') as string;
  const enterpriseName = (getContentBySection('enterprise')?.title || 'Enterprise') as string;
  const { rows } = usePricingComparison();
  const dynamicRows = useMemo(() => rows.filter((r: any) => r.is_active), [rows]);

  const getCell = (r: any, plan: 'free' | 'pro' | 'enterprise'): boolean | string => {
    if (r && typeof r === 'object' && 'free_is_boolean' in r) {
      const isBool = r[`${plan}_is_boolean`];
      const val = r[`${plan}_value`];
      return isBool ? true : (val || '');
    }
    return r?.[plan];
  };

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-4 h-4 text-green-600" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
          <X className="w-4 h-4 text-red-600" />
        </div>
      );
    } else {
      return <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{value}</span>;
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <Trophy className="w-4 h-4" />
            Plan Comparison
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            What you get on
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}Pro & Enterprise
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the difference between Free, Pro, and Enterprise plans. Upgrade when you're ready.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 shadow-2xl">
            <div className="grid grid-cols-4 bg-gradient-to-r from-gray-50 to-gray-100 p-8">
              <div className="font-bold text-xl text-gray-900">Feature</div>
              <div className="font-bold text-xl text-gray-900 text-center">{freeName}</div>
              <div className="font-bold text-xl text-gray-900 text-center flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-purple-600" />
                {proName}
              </div>
              <div className="font-bold text-xl text-gray-900 text-center flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-indigo-600" />
                {enterpriseName}
              </div>
            </div>
            
            {(dynamicRows.length ? dynamicRows : features).map((row: any, index: number) => (
              <div
                key={index}
                className={`grid grid-cols-4 p-8 border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <div className="font-semibold text-lg text-gray-900">
                  {row.feature}
                  <span className="block text-sm text-gray-600 mt-1">{row.description || ''}</span>
                </div>
                <div className="flex items-center justify-center">
                  {renderValue(getCell(row, 'free'))}
                </div>
                <div className="flex items-center justify-center">
                  {renderValue(getCell(row, 'pro'))}
                </div>
                <div className="flex items-center justify-center">
                  {renderValue(getCell(row, 'enterprise'))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="lg:hidden space-y-6">
          {(dynamicRows.length ? dynamicRows : features).map((row: any, index: number) => {
            const isExpanded = expandedRows.has(index);
            return (
              <div key={index} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleRow(index)}
                  aria-expanded={isExpanded}
                >
                  <span className="font-semibold text-lg text-gray-900">{row.feature}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{row.description || ''}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="text-sm font-semibold text-gray-700 mb-3">{freeName}</div>
                        <div className="flex justify-center">
                          {renderValue(getCell(row, 'free'))}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                        <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-center gap-1">
                          <Crown className="w-4 h-4 text-purple-600" />
                          {proName}
                        </div>
                        <div className="flex justify-center">
                          {renderValue(getCell(row, 'pro'))}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                        <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-center gap-1">
                          <Trophy className="w-4 h-4 text-indigo-600" />
                          {enterpriseName}
                        </div>
                        <div className="flex justify-center">
                          {renderValue(getCell(row, 'enterprise'))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Upgrade Note */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-lg border border-gray-200">
            <Shield className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600 font-medium">
              All plans include data export and basic security features.
            </p>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-200">
            <span className="text-gray-600 font-medium">Ready to unlock Pro or Enterprise features?</span>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Zap className="w-5 h-5 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
