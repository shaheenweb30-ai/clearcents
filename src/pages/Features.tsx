import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, BarChart3, Settings, FileText, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: Target,
      title: "Guided Budget Setup",
      description: "Get started in minutes with our intuitive budget creation wizard. We'll walk you through setting up categories, allocating funds, and establishing your financial goals step by step.",
      benefits: [
        "Zero-based budgeting methodology",
        "Smart category suggestions",
        "Goal-setting assistance",
        "Personalized recommendations"
      ]
    },
    {
      icon: BarChart3,
      title: "Easy Expense Tracking",
      description: "Log your expenses quickly with our streamlined interface. No complex categorization or confusing workflows—just simple, effective tracking that fits into your daily routine.",
      benefits: [
        "Quick manual entry",
        "Intuitive categorization",
        "Real-time budget updates",
        "Mobile-optimized interface"
      ]
    },
    {
      icon: Settings,
      title: "Flexible Budget Adjustments",
      description: "Life happens, and your budget should adapt. Make real-time adjustments to categories, move money between buckets, and keep your budget realistic and achievable.",
      benefits: [
        "Instant budget modifications",
        "Money reallocation tools",
        "Overspending alerts",
        "Budget optimization suggestions"
      ]
    },
    {
      icon: FileText,
      title: "Simple Reports That Matter",
      description: "Get clear insights into your spending patterns with reports that actually help you make better financial decisions. No overwhelming charts—just the information you need.",
      benefits: [
        "Clear spending summaries",
        "Category performance tracking",
        "Progress towards goals",
        "Actionable insights"
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy-light to-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
            Everything you need to manage your budget
          </h1>
          <p className="font-body text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            — and nothing you don't.
          </p>
          <p className="font-body text-lg text-blue-300 max-w-2xl mx-auto">
            ClearCents focuses on the essentials of budgeting, giving you powerful tools without overwhelming complexity.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {features.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <feature.icon className="w-16 h-16 text-navy mb-6" />
                  <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy mb-4">
                    {feature.title}
                  </h2>
                  <p className="font-body text-lg text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-mint rounded-full"></div>
                        <span className="font-body text-navy">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <Card className="border-2 border-mint-light shadow-xl">
                    <CardContent className="p-8">
                      <div className="bg-gradient-to-br from-mint-light to-mint rounded-xl p-6 mb-6">
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-heading font-semibold text-lg text-navy">
                              {feature.title === "Guided Budget Setup" && "Budget Categories"}
                              {feature.title === "Easy Expense Tracking" && "Recent Expenses"}
                              {feature.title === "Flexible Budget Adjustments" && "Budget Overview"}
                              {feature.title === "Simple Reports That Matter" && "Monthly Report"}
                            </h3>
                            <feature.icon className="w-6 h-6 text-navy" />
                          </div>
                          {feature.title === "Guided Budget Setup" && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Housing</span>
                                <span className="font-semibold text-navy">$1,200</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Groceries</span>
                                <span className="font-semibold text-navy">$400</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Transportation</span>
                                <span className="font-semibold text-navy">$300</span>
                              </div>
                            </div>
                          )}
                          {feature.title === "Easy Expense Tracking" && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Coffee Shop</span>
                                <span className="font-semibold text-navy">-$4.50</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Grocery Store</span>
                                <span className="font-semibold text-navy">-$67.23</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Gas Station</span>
                                <span className="font-semibold text-navy">-$45.00</span>
                              </div>
                            </div>
                          )}
                          {feature.title === "Flexible Budget Adjustments" && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Available</span>
                                <span className="font-semibold text-mint">$127.50</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Allocated</span>
                                <span className="font-semibold text-navy">$2,872.50</span>
                              </div>
                              <div className="w-full bg-mint-light rounded-full h-2">
                                <div className="bg-mint h-2 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                            </div>
                          )}
                          {feature.title === "Simple Reports That Matter" && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Spent</span>
                                <span className="font-semibold text-navy">$2,456</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Budget Goal</span>
                                <span className="font-semibold text-mint">$2,500</span>
                              </div>
                              <div className="text-center mt-3">
                                <span className="text-xs text-mint font-semibold">On Track!</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-mint to-mint-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-navy mb-6">
            Ready to take control of your finances?
          </h2>
          <p className="font-body text-xl text-navy-light mb-8">
            Join thousands of users who have simplified their budgeting with ClearCents.
          </p>
          <Link to="/signup">
            <Button variant="hero" size="xl">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Features;