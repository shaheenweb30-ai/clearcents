import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Save, ArrowLeft, Edit } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export default function AdminFAQ() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const fetchFAQs = async () => {
    try {
      // For now, we'll use a mock FAQ structure since the table doesn't exist yet
      // You can implement this when you create the FAQ table
      setFaqs([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSaveFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    try {
      // TODO: Implement FAQ saving logic when table is created
      toast.success('FAQ functionality coming soon!');
      setNewFaq({ question: '', answer: '' });
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to save FAQ');
    }
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">You don't have permission to access this page.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/settings" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Manage FAQ</h1>
          <p className="text-muted-foreground mt-2">
            Manage frequently asked questions for your pricing page
          </p>
        </div>

        {/* Add New FAQ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add New FAQ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                placeholder="Enter the question"
              />
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                placeholder="Enter the answer"
                rows={4}
              />
            </div>
            <Button onClick={handleSaveFaq} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save FAQ
            </Button>
          </CardContent>
        </Card>

        {/* FAQ List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading FAQs...</p>
            ) : faqs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No FAQs found</p>
                <Badge variant="outline">FAQ functionality will be implemented when needed</Badge>
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{faq.question}</h3>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}