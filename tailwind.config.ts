import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'nunito': ['Nunito', 'ui-sans-serif', 'system-ui'],
				sans: ['Nunito', 'ui-sans-serif', 'system-ui'],
			},
			fontSize: {
				// Custom typography scale based on GT Walsheim Pro specifications
				'h1': ['80px', { lineHeight: '92px', fontWeight: '300', letterSpacing: '-0.02em' }], // Book weight
				'h2': ['64px', { lineHeight: '72px', fontWeight: '300', letterSpacing: '-0.05em' }], // Book weight  
				'h3': ['50px', { lineHeight: '56px', fontWeight: '300', letterSpacing: '-0.02em' }], // Book weight
				'h4': ['32px', { lineHeight: '40px', fontWeight: '300', letterSpacing: '-0.01em' }], // Book weight
				'h5': ['24px', { lineHeight: '28px', fontWeight: '400', letterSpacing: '0em' }], // Regular weight
				'body1': ['18px', { lineHeight: '24px', fontWeight: '400', letterSpacing: '-0.02em' }], // Regular weight
				'body2': ['16px', { lineHeight: '22px', fontWeight: '400', letterSpacing: '0.01em' }], // Regular weight
				'caption': ['14px', { lineHeight: '18px', fontWeight: '300', letterSpacing: '0em' }], // Book weight
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				// Brand colors - Blue Only
				brand: {
					primary: '#1752F3',    // Bright Blue
					secondary: '#F0F0F0',  // Light Gray
					accent: '#4A90E2',     // Lighter Blue
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
