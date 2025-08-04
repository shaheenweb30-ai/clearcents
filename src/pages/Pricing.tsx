import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const Pricing = () => {
  const features = [
    "Unlimited budgeting categories",
    "Unlimited manual transactions",
    "Cloud sync on all devices",
    "Full access to all features",
    "Budget tracking & adjustments",
    "Simple reports & insights",
    "Email support",
    "Cancel anytime"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy-light to-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
            Simple, transparent pricing
          </h1>
          <p className="font-body text-xl md:text-2xl text-blue-200 mb-4">
            One plan. All features. No surprises.
          </p>
          <p className="font-body text-lg text-blue-300 max-w-2xl mx-auto">
            We believe budgeting tools should be accessible to everyone. That's why we offer everything you need in one simple package.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-mint shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-mint to-gold"></div>
            <CardHeader className="text-center pb-6 pt-8">
              <div className="inline-block bg-mint text-navy px-4 py-1 rounded-full font-heading font-semibold text-sm mb-4">
                MOST POPULAR
              </div>
              <h2 className="font-heading font-bold text-3xl text-navy mb-2">
                ClearCents Monthly
              </h2>
              <div className="flex items-center justify-center mb-4">
                <span className="font-heading font-bold text-6xl text-navy">$9</span>
                <span className="font-body text-2xl text-muted-foreground ml-2">/month</span>
              </div>
              <p className="font-body text-lg text-muted-foreground">
                Everything you need to budget like a pro
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-mint flex-shrink-0" />
                    <span className="font-body text-navy">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="block">
                <Button variant="hero" size="xl" className="w-full">
                  Start Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Cancel anytime. No hidden fees.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-mint-light/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Everything you need to know about ClearCents pricing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-transparent hover:border-mint transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-navy mb-3">
                  Is there a free trial?
                </h3>
                <p className="font-body text-muted-foreground">
                  Yes! You can try ClearCents free for 14 days. No credit card required to start.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-transparent hover:border-mint transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-navy mb-3">
                  Can I cancel anytime?
                </h3>
                <p className="font-body text-muted-foreground">
                  Absolutely. Cancel your subscription anytime with just one click. No questions asked.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-transparent hover:border-mint transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-navy mb-3">
                  Do you offer refunds?
                </h3>
                <p className="font-body text-muted-foreground">
                  Yes, we offer a 30-day money-back guarantee if you're not completely satisfied.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-transparent hover:border-mint transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-navy mb-3">
                  Are there any hidden fees?
                </h3>
                <p className="font-body text-muted-foreground">
                  Never. What you see is what you pay. No setup fees, no transaction fees, no surprises.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-navy-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6">
            Start your financial journey today
          </h2>
          <p className="font-body text-xl text-blue-200 mb-8">
            Join thousands of users who have taken control of their finances with ClearCents.
          </p>
          <Link to="/signup">
            <Button variant="accent" size="xl">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;