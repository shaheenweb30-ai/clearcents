import { useHomepageContent } from "@/hooks/useHomepageContent";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, CreditCard, DollarSign, BarChart3, PieChart, Globe } from "lucide-react";
import Layout from "@/components/Layout";

export function DynamicHomepage() {
  const { content, loading, getContentBySection } = useHomepageContent();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  const heroContent = getContentBySection('hero');
  const empowerContent = getContentBySection('empower');
  const trackExpensesContent = getContentBySection('track-expenses');
  const sendMoneyContent = getContentBySection('send-money');
  const achieveExcellenceContent = getContentBySection('achieve-excellence');
  const integrationsContent = getContentBySection('integrations');
  const finalCtaContent = getContentBySection('final-cta');

  return (
    <Layout>
      {/* Hero Section */}
      <AdminContentWrapper sectionId="hero" className="relative bg-background py-20 overflow-hidden">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight text-foreground">
                  {heroContent?.title || 'Maximize 💰 Your Financial Potential'}
                </h1>
                <p className="font-body text-xl md:text-2xl mb-8 text-muted-foreground">
                  {heroContent?.subtitle || 'All-in-one Financial Analytics Dashboard'}
                </p>
                {heroContent?.button_text && (
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full px-8"
                    style={{
                      backgroundColor: heroContent.button_color || '#500CB0',
                      color: heroContent.button_text_color || '#FFFFFF'
                    }}
                  >
                    {heroContent.button_text}
                  </Button>
                )}
              </div>
              <div className="relative">
                {heroContent?.image_url && (
                  <img 
                    src={heroContent.image_url} 
                    alt="Financial dashboard with subscription management" 
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

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
      <AdminContentWrapper sectionId="empower" className="py-20 bg-background">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
                {empowerContent?.title || 'Empower Your Financial Future with us'}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                {empowerContent?.image_url && (
                  <img 
                    src={empowerContent.image_url} 
                    alt="Comprehensive Financial Analytics Dashboard" 
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                )}
              </div>
              <div>
                <h3 className="font-heading font-bold text-3xl text-foreground mb-6">
                  {empowerContent?.subtitle || 'Comprehensive Financial Analytics Dashboard'}
                </h3>
                <p className="font-body text-lg text-muted-foreground mb-8">
                  {empowerContent?.description || 'Gain real-time visibility into your financial performance with intuitive dashboards.'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                      <span className="text-xs text-background">✓</span>
                    </div>
                    <span className="font-body text-foreground">Keep tracking balance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                      <span className="text-xs text-background">✓</span>
                    </div>
                    <span className="font-body text-foreground">Send money easily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                      <span className="text-xs text-background">✓</span>
                    </div>
                    <span className="font-body text-foreground">Receive money easily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                      <span className="text-xs text-background">✓</span>
                    </div>
                    <span className="font-body text-foreground">Convert currency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Track Expenses Section */}
      <AdminContentWrapper sectionId="track-expenses" className="py-20 bg-background">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-heading font-bold text-4xl text-foreground mb-6">
                  {trackExpensesContent?.title || 'Track Your all the Expense Easily'}
                </h3>
                <p className="font-body text-lg text-muted-foreground mb-8">
                  {trackExpensesContent?.description || 'Effortlessly monitor and manage all your expenses with our intuitive tracking system.'}
                </p>
                {trackExpensesContent?.button_text && (
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full px-8"
                    style={{
                      backgroundColor: trackExpensesContent.button_color || '#500CB0',
                      color: trackExpensesContent.button_text_color || '#FFFFFF'
                    }}
                  >
                    {trackExpensesContent.button_text}
                  </Button>
                )}
              </div>
              <div className="relative">
                {trackExpensesContent?.image_url && (
                  <img 
                    src={trackExpensesContent.image_url} 
                    alt="Expense tracking dashboard with pie chart and subscription management" 
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Send Money Section */}
      <AdminContentWrapper sectionId="send-money" className="py-20 bg-background">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
                {sendMoneyContent?.title || 'Send Money Across the Globe'}
              </h2>
              <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
                {sendMoneyContent?.description || 'Transfer money instantly to anywhere in the world with our secure and reliable global payment system.'}
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
      </AdminContentWrapper>

      {/* Achieve Excellence Section */}
      <AdminContentWrapper sectionId="achieve-excellence" className="py-20 bg-background">
        <section>
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
                  {achieveExcellenceContent?.title || 'Achieve Financial Excellence'}
                </h3>
                <p className="font-body text-lg text-muted-foreground mb-8">
                  {achieveExcellenceContent?.description || 'Take control of your financial future with our comprehensive suite of tools designed for success.'}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="font-body text-foreground">Smart budget planning and forecasting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="font-body text-foreground">Investment tracking and analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="font-body text-foreground">Personalized financial insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Integration Section */}
      <AdminContentWrapper sectionId="integrations" className="py-20 bg-background">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-heading font-bold text-4xl text-foreground mb-6">
                  {integrationsContent?.title || 'Integrate With Your Favorite Tools'}
                </h3>
                <p className="font-body text-lg text-muted-foreground mb-8">
                  {integrationsContent?.description || 'Connect with all your favorite financial tools and platforms for a seamless experience.'}
                </p>
                {integrationsContent?.button_text && (
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full px-8"
                    style={{
                      backgroundColor: integrationsContent.button_color || '#500CB0',
                      color: integrationsContent.button_text_color || '#FFFFFF'
                    }}
                  >
                    {integrationsContent.button_text}
                  </Button>
                )}
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
      </AdminContentWrapper>

      {/* Final CTA Section */}
      <AdminContentWrapper sectionId="final-cta" className="py-20 bg-gradient-to-br from-charcoal to-charcoal-light">
        <section>
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
                <h3 className="font-heading font-bold text-4xl text-white mb-6">
                  {finalCtaContent?.title || 'Ready to Run your Business Better with us'}
                </h3>
                <p className="font-body text-lg text-gray-300 mb-8">
                  {finalCtaContent?.description || 'Join thousands of businesses that trust our platform for their financial management needs.'}
                </p>
                <div className="flex gap-4">
                  {finalCtaContent?.button_text && (
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="rounded-full px-8"
                      style={{
                        backgroundColor: finalCtaContent.button_color || '#500CB0',
                        color: finalCtaContent.button_text_color || '#FFFFFF'
                      }}
                    >
                      {finalCtaContent.button_text}
                    </Button>
                  )}
                  <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-charcoal rounded-full px-8">
                    Watch a Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>
    </Layout>
  );
}