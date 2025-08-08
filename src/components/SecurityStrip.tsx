import { Shield, Lock, Eye, Download, Users, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const SECURITY_FEATURES = [
  {
    icon: Shield,
    label: 'AES-256 encryption',
    description: 'Bank-level security'
  },
  {
    icon: Lock,
    label: 'TLS in transit',
    description: 'Secure connections'
  },
  {
    icon: Eye,
    label: 'GDPR-ready',
    description: 'Privacy compliant'
  },
  {
    icon: Download,
    label: 'Data portability',
    description: 'Export anytime'
  },
  {
    icon: Users,
    label: 'Role-based access',
    description: 'Team permissions'
  }
];

export function SecurityStrip() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-24 h-24 bg-green-200 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-4">
            <Shield className="w-4 h-4" />
            Bank-Level Security
          </div>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Your data is
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              protected
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enterprise-grade security with privacy by design. Your financial data stays safe and private.
          </p>
        </div>
        
        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {SECURITY_FEATURES.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.label}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
        
        {/* Security Link */}
        <div className="text-center">
          <Link
            to="/security"
            className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-gray-700 font-medium">Learn more about our security</span>
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </Link>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-lg text-gray-900 mb-2">SOC 2 Compliant</h4>
            <p className="text-gray-600 text-sm">Annual security audits and certifications</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-lg text-gray-900 mb-2">Real-time Monitoring</h4>
            <p className="text-gray-600 text-sm">24/7 security monitoring and threat detection</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-lg text-gray-900 mb-2">Privacy First</h4>
            <p className="text-gray-600 text-sm">GDPR compliant with data minimization</p>
          </div>
        </div>
      </div>
    </section>
  );
}
