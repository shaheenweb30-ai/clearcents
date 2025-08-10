-- Create table for dynamic pricing comparison matrix
CREATE TABLE IF NOT EXISTS public.pricing_comparison (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_order INTEGER NOT NULL DEFAULT 0,
  feature TEXT NOT NULL,
  description TEXT,
  free_is_boolean BOOLEAN NOT NULL DEFAULT true,
  free_value TEXT,
  pro_is_boolean BOOLEAN NOT NULL DEFAULT true,
  pro_value TEXT,
  enterprise_is_boolean BOOLEAN NOT NULL DEFAULT true,
  enterprise_value TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_comparison ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow public read access to pricing comparison" ON public.pricing_comparison;
CREATE POLICY "Allow public read access to pricing comparison"
ON public.pricing_comparison FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert pricing comparison" ON public.pricing_comparison;
CREATE POLICY "Allow authenticated users to insert pricing comparison"
ON public.pricing_comparison FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow authenticated users to update pricing comparison" ON public.pricing_comparison;
CREATE POLICY "Allow authenticated users to update pricing comparison"
ON public.pricing_comparison FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_pricing_comparison_updated_at ON public.pricing_comparison;
CREATE TRIGGER update_pricing_comparison_updated_at
BEFORE UPDATE ON public.pricing_comparison
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a few default rows
INSERT INTO public.pricing_comparison (
  display_order, feature, description,
  free_is_boolean, free_value,
  pro_is_boolean, pro_value,
  enterprise_is_boolean, enterprise_value,
  is_active
) VALUES
  (10, 'Real-time expense tracking', 'Instant updates vs. manual entry', true, NULL, true, NULL, true, NULL, true),
  (20, 'Budget categories', 'Basic vs. comprehensive organization', false, '10 categories', false, 'Unlimited', false, 'Unlimited', true),
  (30, 'Budget limits', 'Single vs. multiple budget tracking', false, '1 budget', false, 'Unlimited', false, 'Unlimited', true),
  (40, 'AI insights per month', 'Basic vs. comprehensive AI guidance', false, '5 tips', false, '50+ tips', false, 'Unlimited', true)
ON CONFLICT DO NOTHING;

