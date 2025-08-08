import { Clock, Target, Brain, Globe, Sparkles, Zap, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FEATURE_PILLARS = [
  {
    id: 'tracking',
    title: 'Real-time Tracking',
    body: 'Every expense, always up to date.',
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'budgets',
    title: 'Smart Budgets',
    body: 'Monthly, weekly, or custom periods—auto-refresh.',
    icon: Target,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    id: 'insights',
    title: 'AI Insights',
    body: 'Specific, timely suggestions that save money.',
    icon: Brain,
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: 'currency',
    title: 'Multi-Currency',
    body: '100+ currencies with live FX when needed.',
    icon: Globe,
    color: 'text-orange-600 dark:text-orange-400'
  }
];

export function FeaturePillars() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-24 h-24 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <Sparkles className="w-4 h-4" />
            Core Features
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Designed to keep you
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              on budget
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features that work together to give you complete control over your finances
          </p>
        </div>
        
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURE_PILLARS.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200/50 relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <IconComponent className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                {/* Content */}
                <h3 className="font-bold text-2xl text-gray-900 mb-4 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed relative z-10">
                  {feature.body}
                </p>
                
                {/* Learn More Link */}
                <Link to="/signup" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-1 transition-transform duration-300 relative z-10">
                  Learn more
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            );
          })}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-200">
            <span className="text-gray-600 font-medium">Ready to get started?</span>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
