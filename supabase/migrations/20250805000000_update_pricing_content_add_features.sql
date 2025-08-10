-- Add features and is_popular fields to pricing_content for dynamic plan management
ALTER TABLE public.pricing_content
  ADD COLUMN IF NOT EXISTS features TEXT[] NULL,
  ADD COLUMN IF NOT EXISTS is_popular BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price NUMERIC; -- ensure price exists for older environments

-- Seed or upsert default plans
INSERT INTO public.pricing_content (section_id, title, description, button_text, background_color, price, features, is_popular)
VALUES
  ('free', 'Free', 'Best for getting started.', 'Start free', '#FFFFFF', 0, ARRAY[
    'Real-time expense tracking',
    'Up to 10 categories',
    '1 budget',
    'AI insights (lite: 5 tips/mo)',
    'CSV import & export',
    'Multi-currency viewer',
    'Community support'
  ], false),
  ('pro', 'Pro', 'Everything you need, no add-ons.', 'Start 14-day trial', '#FFFFFF', 12, ARRAY[
    'Unlimited categories & budgets',
    'AI insights (full: 50+ tips/mo)',
    'Recurring detection & alerts',
    'Custom periods & auto-refresh',
    'Receipt attachments (email-in beta)',
    'Priority email support',
    'Advanced analytics & reports',
    'Team collaboration (up to 5 users)'
  ], true),
  ('enterprise', 'Enterprise', 'For large organizations.', 'Contact sales', '#FFFFFF', 29, ARRAY[
    'Everything in Pro',
    'Unlimited team members',
    'Advanced security & compliance',
    'Custom integrations & API access',
    'Dedicated account manager',
    'Custom reporting & analytics',
    'White-label options',
    '24/7 priority support'
  ], false)
ON CONFLICT (section_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  button_text = EXCLUDED.button_text,
  background_color = EXCLUDED.background_color,
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  is_popular = EXCLUDED.is_popular,
  updated_at = now();

