import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const Pricing: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleContactUs = () => {
    navigate('/contact');
  };

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started with financial management",
      price: "Free",
      duration: "forever",
      badge: "Popular",
      icon: Star,
      features: [
        "Basic expense tracking",
        "Up to 100 transactions",
        "3 budget categories",
        "Basic financial insights",
        "Mobile app access",
        "Email support"
      ],
      cta: "Get Started Free",
      ctaAction: handleGetStarted,
      popular: true
    },
    {
      name: "Pro",
      description: "Advanced features for serious financial management",
      price: "$19",
      duration: "per month",
      badge: "Best Value",
      icon: Zap,
      features: [
        "Everything in Free, plus:",
        "Unlimited transactions",
        "Unlimited budget categories",
        "Advanced analytics & reports",
        "Custom financial goals",
        "Export to CSV/PDF",
        "Priority email support",
        "Multi-currency support",
        "Recurring transactions",
        "Bill reminders"
      ],
      cta: "Start Pro Trial",
      ctaAction: handleGetStarted,
      popular: false
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large organizations",
      price: "Custom",
      duration: "tailored pricing",
      badge: "Enterprise",
      icon: Crown,
      features: [
        "Everything in Pro, plus:",
        "Custom integrations",
        "Advanced security features",
        "Dedicated account manager",
        "Custom reporting",
        "API access",
        "White-label options",
        "Team collaboration tools",
        "Advanced permissions",
        "24/7 phone support"
      ],
      cta: "Contact Us",
      ctaAction: handleContactUs,
      popular: false
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        {/* Pricing Cards Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border border-blue-200/50 rounded-full text-sm font-medium mb-6 shadow-sm">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  Pricing Plans
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Start Free, Scale as You Grow
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                No hidden fees, no surprises. Upgrade or downgrade anytime with our flexible pricing structure.
              </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => {
                const Icon = plan.icon;
                return (
                  <div
                    key={plan.name}
                    className={`group relative bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                      plan.popular 
                        ? 'ring-2 ring-blue-500/50 shadow-blue-100/50' 
                        : 'hover:border-gray-300/80'
                    }`}
                  >
                    {/* Plan Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge 
                          variant={plan.popular ? "default" : "secondary"}
                          className={`px-4 py-1.5 text-xs font-semibold shadow-lg ${
                            plan.popular 
                              ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105' 
                              : 'bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 text-white shadow-slate-500/25 hover:shadow-slate-500/40 transition-all duration-300 hover:scale-105'
                          }`}
                        >
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                            plan.popular 
                              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-200/50' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-blue-50 group-hover:to-indigo-50'
                          }`}>
                            <Icon className="w-8 h-8" />
                          </div>
                        </div>
                        
                        {/* Plan Name */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                          {plan.name}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {plan.description}
                        </p>
                        
                        {/* Pricing */}
                        <div className="mb-8 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50">
                          <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                              {plan.price}
                            </span>
                            <span className="text-sm text-gray-600 ml-2 font-medium">
                              {plan.duration}
                            </span>
                          </div>
                          {plan.popular && (
                            <div className="mt-2 text-center">
                              <span className="text-xs text-blue-600 font-semibold">✨ Most Popular Choice</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="mb-8">
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start group/feature">
                              <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3 group-hover/feature:scale-110 transition-transform duration-200">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <div className="text-center">
                        <Button
                          onClick={plan.ctaAction}
                          className={`w-full py-3 text-sm font-semibold rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                            plan.popular
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                              : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white'
                          }`}
                        >
                          {plan.cta}
                        </Button>
                      </div>
                    </div>

                    {/* Subtle decorative elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-blue-50/30 rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-blue-50/30 to-transparent rounded-tr-full"></div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Note */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center px-6 py-3 bg-blue-50 border border-blue-200 rounded-full">
                <span className="text-blue-600 text-sm font-medium">
                  💡 Start with the free plan and upgrade when you need more features!
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Got Questions?
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about our pricing and plans
              </p>
            </div>

            <div className="grid gap-6">
              <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Can I change my plan at any time?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                  Can I stay on the free plan forever?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Absolutely! The free plan is available forever with no time limits. You can upgrade to Pro or Enterprise anytime to unlock additional features.
                </p>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.
                </p>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  Is there a setup fee for Enterprise plans?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  No setup fees! Enterprise pricing is transparent and includes all implementation costs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to take control of your finances?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of users who trust us with their financial management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                variant="secondary"
                size="lg"
                className="px-8 py-3 text-base font-semibold rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Free Trial
              </Button>
              <Button
                onClick={handleContactUs}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-base font-semibold rounded-3xl border-white text-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Pricing;
