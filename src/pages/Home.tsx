import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight, Users, CreditCard, DollarSign, BarChart3, PieChart, Smartphone, Globe, Zap, Shield, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-background py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight text-foreground">
                Maximize <span className="text-neon-yellow">💰</span>
                <br />
                Your Financial
                <br />
                <span className="text-neon-lime">Potential</span>
              </h1>
              <p className="font-body text-xl md:text-2xl mb-8 text-muted-foreground">
                All-in-one Financial Analytics Dashboard
              </p>
              <Button variant="default" size="lg" className="bg-charcoal text-off-white hover:bg-charcoal-light rounded-full px-8">
                Get Started
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">My Balance</span>
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-charcoal">$9,823.28</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <div className="w-8 h-8 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-white text-sm">+12%</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <div className="w-8 h-8 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-white text-sm">Analytics</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <div className="w-8 h-8 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-white text-sm">Growth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-neon-yellow fill-current" />
                <Star className="w-5 h-5 text-neon-yellow fill-current" />
                <Star className="w-5 h-5 text-neon-yellow fill-current" />
                <Star className="w-5 h-5 text-neon-yellow fill-current" />
                <Star className="w-5 h-5 text-neon-yellow fill-current" />
              </div>
              <div className="text-2xl font-bold text-foreground">4.8</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">4.9</div>
              <div className="text-sm text-muted-foreground">App Store</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">4.8</div>
              <div className="text-sm text-muted-foreground">Google Play</div>
            </div>
          </div>
        </div>
      </section>

      {/* Empower Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
              <span className="text-neon-lime">Empower</span> Your Financial
              <br />
              Future with us
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 mb-4">
                <div className="text-3xl font-bold text-charcoal mb-2">$9,823.28</div>
                <div className="text-sm text-muted-foreground">Total Balance</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                    <PieChart className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-heading font-bold text-3xl text-foreground mb-6">
                Comprehensive
                <br />
                Financial Analytics
                <br />
                Dashboard
              </h3>
              <p className="font-body text-lg text-muted-foreground mb-8">
                Get real-time insights into your financial health with our comprehensive analytics dashboard that tracks all your accounts in one place.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-neon-lime rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="font-body text-foreground">Real-time financial tracking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-neon-lime rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="font-body text-foreground">Advanced analytics and insights</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-neon-lime rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="font-body text-foreground">Multi-account management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Track Expenses Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-heading font-bold text-4xl text-foreground mb-6">
                <span className="text-neon-lime">Track</span> Your all the
                <br />
                Expense Easily
              </h3>
              <p className="font-body text-lg text-muted-foreground mb-8">
                Monitor your spending patterns and identify opportunities to save with our intuitive expense tracking system.
              </p>
              <Button variant="default" size="lg" className="bg-charcoal text-off-white hover:bg-charcoal-light rounded-full px-8">
                Get Started
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 mb-4">
                  <div className="text-3xl font-bold text-charcoal mb-2">$50</div>
                  <div className="text-sm text-muted-foreground">Today's Spending</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="w-8 h-8 bg-white rounded-full mb-2 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-white text-sm">Shopping</div>
                    <div className="text-white font-bold">$30</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="w-8 h-8 bg-white rounded-full mb-2 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-white text-sm">Food</div>
                    <div className="text-white font-bold">$20</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Send Money Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
              <span className="text-neon-lime">Send Money</span> Across
              <br />
              the Globe
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              Transfer money instantly to anywhere in the world with our secure and reliable global payment system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Send USD Currency
                </h3>
                <p className="font-body text-muted-foreground">
                  Send US dollars to over 180 countries worldwide with competitive exchange rates.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Convert USD Currency
                </h3>
                <p className="font-body text-muted-foreground">
                  Convert your USD to any major currency with real-time exchange rates.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Unlimited Transactions
                </h3>
                <p className="font-body text-muted-foreground">
                  Make unlimited transactions with no hidden fees or monthly limits.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achieve Excellence Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl p-8 shadow-2xl transform rotate-3">
                <div className="bg-white rounded-2xl p-6">
                  <div className="text-2xl font-bold text-charcoal mb-2">Financial Excellence</div>
                  <div className="text-sm text-muted-foreground">Your Success Story</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-heading font-bold text-4xl text-foreground mb-6">
                <span className="text-neon-lime">Achieve Financial</span>
                <br />
                Excellence
              </h3>
              <p className="font-body text-lg text-muted-foreground mb-8">
                Take control of your financial future with our comprehensive suite of tools designed for success.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-neon-lime rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="font-body text-foreground">Smart budget planning and forecasting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-neon-lime rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="font-body text-foreground">Investment tracking and analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-neon-lime rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="font-body text-foreground">Personalized financial insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-heading font-bold text-4xl text-foreground mb-6">
                <span className="text-neon-lime">Integrate</span> With Your
                <br />
                Favorite Tools
              </h3>
              <p className="font-body text-lg text-muted-foreground mb-8">
                Connect with all your favorite financial tools and platforms for a seamless experience.
              </p>
              <Button variant="default" size="lg" className="bg-charcoal text-off-white hover:bg-charcoal-light rounded-full px-8">
                Explore Integrations
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-charcoal to-charcoal-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 mb-4">
                  <div className="text-3xl font-bold text-charcoal mb-2">$50</div>
                  <div className="text-sm text-muted-foreground">Ready to start?</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-heading font-bold text-4xl text-off-white mb-6">
                Ready to Run your
                <br />
                Business Better with us
              </h3>
              <p className="font-body text-lg text-grey-muted mb-8">
                Join thousands of businesses that trust our platform for their financial management needs.
              </p>
              <div className="flex gap-4">
                <Button variant="default" size="lg" className="bg-neon-lime text-charcoal hover:bg-neon-yellow rounded-full px-8">
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-off-white text-off-white hover:bg-off-white hover:text-charcoal rounded-full px-8">
                  Watch a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;