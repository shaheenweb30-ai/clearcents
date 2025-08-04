import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Save, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { FooterManager } from '@/components/admin/FooterManager';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';

export default function AdminFooter() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);

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
          <h1 className="text-3xl font-bold text-foreground">Manage Footer</h1>
          <p className="text-muted-foreground mt-2">
            Manage footer links and organization
          </p>
        </div>
        
        <FooterManager />
      </div>
    </Layout>
  );
}