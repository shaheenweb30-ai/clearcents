# Pricing Components (Simplified)

This directory contains simplified pricing page components for ClearCents, featuring just two plans: **Free** and **Pro**.

## Components

### Core Components

1. **PricingHero** - Hero section with "Simple pricing—start free, upgrade when ready"
2. **BillingControls** - Monthly/yearly toggle and currency selector (sticky on mobile)
3. **PlansSimple** - Two responsive pricing cards (Free & Pro)
4. **ComparisonSimple** - Feature comparison table (desktop) / accordion (mobile)
5. **BillingNotes** - VAT, refunds, and billing information
6. **PricingFAQ** - 5-6 frequently asked questions
7. **FinalCTA** - Compelling call-to-action section
8. **PricingPage** - Main component that assembles all sections

### Types

- `BillingState` - Interface for billing cycle and currency state
- `BillingCycle` - 'monthly' | 'yearly'
- `Currency` - 'GBP' | 'USD' | 'EUR' | 'AED' | 'KWD'

## Usage

```tsx
import { PricingPage } from '@/components/pricing';

// Use the complete pricing page
<PricingPage />

// Or use individual components
import { PricingHero, BillingControls, PlansSimple } from '@/components/pricing';
```

## Features

- **Two Plans Only**: Free (£0) and Pro (£12/mo or £9.60/mo yearly)
- **Responsive Design**: Mobile-first with responsive grids
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Dark Mode Support**: Compatible with theme system
- **Currency Conversion**: Demo conversion rates (replace with live FX API)
- **British English**: All copy uses British English spelling and terminology
- **Sticky Controls**: Billing controls stick to top on mobile for quick toggling

## Pricing Structure

### Free Plan (£0/mo)
- Real-time expense tracking
- Up to 10 categories
- 1 budget
- AI insights (lite: 5 tips/mo)
- CSV import & export
- Multi-currency viewer
- Community support

### Pro Plan (£12/mo monthly, £9.60/mo yearly)
- Unlimited categories & budgets
- AI insights (full: 50+ tips/mo)
- Recurring detection & alerts
- Custom periods & auto-refresh
- Receipt attachments (email-in beta)
- Priority email support

## Currency Conversion

Demo conversion rates (replace with live FX API):

```tsx
const CONVERSION: Record<Currency, number> = { 
  GBP: 1, 
  USD: 1.27, 
  EUR: 1.17, 
  AED: 4.66, 
  KWD: 0.39 
};

// Base GBP prices
const BASE_PRICES = { Free: 0, Pro: 12 };

function priceFor(plan: 'Free' | 'Pro', cycle: 'monthly' | 'yearly', currency: Currency): number {
  const gbp = BASE_PRICES[plan];
  if (gbp === 0) return 0;
  const perMonthGBP = cycle === 'yearly' ? gbp * 0.8 : gbp;
  const converted = perMonthGBP * CONVERSION[currency];
  return Math.round(converted * 100) / 100;
}
```

## Customization

### Live FX API Integration
Replace the demo conversion rates in `BillingControls.tsx` and `PlansSimple.tsx`:

```tsx
// Replace with live API call
const getLiveRate = async (from: Currency, to: Currency) => {
  // Implement live FX API call
  const response = await fetch(`/api/fx?from=${from}&to=${to}`);
  return response.json();
};
```

### Styling
All components use Tailwind CSS classes and follow the design system:
- Primary color: Deep blue
- Success color: Soft green
- AI moments: Subtle purple
- Generous whitespace and rounded corners

### Content
All text content is hardcoded in British English. For internationalization, extract strings to translation files.

## File Structure

```
src/components/pricing/
├── index.ts              # Exports all components
├── PricingHero.tsx       # Hero section
├── BillingControls.tsx   # Billing toggle & currency (sticky)
├── PlansSimple.tsx       # Two pricing cards
├── ComparisonSimple.tsx  # Feature table/accordion
├── BillingNotes.tsx      # Billing information
├── PricingFAQ.tsx        # FAQ section
├── FinalCTA.tsx          # Call-to-action
├── PricingPage.tsx       # Main component
└── README.md            # This file
```

## SEO

The pricing page includes proper SEO metadata:
- Title: "Pricing | ClearCents — Free and Pro"
- Description: "ClearCents pricing: start free, then upgrade to Pro when you're ready. One paid plan, all features. 14-day trial available."
