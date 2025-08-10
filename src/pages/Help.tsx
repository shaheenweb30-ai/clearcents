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
  Download,
  Sparkles,
  Headphones,
  Clock,
  Shield,
  Zap,
  Users,
  Globe,
  MessageSquare
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
      answer: "Yes! You can export your data in various formats including CSV, PDF, and Excel. Go to the Dashboard page and use the 'Export' button to download your financial data.",
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">Loading help center...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Enhanced Header with Gradient Background */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-700 p-8 mb-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <HelpCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-heading font-bold text-white">
                    Help Center
                  </h1>
                  <p className="text-emerald-100 text-lg font-body">
                    Find answers to your questions and learn how to use ClearCents effectively
                  </p>
                </div>
              </div>

              {/* Enhanced Search Bar */}
              <div className="relative max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-emerald-200" />
                </div>
                <Input
                  placeholder="Search for help articles, FAQs, or guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white/20 border-white/30 text-white placeholder-emerald-200 focus:bg-white/30 focus:border-white/50 backdrop-blur-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <div className="px-3 py-1 bg-white/20 rounded-full text-xs text-emerald-100 backdrop-blur-sm">
                    Press ⌘K
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-1 rounded-xl shadow-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200">
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200">
                Help & FAQ
              </TabsTrigger>
              <TabsTrigger value="guides" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200">
                Tutorials
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200">
                Support
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Getting Started Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Enhanced Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-blue-200/50 dark:border-blue-800/30">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Documentation</h3>
                        <p className="text-sm text-muted-foreground">Comprehensive guides</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-emerald-200/50 dark:border-emerald-800/30">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Video Tutorials</h3>
                        <p className="text-sm text-muted-foreground">Step-by-step videos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-purple-200/50 dark:border-purple-800/30">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Live Chat</h3>
                        <p className="text-sm text-muted-foreground">Get instant help</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Popular Topics */}
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <CardTitle className="font-heading flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span>Popular Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {helpArticles.slice(0, 4).map((article, index) => (
                      <div key={index} className="p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 transition-all duration-200 shadow-sm hover:shadow-md group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{article.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                            <div className="flex items-center space-x-2">
                              {getDifficultyBadge(article.difficulty)}
                              <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{article.readTime}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Getting Started */}
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="border-b border-emerald-200/50 dark:border-emerald-700/30">
                  <CardTitle className="font-heading flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <span>Getting Started</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border border-emerald-200/50 dark:border-emerald-700/30 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900/50 hover:from-emerald-100/50 hover:to-emerald-50/50 dark:hover:from-emerald-900/30 dark:hover:to-emerald-950/20 transition-all duration-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">1</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Set up your account</h4>
                        <p className="text-sm text-muted-foreground">Complete your profile and preferences</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 shadow-sm hover:shadow-md">
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 p-4 border border-blue-200/50 dark:border-blue-700/30 rounded-xl bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900/50 hover:from-blue-100/50 hover:to-blue-50/50 dark:hover:from-blue-900/30 dark:hover:to-blue-950/20 transition-all duration-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">2</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Add your first transaction</h4>
                        <p className="text-sm text-muted-foreground">Start tracking your income and expenses</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 p-4 border border-purple-200/50 dark:border-purple-700/30 rounded-xl bg-gradient-to-r from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900/50 hover:from-purple-100/50 hover:to-purple-50/50 dark:hover:from-purple-900/30 dark:hover:to-purple-950/20 transition-all duration-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">3</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Create your first budget</h4>
                        <p className="text-sm text-muted-foreground">Set spending limits and track your progress</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md">
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Help & FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <CardTitle className="font-heading flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <span>Frequently Asked Questions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px] bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
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
                        <AccordionItem key={index} value={`item-${index}`} className="border border-slate-200/50 dark:border-slate-700/50 rounded-lg mb-3 data-[state=open]:bg-gradient-to-r data-[state=open]:from-blue-50/50 data-[state=open]:to-white dark:data-[state=open]:from-blue-950/20 dark:data-[state=open]:to-slate-900/50">
                          <AccordionTrigger className="text-left px-4 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="font-medium text-slate-800 dark:text-slate-100">{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {filteredFAQs.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <HelpCircle className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-muted-foreground text-lg">No FAQs found matching your search.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Tutorials Tab */}
            <TabsContent value="guides" className="space-y-6">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <CardTitle className="font-heading flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span>Help Articles & Guides</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px] bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
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
                        <div key={index} className="p-6 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50 hover:from-purple-50/50 hover:to-blue-50/50 dark:hover:from-purple-950/20 dark:hover:to-blue-950/20 group">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{article.title}</h4>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{article.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getDifficultyBadge(article.difficulty)}
                              <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{article.readTime}</span>
                            </div>
                            <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md">
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredArticles.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-muted-foreground text-lg">No articles found matching your search.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Support Tab */}
            <TabsContent value="contact" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Enhanced Contact Information */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-slate-900 border border-emerald-200/50 dark:border-emerald-800/30">
                  <CardHeader className="border-b border-emerald-200/50 dark:border-emerald-700/30">
                    <CardTitle className="font-heading flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <span>Get in Touch</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3 p-4 border border-emerald-200/50 dark:border-emerald-700/30 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900/50 hover:from-emerald-100/50 hover:to-emerald-50/50 dark:hover:from-emerald-900/30 dark:hover:to-emerald-950/20 transition-all duration-200">
                      <div className="p-2 bg-emerald-500 rounded-lg">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">Email Support</p>
                        <p className="text-sm text-muted-foreground">support@clearcents.com</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-emerald-200/50 dark:border-emerald-700/30 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900/50 hover:from-emerald-100/50 hover:to-emerald-50/50 dark:hover:from-emerald-900/30 dark:hover:to-emerald-950/20 transition-all duration-200">
                      <div className="p-2 bg-emerald-500 rounded-lg">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">Phone Support</p>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-emerald-200/50 dark:border-emerald-700/30 rounded-xl bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900/50 hover:from-emerald-100/50 hover:to-emerald-50/50 dark:hover:from-emerald-900/30 dark:hover:to-emerald-950/20 transition-all duration-200">
                      <div className="p-2 bg-emerald-500 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">Live Chat</p>
                        <p className="text-sm text-muted-foreground">Available 24/7</p>
                      </div>
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-emerald-200/50 dark:via-emerald-700/30 to-transparent" />

                    <div className="text-center p-4 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/30">
                      <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-100">Response Times</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-center space-x-2">
                          <Clock className="h-4 w-4 text-emerald-500" />
                          <p>Email: Within 24 hours</p>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Phone className="h-4 w-4 text-emerald-500" />
                          <p>Phone: Immediate</p>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <MessageSquare className="h-4 w-4 text-emerald-500" />
                          <p>Live Chat: Instant</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Contact Form */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-900 border border-blue-200/50 dark:border-blue-800/30">
                  <CardHeader className="border-b border-blue-200/50 dark:border-blue-700/30">
                    <CardTitle className="font-heading flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <span>Send us a Message</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Subject</label>
                      <Select>
                        <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-blue-200/50 dark:border-blue-700/30">
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
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Message</label>
                      <textarea 
                        className="w-full p-3 border border-blue-200/50 dark:border-blue-700/30 rounded-lg resize-none bg-white/80 dark:bg-slate-800/80 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 dark:focus:ring-blue-800/30 transition-all duration-200" 
                        rows={4}
                        placeholder="Describe your issue or question..."
                      />
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-3">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Support Resources */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <CardTitle className="font-heading flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <span>Additional Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-slate-200/50 dark:border-slate-700/30 rounded-xl bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50 hover:from-blue-50/50 hover:to-blue-100/50 dark:hover:from-blue-950/20 dark:hover:to-blue-900/20 transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100">Community Forum</h4>
                          <p className="text-sm text-muted-foreground">Connect with other users</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200/50 dark:border-slate-700/30 rounded-xl bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50 hover:from-emerald-50/50 hover:to-emerald-100/50 dark:hover:from-emerald-950/20 dark:hover:to-emerald-900/20 transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                          <Headphones className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100">Video Calls</h4>
                          <p className="text-sm text-muted-foreground">Schedule a screen share</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200/50 dark:border-slate-700/30 rounded-xl bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50 hover:from-purple-50/50 hover:to-purple-100/50 dark:hover:from-purple-950/20 dark:hover:to-purple-900/20 transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100">Security Center</h4>
                          <p className="text-sm text-muted-foreground">Learn about security</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help; 