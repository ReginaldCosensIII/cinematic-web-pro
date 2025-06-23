
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom WebDevPro theme colors
				'webdev': {
					'black': '#000000',
					'dark-gray': '#0a0a0a',
					'darker-gray': '#1a1a1a',
					'silver': '#c0c0c0',
					'soft-gray': '#888888',
					'glass': 'rgba(26, 26, 26, 0.3)',
					'glass-border': 'rgba(192, 192, 192, 0.1)',
					'gradient-blue': '#4285f4',
					'gradient-purple': '#8a2be2'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'smoke-float': {
					'0%': {
						transform: 'translateY(100vh) scale(0.8)',
						opacity: '0'
					},
					'50%': {
						opacity: '0.3'
					},
					'100%': {
						transform: 'translateY(-100vh) scale(1.2)',
						opacity: '0'
					}
				},
				'smoke-drift': {
					'0%': {
						transform: 'translateX(-50px) rotate(0deg)',
						opacity: '0.2'
					},
					'50%': {
						transform: 'translateX(50px) rotate(180deg)',
						opacity: '0.4'
					},
					'100%': {
						transform: 'translateX(-50px) rotate(360deg)',
						opacity: '0.2'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'bounce-slow': {
					'0%, 100%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					},
					'50%': {
						transform: 'translateY(-25%)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					}
				},
				'scroll-indicator': {
					'0%': {
						opacity: '0'
					},
					'50%': {
						opacity: '1'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(20px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'smoke-float': 'smoke-float 20s linear infinite',
				'smoke-drift': 'smoke-drift 15s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.8s ease-out',
				'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
				'scroll-indicator': 'scroll-indicator 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
