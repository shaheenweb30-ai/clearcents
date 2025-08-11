-- Update pricing content for Free plan
-- Run this in your Supabase SQL editor

-- First, let's see what's currently in the pricing_content table
SELECT * FROM public.pricing_content WHERE section_id IN ('free', 'pro');

-- Update the Free plan with proper content
UPDATE public.pricing_content 
SET 
  title = 'Free',
  subtitle = 'Best for getting started',
  description = 'Perfect for individuals just starting their financial journey.',
  button_text = 'Get Started Free',
  price = 0,
  features = ARRAY[
    'Real-time expense tracking',
    'Up to 10 categories',
    '1 budget',
    'AI insights (lite: 5 tips/mo)',
    'CSV import & export',
    'Multi-currency viewer',
    'Community support',
    'Basic reporting',
    'Mobile app access',
    'Cloud synchronization'
  ],
  is_popular = false
WHERE section_id = 'free';

-- If the Free plan doesn't exist, create it
INSERT INTO public.pricing_content (
  section_id, 
  title, 
  subtitle, 
  description, 
  button_text, 
  price, 
  features, 
  is_popular,
  background_color
) 
SELECT 
  'free',
  'Free',
  'Best for getting started',
  'Perfect for individuals just starting their financial journey.',
  'Get Started Free',
  0,
  ARRAY[
    'Real-time expense tracking',
    'Up to 10 categories',
    '1 budget',
    'AI insights (lite: 5 tips/mo)',
    'CSV import & export',
    'Multi-currency viewer',
    'Community support',
    'Basic reporting',
    'Mobile app access',
    'Cloud synchronization'
  ],
  false,
  '#FFFFFF'
WHERE NOT EXISTS (
  SELECT 1 FROM public.pricing_content WHERE section_id = 'free'
);

-- Update the Pro plan with proper pricing and features
UPDATE public.pricing_content 
SET 
  title = 'Pro',
  subtitle = 'Best for small teams',
  description = 'Advanced features for growing businesses and teams.',
  button_text = 'Start 14 days trial',
  price = 9.99,
  features = ARRAY[
    'Advanced analytics and insights',
    'Priority customer support',
    'Unlimited transactions',
    'Custom categories and budgets',
    'Export and reporting tools',
    'Mobile app access',
    'Cloud synchronization',
    'Budget tracking and forecasting',
    'AI-powered insights',
    'Receipt attachments',
    'Recurring transaction detection',
    'Advanced reporting and exports'
  ],
  is_popular = true
WHERE section_id = 'pro';

-- If the Pro plan doesn't exist, create it
INSERT INTO public.pricing_content (
  section_id, 
  title, 
  subtitle, 
  description, 
  button_text, 
  price, 
  features, 
  is_popular,
  background_color
) 
SELECT 
  'pro',
  'Pro',
  'Best for small teams',
  'Advanced features for growing businesses and teams.',
  'Start 14 days trial',
  9.99,
  ARRAY[
    'Advanced analytics and insights',
    'Priority customer support',
    'Unlimited transactions',
    'Custom categories and budgets',
    'Export and reporting tools',
    'Mobile app access',
    'Cloud synchronization',
    'Budget tracking and forecasting',
    'AI-powered insights',
    'Receipt attachments',
    'Recurring transaction detection',
    'Advanced reporting and exports'
  ],
  true,
  '#FFFFFF'
WHERE NOT EXISTS (
  SELECT 1 FROM public.pricing_content WHERE section_id = 'pro'
);

-- Verify the updates
SELECT 
  section_id,
  title,
  price,
  features,
  is_popular
FROM public.pricing_content 
WHERE section_id IN ('free', 'pro')
ORDER BY price;
