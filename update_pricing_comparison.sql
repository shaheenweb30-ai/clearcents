-- Update pricing_comparison table to include free plan
-- Run this in your Supabase SQL editor

-- First, let's see what's currently in the pricing_comparison table
SELECT * FROM public.pricing_comparison ORDER BY display_order;

-- Clear existing data to start fresh
DELETE FROM public.pricing_comparison;

-- Insert comprehensive pricing comparison data
INSERT INTO public.pricing_comparison (
  display_order,
  feature,
  description,
  free_is_boolean,
  free_value,
  pro_is_boolean,
  pro_value,
  enterprise_is_boolean,
  enterprise_value,
  is_active
) VALUES
-- Core Features
(1, 'Real-time expense tracking', 'Track expenses as they happen', true, '✓', true, '✓', true, '✓', true),
(2, 'Up to 10 categories', 'Organize your spending', true, '10', true, 'Unlimited', true, 'Unlimited', true),
(3, '1 budget', 'Basic budget management', true, '1', true, 'Unlimited', true, 'Unlimited', true),
(4, 'AI insights', 'Smart financial recommendations', true, '5 tips/mo', true, '50+ tips/mo', true, 'Unlimited', true),
(5, 'CSV import & export', 'Data portability', true, '✓', true, '✓', true, '✓', true),
(6, 'Multi-currency viewer', 'See balances in different currencies', true, '✓', true, '✓', true, '✓', true),
(7, 'Community support', 'Get help from the community', true, '✓', true, '✓', true, '✓', true),
(8, 'Mobile app access', 'Manage finances on the go', true, '✓', true, '✓', true, '✓', true),
(9, 'Cloud synchronization', 'Access from anywhere', true, '✓', true, '✓', true, '✓', true),

-- Pro Features
(10, 'Unlimited categories & budgets', 'No restrictions on organization', false, '✗', true, '✓', true, '✓', true),
(11, 'Advanced analytics & reports', 'Deep insights into spending patterns', false, '✗', true, '✓', true, '✓', true),
(12, 'Recurring detection & alerts', 'Automatically identify regular expenses', false, '✗', true, '✓', true, '✓', true),
(13, 'Custom periods & auto-refresh', 'Flexible budget cycles', false, '✗', true, '✓', true, '✓', true),
(14, 'Receipt attachments', 'Store receipts with transactions', false, '✗', true, '✓', true, '✓', true),
(15, 'Priority email support', 'Faster response times', false, '✗', true, '✓', true, '✓', true),
(16, 'Advanced reporting & exports', 'Professional-grade reports', false, '✗', true, '✓', true, '✓', true),

-- Enterprise Features
(17, 'Unlimited team members', 'Scale with your organization', false, '✗', false, '✗', true, '✓', true),
(18, 'Advanced security & compliance', 'Enterprise-grade security', false, '✗', false, '✗', true, '✓', true),
(19, 'Custom integrations & API access', 'Connect with your tools', false, '✗', false, '✗', true, '✓', true),
(20, 'Dedicated account manager', 'Personal support contact', false, '✗', false, '✗', true, '✓', true),
(21, 'Custom reporting & analytics', 'Tailored insights for your business', false, '✗', false, '✗', true, '✓', true),
(22, 'White-label options', 'Brand the platform as your own', false, '✗', false, '✗', true, '✓', true),
(23, '24/7 priority support', 'Round-the-clock assistance', false, '✗', false, '✗', true, '✓', true);

-- Verify the data
SELECT 
  display_order,
  feature,
  free_value,
  pro_value,
  enterprise_value
FROM public.pricing_comparison 
WHERE is_active = true
ORDER BY display_order;
