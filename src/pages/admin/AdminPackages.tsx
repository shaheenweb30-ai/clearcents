import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, DollarSign, FileText, Palette } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useOptimizedPricingContent } from '@/hooks/useOptimizedPricingContent';
import { toast } from 'sonner';

export default function AdminPackages() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const { content, getContentBySection, updateContent, loading } = useOptimizedPricingContent();
  const hasHydratedRef = useRef(false);

  const [plans, setPlans] = useState([
    {
      key: 'free',
      label: 'Free',
      title: '',
      description: 'Best for getting started.',
      price: '0',
      features: [
        'Real-time expense tracking',
        'Up to 10 categories',
        '1 budget',
        'AI insights (lite: 5 tips/mo)',
        'CSV import & export',
        'Multi-currency viewer',
        'Community support'
      ] as string[],
      buttonText: 'Current Plan',
      isPopular: false,
    },
    {
      key: 'pro',
      label: 'Pro',
      title: '',
      description: 'Everything you need, no add-ons.',
      price: '12',
      features: [
        'Unlimited categories & budgets',
        'AI insights (full: 50+ tips/mo)',
        'Recurring detection & alerts',
        'Custom periods & auto-refresh',
        'Receipt attachments (email-in beta)',
        'Priority email support',
        'Advanced analytics & reports',
        'Team collaboration features',
        'API access',
        'White-label options'
      ] as string[],
      buttonText: 'Upgrade to Pro',
      isPopular: true,
    },
    {
      key: 'enterprise',
      label: 'Enterprise',
      title: '',
      description: 'Custom solutions for large teams.',
      price: '29',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
        'Advanced security features',
        'Custom reporting',
        'On-premise deployment',
        'Training & onboarding'
      ] as string[],
      buttonText: 'Contact Sales',
      isPopular: false,
    }
  ]);

  const [saving, setSaving] = useState(false);

  // Load existing plan content per section
  useEffect(() => {
    if (!loading && !hasHydratedRef.current) {
      setPlans((prev) =>
        prev.map((plan) => {
          const section = getContentBySection(plan.key);
          if (!section) return plan;
          return {
            ...plan,
            title: section.title || plan.title,
            description: section.description || plan.description,
            price: (section.price ?? parseFloat(plan.price)).toString(),
            buttonText: section.button_text || plan.buttonText,
            features: section.features ?? plan.features,
            isPopular: section.is_popular ?? plan.isPopular,
          };
        })
      );
      hasHydratedRef.current = true;
    }
  }, [loading, content]);

  const handleSave = async () => {
    console.log('=== PACKAGE SAVE DEBUG ===');
    console.log('Plans:', plans);
    
    setSaving(true);
    try {
      for (const plan of plans) {
        const saveData: any = {
          title: plan.title,
          description: plan.description,
          button_text: plan.buttonText,
          price: parseFloat(plan.price) || 0,
          features: plan.features,
          is_popular: plan.isPopular,
        };
        console.log('Saving plan', plan.key, saveData);
        await updateContent(plan.key, saveData);
      }
      toast.success('Package configuration updated successfully!');
    } catch (error) {
      console.error('Error saving package config:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details
      });
      toast.error('Failed to save package configuration');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">You don't have permission to access this page.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/settings" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Package Configurator</h1>
          <p className="text-muted-foreground mt-2">
            Configure pricing package content and appearance
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {plans.map((plan, idx) => (
            <Card key={plan.key} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center"><Package className="w-5 h-5 mr-2" />{plan.label} Plan</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={plan.isPopular}
                      onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, isPopular: e.target.checked } : p))}
                    />
                    Mark as Most Popular
                  </label>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={plan.title}
                        onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, title: e.target.value } : p))}
                        placeholder={`${plan.label}`}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        value={plan.description}
                        onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, description: e.target.value } : p))}
                        placeholder={`Describe the ${plan.label} plan`}
                      />
                    </div>
                    <div>
                      <Label>Button Text</Label>
                      <Input
                        value={plan.buttonText}
                        onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, buttonText: e.target.value } : p))}
                        placeholder={plan.buttonText || 'CTA'}
                      />
                    </div>
                    <div>
                      <Label>Monthly Price (USD)</Label>
                      <Input
                        type="number"
                        value={plan.price}
                        onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, price: e.target.value } : p))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Features (one per line)</Label>
                    <Textarea
                      rows={10}
                      value={plan.features.join('\n')}
                      onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, features: e.target.value.split('\n').map(f => f.trim()).filter(Boolean) } : p))}
                      placeholder="Enter features, one per line"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-6">
                  <div className="text-center">
                    {plan.isPopular && <Badge className="mb-4">MOST POPULAR</Badge>}
                    <h3 className="text-2xl font-bold mb-2">{plan.title || plan.label}</h3>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-lg ml-2 text-muted-foreground">/month</span>
                    </div>
                    <p className="mb-6 text-muted-foreground">{plan.description}</p>
                    <div className="space-y-2 mb-6 text-sm">
                      {plan.features.slice(0, 6).map((feature, index) => (
                        <div key={index} className="flex items-center text-left">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full">{plan.buttonText || 'Select'}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Package Configuration'}
          </Button>
        </div>
              </div>
      </DashboardLayout>
  );
}