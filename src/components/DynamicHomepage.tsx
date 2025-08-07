import { useOptimizedHomepageContent } from "@/hooks/useOptimizedHomepageContent";
import { useDynamicTranslations } from "@/hooks/useDynamicTranslations";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { PageManager } from "@/components/admin/PageManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, CreditCard, DollarSign, BarChart3, PieChart, Globe, Shield } from "lucide-react";
import Layout from "@/components/Layout";
import { useTranslation } from "react-i18next";
export function DynamicHomepage() {
  const { t } = useTranslation();
  const {
    content,
    loading,
    error,
    getContentBySection
  } = useOptimizedHomepageContent();
  
  const {
    getContentWithFallback
  } = useDynamicTranslations();
  
  if (loading) {
    return <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">{t('common.loading')}</div>
        </div>
      </Layout>;
  }
  
  if (error) {
    return <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              ClearCents
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {t('home.hero.subtitle')}
            </p>
            <div className="text-sm text-muted-foreground">
              Data loading error - showing default content
            </div>
          </div>
        </div>
      </Layout>;
  }
  const heroContent = getContentBySection('hero');
  const empowerContent = getContentBySection('empower');
  const trackExpensesContent = getContentBySection('track-expenses');
  const integrationsContent = getContentBySection('integrations');
  const finalCtaContent = getContentBySection('final-cta');
  const mainCtaContent = getContentBySection('main-cta');
  const liveChatContent = getContentBySection('live-chat');
  const watchDemoContent = getContentBySection('watch-demo');
  const smartBudgetingContent = getContentBySection('smart-budgeting');
  const expenseTrackingContent = getContentBySection('expense-tracking');
  const analyticsContent = getContentBySection('analytics');
  const securityContent = getContentBySection('security');
  return <Layout>
      {/* Hero Section */}
      <AdminContentWrapper sectionId="hero" className="relative bg-background py-6 overflow-hidden">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 lg:space-y-8">
                {/* Small purple label */}
                <AdminContentWrapper sectionId="hero-label" className="inline-flex items-center px-3 py-1 bg-purple-100 rounded-full">
                  <span className="text-sm font-medium text-purple-800">
                    {heroContent?.description || 'Finance Solutions for You'}
                  </span>
                </AdminContentWrapper>
                
                {/* Main headline with highlighted text and graphic */}
                <div className="relative">
                  <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight pr-16" style={{
                    color: heroContent?.title_color || '#000000'
                  }}>
                    {heroContent?.title || 'Complete Financial Control'}
                  </h1>
                  {/* Graphic icon with overlapping circles positioned to the right */}
                  <div className="absolute top-0 right-0">
                    <div className="w-12 h-12 bg-green-400 rounded-full absolute -top-2 -right-2 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Subtitle */}
                <p className="font-body text-lg md:text-xl lg:text-2xl" style={{
                  color: heroContent?.subtitle_color || '#000000'
                }}>
                  {heroContent?.subtitle || 'Track expenses, send money globally, and manage subscriptions all in one place'}
                </p>
                
                {/* CTA Button */}
                {heroContent?.button_text && (
                  <Button variant="default" size="lg" className="rounded-full px-8">
                    {heroContent.button_text}
                  </Button>
                )}
              </div>
              
              {/* Right side - App Interface Mockup */}
              <div className="relative">
                <div className="bg-gray-100 rounded-3xl p-6 shadow-2xl max-w-md mx-auto">
                  {/* Window controls */}
                  <div className="flex space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  
                  {/* Subscription Cards */}
                  <div className="space-y-3 mb-6">
                    {/* Netflix Card */}
                    <div className="bg-gray-200 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold">N</div>
                        <div>
                          <div className="font-semibold">Netflix</div>
                          <div className="text-sm text-gray-600">$24 /month</div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <div className="w-4 h-4 bg-red-400 rounded-full flex items-center justify-center text-white text-xs">×</div>
                        <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                      </div>
                    </div>
                    
                    {/* Spotify Card */}
                    <div className="bg-blue-500 rounded-xl p-3 flex items-center justify-between transform rotate-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                        </div>
                        <div className="text-white">
                          <div className="font-semibold">Spotify</div>
                          <div className="text-sm opacity-90">$13 /month</div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <div className="w-4 h-4 bg-red-400 rounded-full flex items-center justify-center text-white text-xs">×</div>
                        <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Balance Section */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">My Balance</h3>
                    <div className="text-3xl font-bold text-gray-900">$9,823.28</div>
                    <div className="text-sm text-gray-600">You've made an extra $2,832.19 in this month.</div>
                  </div>
                  

                  
                  {/* Financial Chart */}
                  <div className="relative">
                    <div className="flex items-end space-x-1 h-16">
                      <div className="w-3 bg-gray-300 rounded-t h-4"></div>
                      <div className="w-3 bg-gray-300 rounded-t h-6"></div>
                      <div className="w-3 bg-gray-300 rounded-t h-3"></div>
                      <div className="w-3 bg-purple-500 rounded-t h-12 relative">
                        {/* Tooltip */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-1 py-0.5 rounded">
                          $4,239.12
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
                        </div>
                        <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"></div>
                      </div>
                      <div className="w-3 bg-gray-300 rounded-t h-7"></div>
                      <div className="w-3 bg-gray-300 rounded-t h-5"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>100K</span>
                      <span>125K</span>
                      <span>150K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Trust Indicators */}
      <section className="py-4 bg-gradient-to-br from-blue-50 to-indigo-50" style={{ height: '120px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="text-center mb-4">
            <h2 className="font-heading font-bold" style={{ fontSize: '18px' }}>
              <span className="text-blue-600">Trusted by</span> users across the platform
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            {/* Chrome Store */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                    <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900">Chrome store</div>
            </div>

            {/* Producthunt */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="text-2xl font-bold text-gray-900">4.9</div>
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">P</span>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900">Producthunt</div>
            </div>

            {/* Trustpilot */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900">Trustpilot</div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

      {/* Empower Section */}
      <section className="py-6 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
              <span className="text-blue-600">Empower</span> Your Financial Future with us
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Financial Dashboard UI Mockup */}
              <div className="relative">
                <div className="bg-gray-100 rounded-3xl p-6 shadow-2xl max-w-md mx-auto">
                  {/* Balance Display */}
                  <div className="bg-primary rounded-xl p-4 mb-4">
                    <div className="text-white">
                      <div className="font-semibold mb-2">Total Expenses</div>
                      <div className="text-2xl font-bold">$9,823.28</div>
                      <div className="text-sm opacity-90">You've spent an extra $2,493 this month.</div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">Send</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-7-7m7 7l7-7" />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">Receive</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">Convert</div>
                    </div>
                  </div>
                  
                  {/* Bar Chart */}
                  <div className="relative">
                    <div className="flex items-end space-x-2 h-20">
                      <div className="w-4 bg-gray-300 rounded-t h-6"></div>
                      <div className="w-4 bg-gray-300 rounded-t h-8"></div>
                      <div className="w-4 bg-gray-300 rounded-t h-4"></div>
                      <div className="w-4 bg-gradient-to-t from-green-400 to-purple-500 rounded-t h-16 relative">
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400 border-dashed"></div>
                      </div>
                      <div className="w-4 bg-gray-300 rounded-t h-10"></div>
                      <div className="w-4 bg-gray-300 rounded-t h-6"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0</span>
                      <span>25K</span>
                      <span>50K</span>
                      <span>75K</span>
                      <span>100K</span>
                      <span>125K</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Content */}
              <div>
                <h3 className="font-heading font-bold text-3xl mb-8">
                  Comprehensive Financial <span className="text-blue-600">Analytics</span> Dashboard
                </h3>
                <p className="font-body text-lg mb-10">
                  Gain real-time visibility into your financial performance with intuitive dashboards.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">100+ Countries</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">100+ Currencies</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">Real-time Analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">Bank-level Security</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-foreground">Keep tracking balance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-foreground">Send money easily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-foreground">Receive money easily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-foreground">Convert currency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

      {/* Track Expenses Section */}
      <AdminContentWrapper sectionId="track-expenses" className="py-6 bg-background">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="space-y-6 lg:space-y-8">
                  <h3 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-8">
                    {trackExpensesContent?.title || 'Track Your all the Expense Easily'}
                  </h3>
                  <p className="font-body text-lg text-muted-foreground">
                    {trackExpensesContent?.description || 'Effortlessly monitor and manage all your expenses with our intuitive tracking system.'}
                  </p>
                  {trackExpensesContent?.button_text && <Button variant="default" size="lg" className="rounded-full px-8"                 style={{
                  backgroundColor: trackExpensesContent.button_color || 'hsl(var(--primary))',
                  color: trackExpensesContent.button_text_color || 'hsl(var(--primary-foreground))'
                }}>
                      {trackExpensesContent.button_text}
                    </Button>}
                </div>
                <div className="relative">
                  {trackExpensesContent?.image_url && <img src={trackExpensesContent.image_url} alt="Expense tracking dashboard with pie chart and subscription management" className="w-full h-auto rounded-3xl shadow-2xl" />}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

      {/* Three Card CTA Section */}
      <AdminContentWrapper sectionId="main-cta" className="py-6 bg-white">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Main CTA Card - spans full width on mobile, takes up space on desktop */}
              <div className="lg:col-span-2 mb-8 lg:mb-12">
                <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
                  {/* Background mockups */}
                  <div className="absolute left-8 top-8 bottom-8 w-80 opacity-20">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <div className="space-y-4">
                        <div className="bg-white/30 rounded-2xl p-4 h-24">
                          <div className="text-xs opacity-80">Spotify</div>
                          <div className="text-sm">/month</div>
                        </div>
                        <div className="bg-white/30 rounded-2xl p-6 flex-1">
                          <div className="text-lg font-bold">$1,928.92</div>
                          <div className="text-xs opacity-80">Total Expense</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white/30 rounded-2xl p-4 h-32">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-black rounded-full"></div>
                            <div className="text-xs">iCloud</div>
                          </div>
                          <div className="text-lg font-bold">$50</div>
                          <div className="text-xs opacity-80">/month</div>
                        </div>
                        <div className="bg-white/30 rounded-2xl p-4 flex-1">
                          <div className="text-sm font-semibold mb-3">Add Friends</div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg">+</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 ml-auto max-w-xl">
                    <h2 className="font-heading font-bold text-4xl lg:text-5xl mb-6" style={{
                    color: mainCtaContent?.title_color || '#FFFFFF'
                  }}>
                      {mainCtaContent?.title || 'Ready to Run your Business Better with us'}
                    </h2>
                    <p className="font-body text-lg mb-10" style={{
                    color: mainCtaContent?.description_color || '#E0E7FF'
                  }}>
                      {mainCtaContent?.description || 'Welcome to FinSuite, where financial management meets simplicity and efficiency.'}
                    </p>
                    {mainCtaContent?.button_text && <Button variant="default" size="lg" className="rounded-full px-8 py-3"                     style={{
                    backgroundColor: mainCtaContent.button_color || 'hsl(var(--primary))',
                    color: mainCtaContent.button_text_color || 'hsl(var(--primary-foreground))'
                  }}>
                        {mainCtaContent.button_text}
                      </Button>}
                  </div>
                </div>
              </div>
              
              {/* Live Chat Card */}
              <AdminContentWrapper sectionId="live-chat" className="lg:col-span-1">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-8 text-white h-80 flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                        <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-3xl mb-4">
                      {liveChatContent?.title || 'Live Chat'}
                    </h3>
                    <p className="font-body text-purple-100 mb-6">
                      {liveChatContent?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    </p>
                  </div>
                  {liveChatContent?.button_text && <Button variant="outline" size="lg" className="rounded-full w-fit" style={{
                  borderColor: liveChatContent.button_text_color || '#FFFFFF',
                  color: liveChatContent.button_text_color || '#FFFFFF'
                }}>
                      {liveChatContent.button_text}
                    </Button>}
                </div>
              </AdminContentWrapper>
              
              {/* Watch Demo Card */}
              <AdminContentWrapper sectionId="watch-demo" className="lg:col-span-1">
                <div className="bg-gradient-to-br from-lime-400 to-green-500 rounded-3xl p-8 text-white h-80 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">$</span>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">€</span>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">£</span>
                    </div>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-3xl mb-4">
                      {watchDemoContent?.title || 'Watch a Demo'}
                    </h3>
                    <p className="font-body text-green-800 mb-6">
                      {watchDemoContent?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    </p>
                  </div>
                  {watchDemoContent?.button_text && <Button variant="outline" size="lg" className="rounded-full w-fit" style={{
                  borderColor: watchDemoContent.button_text_color || '#FFFFFF',
                  color: watchDemoContent.button_text_color || '#FFFFFF'
                }}>
                      {watchDemoContent.button_text}
                    </Button>}
                </div>
              </AdminContentWrapper>
            </div>
          </div>
        </section>
      </AdminContentWrapper>
      
      {/* Page Manager for Admins */}
      <PageManager />
    </Layout>;
}