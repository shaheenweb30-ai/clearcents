import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { usePricingComparison, PricingComparisonRow } from '@/hooks/usePricingComparison';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ListChecks, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminComparison() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const { rows, loading, upsert, refresh } = usePricingComparison();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [editableRows, setEditableRows] = useState<PricingComparisonRow[]>([]);

  // Hydrate editable rows when fetched rows change
  useEffect(() => {
    setEditableRows(rows.map(r => ({ ...r })));
  }, [rows]);

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

  const handleSave = async (row: PricingComparisonRow) => {
    try {
      setSavingId(row.id);
      await upsert(row);
      toast.success('Row saved');
    } catch (e: any) {
      toast.error('Failed to save');
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  const handleAddRow = async () => {
    try {
      setSavingId('new');
      const nextOrder = (rows?.[rows.length - 1]?.display_order || 0) + 10;
      await upsert({
        display_order: nextOrder,
        feature: 'New feature',
        description: '',
        free_is_boolean: true,
        free_value: null,
        pro_is_boolean: true,
        pro_value: null,
        enterprise_is_boolean: true,
        enterprise_value: null,
        is_active: true,
      } as Partial<PricingComparisonRow>);
      await refresh();
      toast.success('New row added');
    } catch (e: any) {
      toast.error('Failed to add row');
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  const defaultPricingFeatures = [
    { feature: 'Real-time expense tracking', description: 'Instant updates vs. manual entry', free: true,  pro: true,  enterprise: true },
    { feature: 'Budget categories',           description: 'Basic vs. comprehensive organization',       free: '10 categories', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'Budget limits',               description: 'Single vs. multiple budget tracking',        free: '1 budget',      pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'AI insights per month',       description: 'Basic vs. comprehensive AI guidance',        free: '5 tips',        pro: '50+ tips',  enterprise: 'Unlimited' },
    { feature: 'Recurring detection & alerts',description: 'Manual vs. automatic subscription tracking', free: false,          pro: true,        enterprise: true },
    { feature: 'Multi-currency support',      description: 'Basic vs. real-time currency conversion',    free: 'Viewer only',  pro: 'Full with live FX', enterprise: 'Full with live FX' },
    { feature: 'CSV import/export',           description: 'Data portability for all plans',             free: true,           pro: true,       enterprise: true },
    { feature: 'Receipt attachments',         description: 'Manual vs. automated receipt management',    free: false,          pro: true,       enterprise: true },
    { feature: 'Advanced analytics & reports',description: 'Basic vs. comprehensive insights',           free: false,          pro: true,       enterprise: true },
    { feature: 'Priority support',            description: 'Community vs. dedicated support',            free: false,          pro: true,       enterprise: '24/7 priority' },
    { feature: 'Data retention',              description: 'Limited vs. extended data history',          free: '6 months',     pro: '24 months', enterprise: 'Unlimited' },
    { feature: 'Team collaboration',          description: 'Individual vs. team financial management',   free: false,          pro: 'Up to 5 users', enterprise: 'Unlimited team members' },
    { feature: 'Advanced security & compliance', description: 'Enterprise-grade security features',     free: false,          pro: false,      enterprise: true },
    { feature: 'Custom integrations & API access', description: 'Advanced connectivity options',        free: false,          pro: false,      enterprise: true },
    { feature: 'Dedicated account manager',   description: 'Personalized support and guidance',          free: false,          pro: false,      enterprise: true },
    { feature: 'Custom reporting & analytics',description: 'Tailored insights for organizations',        free: false,          pro: false,      enterprise: true },
    { feature: 'White-label options',         description: 'Brand customization for organizations',      free: false,          pro: false,      enterprise: true },
  ];

  const handleLoadDefaults = async () => {
    if (rows.length > 0) {
      toast.message('Rows already exist', {
        description: 'Clear existing rows or add manually. Defaults are only for empty state.',
      });
      return;
    }
    try {
      setSeeding(true);
      let order = 10;
      for (const item of defaultPricingFeatures) {
        const toRow: Partial<PricingComparisonRow> = {
          display_order: order,
          feature: item.feature,
          description: item.description,
          free_is_boolean: typeof item.free === 'boolean',
          free_value: typeof item.free === 'string' ? item.free : null,
          pro_is_boolean: typeof item.pro === 'boolean',
          pro_value: typeof item.pro === 'string' ? item.pro : null,
          enterprise_is_boolean: typeof item.enterprise === 'boolean',
          enterprise_value: typeof item.enterprise === 'string' ? item.enterprise : null,
          is_active: true,
        };
        // eslint-disable-next-line no-await-in-loop
        await upsert(toRow);
        order += 10;
      }
      await refresh();
      toast.success('Loaded defaults from Pricing page');
    } catch (e: any) {
      toast.error('Failed to load defaults');
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/settings" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ListChecks className="w-6 h-6" /> Comparison Configurator
          </h1>
          <p className="text-muted-foreground mt-2">Edit the comparison matrix shown on the Pricing page</p>
        </div>

        <div className="flex items-center justify-between mb-4 gap-2">
          <Button variant="outline" onClick={handleLoadDefaults} disabled={seeding || rows.length > 0}>
            {seeding ? 'Loading...' : 'Load Pricing Defaults'}
          </Button>
          <Button onClick={handleAddRow} disabled={savingId === 'new'}>
            + Add Row
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading && <div>Loading...</div>}
          {!loading && rows.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No rows yet. Click “Add Row” to create your first comparison item.
              </CardContent>
            </Card>
          )}
          {!loading && editableRows.map((row) => (
            <Card key={row.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Badge variant="secondary">#{row.display_order}</Badge>
                    {row.feature}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleSave({ ...row })} disabled={savingId === row.id}>
                      <Save className="w-4 h-4 mr-2" />
                      {savingId === row.id ? 'Saving...' : 'Save Row'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <Label>Feature</Label>
                      <Input value={row.feature} onChange={(e) => setEditableRows(prev => prev.map(r => r.id === row.id ? { ...r, feature: e.target.value } : r))} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea rows={2} value={row.description || ''} onChange={(e) => setEditableRows(prev => prev.map(r => r.id === row.id ? { ...r, description: e.target.value } : r))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Order</Label>
                        <Input type="number" value={row.display_order} onChange={(e) => setEditableRows(prev => prev.map(r => r.id === row.id ? { ...r, display_order: Number(e.target.value) } : r))} />
                      </div>
                      <div className="flex items-end gap-2">
                        <input type="checkbox" checked={row.is_active} onChange={(e) => setEditableRows(prev => prev.map(r => r.id === row.id ? { ...r, is_active: e.target.checked } : r))} />
                        <Label>Active</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Free</Label>
                        <div className="flex items-center gap-2 mb-1">
                          <input type="checkbox" checked={row.free_is_boolean} onChange={(e) => setEditableRows(prev => prev.map(r => r.id === row.id ? { ...r, free_is_boolean: e.target.checked } : r))} />
                          <span className="text-xs text-muted-foreground">Boolean</span>
                        </div>
                        <Input placeholder="Value" value={row.free_value || ''} onChange={(e) => setEditableRows(prev => prev.map(r => r.id === row.id ? { ...r, free_value: e.target.value } : r))} disabled={row.free_is_boolean} />
                      </div>
                      <div>
                        <Label>Pro</Label>
                        <div className="flex items-center gap-2 mb-1">
                          <input type="checkbox" checked={row.pro_is_boolean} onChange={(e) => setEditableRows(prev => prev.map(r => r.id === row.id ? { ...r, pro_is_boolean: e.target.checked } : r))} />
                          <span className="text-xs text-muted-foreground">Boolean</span>
                        </div>
                        <Input placeholder="Value" value={row.pro_value || ''} onChange={(e) => setEditableRows(prev => prev.map(r => r.id === row.id ? { ...r, pro_value: e.target.value } : r))} disabled={row.pro_is_boolean} />
                      </div>
                      <div>
                        <Label>Enterprise</Label>
                        <div className="flex items-center gap-2 mb-1">
                          <input type="checkbox" checked={row.enterprise_is_boolean} onChange={(e) => setEditableRows(prev => prev.map(r => r.id === row.id ? { ...r, enterprise_is_boolean: e.target.checked } : r))} />
                          <span className="text-xs text-muted-foreground">Boolean</span>
                        </div>
                        <Input placeholder="Value" value={row.enterprise_value || ''} onChange={(e) => setEditableRows(prev => prev.map(r => r.id === row.id ? { ...r, enterprise_value: e.target.value } : r))} disabled={row.enterprise_is_boolean} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}


