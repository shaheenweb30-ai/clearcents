import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const FinalCTA = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-400 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-400 rounded-full opacity-20 animate-pulse"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
          <Sparkles className="w-4 h-4" />
          Start Your Journey
        </div>
        
        {/* Main Headline */}
        <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
          Start free—upgrade when you're
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {" "}ready
          </span>
        </h2>

        {/* CTA Button */}
        <div className="flex justify-center mb-8">
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>No credit card required for free plan</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>14-day free trial on Pro</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};
