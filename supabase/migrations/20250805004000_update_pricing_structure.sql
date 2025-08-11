-- Update pricing content to reflect new free plan structure
-- All users start with free plan, can upgrade to Pro

-- Update hero section
UPDATE public.pricing_content 
SET 
  title = 'Choose Your Plan',
  subtitle = 'Start free, upgrade when you need more',
  description = 'Everyone starts with our free plan. Upgrade to Pro when you need advanced features and unlimited access.',
  button_text = 'Start Free'
WHERE section_id = 'hero';

-- Update starter section to free
UPDATE public.pricing_content 
SET 
  section_id = 'free',
  title = 'Free',
  subtitle = 'Perfect for getting started',
  description = 'Everything you need to begin your financial journey. No credit card required.',
  button_text = 'Current Plan'
WHERE section_id = 'starter';

-- Update pro section
UPDATE public.pricing_content 
SET 
  title = 'Pro',
  subtitle = 'Best for growing users',
  description = 'Advanced features for users who need more power and flexibility.',
  button_text = 'Upgrade to Pro'
WHERE section_id = 'pro';

-- Insert free plan if it doesn't exist (in case starter was renamed)
INSERT INTO public.pricing_content (section_id, title, subtitle, description, button_text, background_color)
SELECT 'free', 'Free', 'Perfect for getting started', 'Everything you need to begin your financial journey. No credit card required.', 'Current Plan', '#FFFFFF'
WHERE NOT EXISTS (
  SELECT 1 FROM public.pricing_content WHERE section_id = 'free'
);
