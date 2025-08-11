-- Update pricing comparison table to reflect new free plan structure
-- All users start with free plan, can upgrade to Pro

-- Update existing features to reflect new plan structure
UPDATE public.pricing_comparison 
SET 
  free_is_boolean = true,
  free_value = 'Included'
WHERE feature IN (
  'Real-time expense tracking',
  'Basic categories',
  'Simple budgets',
  'CSV import/export',
  'Multi-currency support',
  'Community support'
);

UPDATE public.pricing_comparison 
SET 
  free_is_boolean = false,
  free_value = 'Up to 10'
WHERE feature = 'Categories';

UPDATE public.pricing_comparison 
SET 
  free_is_boolean = false,
  free_value = '1 budget'
WHERE feature = 'Budgets';

UPDATE public.pricing_comparison 
SET 
  free_is_boolean = false,
  free_value = '5 tips/month'
WHERE feature = 'AI insights';

UPDATE public.pricing_comparison 
SET 
  free_is_boolean = false,
  free_value = 'Basic'
WHERE feature = 'Analytics';

UPDATE public.pricing_comparison 
SET 
  free_is_boolean = false,
  free_value = 'Community'
WHERE feature = 'Support';

-- Update Pro plan features
UPDATE public.pricing_comparison 
SET 
  pro_is_boolean = true,
  pro_value = 'Unlimited'
WHERE feature IN (
  'Categories',
  'Budgets',
  'Transactions'
);

UPDATE public.pricing_comparison 
SET 
  pro_is_boolean = false,
  pro_value = '50+ tips/month'
WHERE feature = 'AI insights';

UPDATE public.pricing_comparison 
SET 
  pro_is_boolean = false,
  pro_value = 'Advanced'
WHERE feature = 'Analytics';

UPDATE public.pricing_comparison 
SET 
  pro_is_boolean = false,
  pro_value = 'Priority email'
WHERE feature = 'Support';

UPDATE public.pricing_comparison 
SET 
  pro_is_boolean = true,
  pro_value = 'Included'
WHERE feature IN (
  'Recurring detection',
  'Custom periods',
  'Receipt attachments',
  'Team collaboration',
  'API access',
  'White-label options'
);

-- Insert new features if they don't exist
INSERT INTO public.pricing_comparison (feature, description, display_order, free_is_boolean, free_value, pro_is_boolean, pro_value, enterprise_is_boolean, enterprise_value, is_active)
SELECT 'Recurring detection', 'Automatically detect recurring transactions', 15, false, 'Not included', true, 'Included', true, 'Included', true
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_comparison WHERE feature = 'Recurring detection');

INSERT INTO public.pricing_comparison (feature, description, display_order, free_is_boolean, free_value, pro_is_boolean, pro_value, enterprise_is_boolean, enterprise_value, is_active)
SELECT 'Custom periods', 'Set custom budget periods', 16, false, 'Not included', true, 'Included', true, 'Included', true
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_comparison WHERE feature = 'Custom periods');

INSERT INTO public.pricing_comparison (feature, description, display_order, free_is_boolean, free_value, pro_is_boolean, pro_value, enterprise_is_boolean, enterprise_value, is_active)
SELECT 'Receipt attachments', 'Attach receipts to transactions', 17, false, 'Not included', true, 'Included', true, 'Included', true
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_comparison WHERE feature = 'Receipt attachments');

INSERT INTO public.pricing_comparison (feature, description, display_order, free_is_boolean, free_value, pro_is_boolean, pro_value, enterprise_is_boolean, enterprise_value, is_active)
SELECT 'Team collaboration', 'Work with team members', 18, false, 'Not included', true, 'Up to 5 users', true, 'Unlimited', true
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_comparison WHERE feature = 'Team collaboration');

INSERT INTO public.pricing_comparison (feature, description, display_order, free_is_boolean, free_value, pro_is_boolean, pro_value, enterprise_is_boolean, enterprise_value, is_active)
SELECT 'API access', 'Access via API', 19, false, 'Not included', true, 'Included', true, 'Included', true
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_comparison WHERE feature = 'API access');

INSERT INTO public.pricing_comparison (feature, description, display_order, free_is_boolean, free_value, pro_is_boolean, pro_value, enterprise_is_boolean, enterprise_value, is_active)
SELECT 'White-label options', 'Customize branding', 20, false, 'Not included', true, 'Basic', true, 'Full customization', true
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_comparison WHERE feature = 'White-label options');
