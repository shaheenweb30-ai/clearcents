import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone,
  Video,
  FileText,
  Lightbulb,
  Star,
  ArrowRight,
  ExternalLink,
  Play,
  Download
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface HelpArticle {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  url: string;
}

const Help = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock FAQ data
  const faqData: FAQItem[] = [
    {
      question: "How do I add a new transaction?",
      answer: "To add a new transaction, go to the Transactions page and click the 'Add Transaction' button. Fill in the amount, category, date, and description, then click 'Save'.",
      category: "transactions"
    },
    {
      question: "Can I export my data?",
      answer: "Yes! You can export your data in various formats including CSV, PDF, and Excel. Go to the Reports page and use the 'Export' button to download your financial data.",
      category: "data"
    },
    {
      question: "How do I set up a budget?",
      answer: "Navigate to the Budget page and click 'Create Budget'. Set your monthly spending limits for each category and save your budget. You can track your progress throughout the month.",
      category: "budget"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. You can update your payment method in the Subscription settings.",
      category: "billing"
    },
    {
      question: "How do I categorize my expenses?",
      answer: "You can create custom categories in the Categories page. When adding transactions, you'll be able to select from your existing categories or create new ones on the fly.",
      category: "categories"
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use bank-level encryption to protect your financial data. All data is encrypted in transit and at rest, and we never share your personal information with third parties.",
      category: "security"
    }
  ];

  // Mock help articles
  const helpArticles: HelpArticle[] = [
    {
      title: "Getting Started with ClearCents",
      description: "Learn the basics of setting up your account and tracking your first transactions.",
      category: "getting-started",
      difficulty: "beginner",
      readTime: "5 min read",
      url: "#"
    },
    {
      title: "Creating and Managing Budgets",
      description: "A comprehensive guide to setting up budgets and tracking your spending goals.",
      category: "budgeting",
      difficulty: "intermediate",
      readTime: "8 min read",
      url: "#"
    },
    {
      title: "Understanding Your Financial Reports",
      description: "Learn how to interpret your financial reports and gain insights from your data.",
      category: "reports",
      difficulty: "intermediate",
      readTime: "10 min read",
      url: "#"
    },
    {
      title: "Advanced Category Management",
      description: "Master the art of organizing your expenses with custom categories and tags.",
      category: "categories",
      difficulty: "advanced",
      readTime: "12 min read",
      url: "#"
    },
    {
      title: "Exporting and Backing Up Your Data",
      description: "Learn how to export your financial data and create backups for safekeeping.",
      category: "data",
      difficulty: "intermediate",
      readTime: "6 min read",
      url: "#"
    },
    {
      title: "Security Best Practices",
      description: "Essential security tips to keep your financial information safe and secure.",
      category: "security",
      difficulty: "beginner",
      readTime: "4 min read",
      url: "#"
    }
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/login");
        } else if (session) {
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const filteredFAQs = faqData.filter(faq => 
    (selectedCategory === "all" || faq.category === selectedCategory) &&
    (searchQuery === "" || 
     faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredArticles = helpArticles.filter(article =>
    (selectedCategory === "all" || article.category === selectedCategory) &&
    (searchQuery === "" || 
     article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     article.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Beginner</Badge>;
      case 'intermediate':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Intermediate</Badge>;
      case 'advanced':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Advanced</Badge>;
      default:
        return <Badge variant="secondary">{difficulty}</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading help center...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="space-y-6 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                Help Center
              </h1>
              <p className="text-muted-foreground mt-1 font-body">
                Find answers to your questions and learn how to use ClearCents effectively
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, FAQs, or guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Getting Started</TabsTrigger>
              <TabsTrigger value="faq">Help & FAQ</TabsTrigger>
              <TabsTrigger value="guides">Tutorials</TabsTrigger>
              <TabsTrigger value="contact">Support</TabsTrigger>
            </TabsList>

            {/* Getting Started Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Documentation</h3>
                        <p className="text-sm text-muted-foreground">Comprehensive guides</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Video className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Video Tutorials</h3>
                        <p className="text-sm text-muted-foreground">Step-by-step videos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-sm text-muted-foreground">Get instant help</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Popular Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Popular Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {helpArticles.slice(0, 4).map((article, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{article.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
                            <div className="flex items-center space-x-2">
                              {getDifficultyBadge(article.difficulty)}
                              <span className="text-xs text-muted-foreground">{article.readTime}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Getting Started */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5" />
                    <span>Getting Started</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">1</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Set up your account</h4>
                        <p className="text-sm text-muted-foreground">Complete your profile and preferences</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">2</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Add your first transaction</h4>
                        <p className="text-sm text-muted-foreground">Start tracking your income and expenses</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">3</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Create your first budget</h4>
                        <p className="text-sm text-muted-foreground">Set spending limits and track your progress</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Help & FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5" />
                    <span>Frequently Asked Questions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="transactions">Transactions</SelectItem>
                          <SelectItem value="budget">Budget</SelectItem>
                          <SelectItem value="categories">Categories</SelectItem>
                          <SelectItem value="data">Data & Export</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {filteredFAQs.length === 0 && (
                      <div className="text-center py-8">
                        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No FAQs found matching your search.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="guides" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Help Articles & Guides</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="getting-started">Getting Started</SelectItem>
                          <SelectItem value="budgeting">Budgeting</SelectItem>
                          <SelectItem value="reports">Reports</SelectItem>
                          <SelectItem value="categories">Categories</SelectItem>
                          <SelectItem value="data">Data Management</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredArticles.map((article, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium">{article.title}</h4>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getDifficultyBadge(article.difficulty)}
                              <span className="text-xs text-muted-foreground">{article.readTime}</span>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredArticles.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No articles found matching your search.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>Get in Touch</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">support@clearcents.com</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-muted-foreground">Available 24/7</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center">
                      <h4 className="font-medium mb-2">Response Times</h4>
                      <div className="space-y-2 text-sm">
                        <p>Email: Within 24 hours</p>
                        <p>Phone: Immediate</p>
                        <p>Live Chat: Instant</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span>Send us a Message</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea 
                        className="w-full p-3 border rounded-lg resize-none" 
                        rows={4}
                        placeholder="Describe your issue or question..."
                      />
                    </div>

                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Help; 