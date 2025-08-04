import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, BarChart3, Settings, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import Layout from "@/components/Layout";

const Home = () => {
  const features = [
    {
      icon: Target,
      title: "Guided Budget Setup",
      description: "Get started in minutes with our step-by-step budget creation process."
    },
    {
      icon: BarChart3,
      title: "Easy Expense Tracking",
      description: "Track your spending manually with our simple, intuitive interface."
    },
    {
      icon: Settings,
      title: "Flexible Budget Adjustments",
      description: "Life changes, and so should your budget. Adjust on the fly with ease."
    },
    {
      icon: CheckCircle,
      title: "Simple Reports That Matter",
      description: "See your progress with clear, actionable insights that help you stay on track."
    }
  ];

  const steps = [
    { number: "01", title: "Sign up & set your goals", description: "Create your account and tell us about your financial goals." },
    { number: "02", title: "Give every cent a job", description: "Assign every dollar to a category using zero-based budgeting." },
    { number: "03", title: "Track & adjust with ease", description: "Log expenses and make adjustments as life happens." },
    { number: "04", title: "See your progress grow", description: "Watch your financial health improve with clear reports." }
  ];

  const benefits = [
    "Zero-based budgeting that actually works",
    "Easy to use, no learning curve",
    "Works everywhere you do",
    "No complicated pricing or hidden fees"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-light to-navy overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
                Every cent with purpose.
              </h1>
              <p className="font-body text-xl md:text-2xl mb-8 text-blue-100">
                Take control of your money with a simple budgeting tool that works.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button variant="accent" size="xl">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="outline" size="xl" className="border-2 border-white text-white hover:bg-white hover:text-navy bg-transparent">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="ClearCents budgeting app interface"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-navy mb-4">
              How It Works
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              Getting started with ClearCents is simple. Follow these four steps to take control of your finances.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="border-2 border-mint-light hover:border-mint transition-colors group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-navy text-white rounded-full flex items-center justify-center font-heading font-bold text-2xl mx-auto mb-4 group-hover:bg-navy-light transition-colors">
                    {step.number}
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-navy mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-mint-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-navy mb-4">
              Core Features
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your budget effectively, without the complexity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-transparent hover:border-mint shadow-lg hover:shadow-xl transition-all group">
                <CardContent className="p-8">
                  <feature.icon className="w-12 h-12 text-navy mb-4 group-hover:text-navy-light transition-colors" />
                  <h3 className="font-heading font-semibold text-2xl text-navy mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose ClearCents Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-navy mb-6">
                Why Choose ClearCents?
              </h2>
              <p className="font-body text-xl text-muted-foreground mb-8">
                We believe budgeting should be simple, effective, and stress-free. Here's what makes us different:
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-mint flex-shrink-0" />
                    <span className="font-body text-lg text-navy">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-mint to-mint-light rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 mb-6">
                  <h3 className="font-heading font-semibold text-xl text-navy mb-2">Monthly Budget</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-body text-muted-foreground">Groceries</span>
                      <span className="font-body font-semibold text-navy">$400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-muted-foreground">Transportation</span>
                      <span className="font-body font-semibold text-navy">$200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-muted-foreground">Entertainment</span>
                      <span className="font-body font-semibold text-navy">$150</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <p className="font-body text-navy font-semibold">Budget On Track!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-navy-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
            One simple plan. No hidden fees.
          </h2>
          <p className="font-body text-xl text-blue-200 mb-8">
            Start your journey to financial freedom today.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-2xl inline-block">
            <div className="text-center mb-6">
              <span className="font-heading font-bold text-5xl text-navy">$9</span>
              <span className="font-body text-xl text-muted-foreground">/month</span>
            </div>
            <Link to="/signup">
              <Button variant="hero" size="xl">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;