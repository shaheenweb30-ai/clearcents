-- Create branding settings table
CREATE TABLE public.branding_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#1752F3',
  secondary_color TEXT DEFAULT '#F0F0F0',
  accent_color TEXT DEFAULT '#4A90E2',
  font_family TEXT DEFAULT 'GT Walsheim Pro',
  font_weights TEXT DEFAULT '["300", "400", "500", "600", "700"]',
  typography_settings JSONB DEFAULT '{"h1": {"size": "80px", "lineHeight": "92px", "weight": "300", "spacing": "-2%"}, "h2": {"size": "64px", "lineHeight": "72px", "weight": "300", "spacing": "-5%"}, "h3": {"size": "50px", "lineHeight": "56px", "weight": "300", "spacing": "-2%"}, "h4": {"size": "32px", "lineHeight": "40px", "weight": "300", "spacing": "-1%"}, "h5": {"size": "24px", "lineHeight": "28px", "weight": "400", "spacing": "0%"}, "body1": {"size": "18px", "lineHeight": "24px", "weight": "400", "spacing": "-2%"}, "body2": {"size": "16px", "lineHeight": "22px", "weight": "400", "spacing": "1%"}, "caption": {"size": "14px", "lineHeight": "18px", "weight": "300", "spacing": "0%"}}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;

-- Policies for branding settings
CREATE POLICY "Anyone can view branding settings" 
ON public.branding_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage branding settings" 
ON public.branding_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_branding_settings_updated_at
BEFORE UPDATE ON public.branding_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default branding settings
INSERT INTO public.branding_settings (business_name, logo_url, primary_color, secondary_color, accent_color, font_family)
VALUES ('ClearCents', NULL, '#1752F3', '#F0F0F0', '#4A90E2', 'GT Walsheim Pro');