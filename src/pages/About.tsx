import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Users, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Clarity",
      description: "We sha financial management should be crystal clear. No jargon, no confusion—just simple tools that work."
    },
    {
      icon: Users,
      title: "Empowerment",
      description: "Everyone deserves to feel confident about their money. We build tools that help you take control of your financial future."
    },
    {
      icon: Heart,
      title: "Simplicity",
      description: "Budgeting doesn't have to be complicated. We focus on what matters most, keeping everything simple and effective."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
            Why we built FinSuite
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/80 mb-8">
            Making budgeting simple and stress-free for everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 font-body text-lg text-muted-foreground">
                <p>
                  We started FinSuite because we were frustrated with existing budgeting tools. They were either too complicated, too expensive, or missing key features that real people actually need.
                </p>
                <p>
                  After trying countless apps and spreadsheets, we realized that the best budgeting system is the one you'll actually use. That's why we built FinSuite around the proven zero-based budgeting method, but made it simple enough for anyone to understand and use.
                </p>
                <p>
                  Today, thousands of people use FinSuite to take control of their finances, reduce stress, and build a better financial future. We're proud to be part of their journey.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-2">Our Mission</h3>
                  <p className="font-body text-muted-foreground">
                    To make budgeting accessible, effective, and stress-free for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Our Values
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at FinSuite.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-2 border-transparent hover:border-primary/20 shadow-lg hover:shadow-xl transition-all text-center group">
                <CardContent className="p-8">
                  <value.icon className="w-16 h-16 text-primary mx-auto mb-6 group-hover:text-primary/80 transition-colors" />
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
                    {value.title}
                  </h3>
                  <p className="font-body text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-heading font-bold text-5xl text-primary mb-2">10K+</div>
              <div className="font-body text-lg text-muted-foreground">Happy Users</div>
            </div>
            <div>
              <div className="font-heading font-bold text-5xl text-primary mb-2">$2M+</div>
              <div className="font-body text-lg text-muted-foreground">Budgets Managed</div>
            </div>
            <div>
              <div className="font-heading font-bold text-5xl text-primary mb-2">98%</div>
              <div className="font-body text-lg text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Built by a small, passionate team
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              We're a tight-knit group of designers, developers, and financial enthusiasts who believe in making budgeting better for everyone.
            </p>
          </div>
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-primary to-primary/80 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
                We're hiring!
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                Want to help us make budgeting better for millions of people? We're always looking for talented individuals who share our passion for simplicity and financial empowerment.
              </p>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                View Open Positions
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-800 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6">
            Join us and take control of your money today
          </h2>
          <p className="font-body text-xl text-white/80 mb-8">
            Become part of a community that believes in financial clarity and empowerment.
          </p>
          <Link to="/signup">
            <Button 
              variant="default" 
              size="lg"
              className="rounded-full px-8 py-3 bg-white text-indigo-800 hover:bg-white/90"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
