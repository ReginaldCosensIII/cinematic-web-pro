# WebDevPro.io — Brand Identity Document

## Brand Overview
**Brand Name:** WebDevPro.io  
**Owner:** Reggie Cosens  
**Tagline:** Ready to Envision, Design, Develop, Launch Your Vision?  
**Industry:** Freelance Web Development & Digital Services  

---

## Color Palette

### Brand Accent Colors (Fixed — used in both themes)
| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| **Gradient Blue (Cyan)** | `#4285f4` | `hsl(217, 90%, 59%)` | Primary accent, links, CTAs, gradient start |
| **Gradient Purple** | `#8a2be2` | `hsl(271, 76%, 53%)` | Secondary accent, gradient end, hover states |

### Dark Theme Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--webdev-bg` | `hsl(0, 0%, 0%)` / `#000000` | Page background |
| `--webdev-bg-secondary` | `hsl(0, 0%, 4%)` / `#0a0a0a` | Subtle background layers |
| `--webdev-bg-tertiary` | `hsl(0, 0%, 10%)` / `#1a1a1a` | Cards, inputs, elevated surfaces |
| `--webdev-text-primary` | `hsl(0, 0%, 75%)` / `#c0c0c0` | Primary body text (silver) |
| `--webdev-text-secondary` | `hsl(0, 0%, 53%)` / `#888888` | Secondary/muted text |
| `--webdev-glass-bg` | `hsla(0, 0%, 10%, 0.3)` | Glassmorphism card backgrounds |
| `--webdev-glass-border` | `hsla(0, 0%, 75%, 0.1)` | Glassmorphism borders |

### Light Theme Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--webdev-bg` | `hsl(0, 0%, 98%)` / `#fafafa` | Page background |
| `--webdev-bg-secondary` | `hsl(0, 0%, 96%)` / `#f5f5f5` | Subtle background layers |
| `--webdev-bg-tertiary` | `hsl(220, 14%, 96%)` / `#f1f3f5` | Cards, inputs, elevated surfaces |
| `--webdev-text-primary` | `hsl(222, 47%, 11%)` / `#0f172a` | Primary body text (dark navy) |
| `--webdev-text-secondary` | `hsl(215, 16%, 47%)` / `#64748b` | Secondary/muted text |
| `--webdev-glass-bg` | `hsla(0, 0%, 100%, 0.7)` | Glassmorphism card backgrounds |
| `--webdev-glass-border` | `hsla(220, 13%, 80%, 0.4)` | Glassmorphism borders |

---

## Typography

- **Display / Headings:** System sans-serif stack (font-light for main headings, font-bold for gradient-accented keywords)
- **Body Text:** System sans-serif, `text-base` to `text-lg`, generous `leading-relaxed` line-height
- **Code/Technical:** Monospace for code references
- **Heading Hierarchy:**
  - H1: `text-5xl md:text-7xl font-light tracking-tight`
  - H2: `text-5xl md:text-7xl font-light tracking-tight` (section titles)
  - H3: `text-3xl md:text-4xl font-bold`
  - Body: `text-lg` or `text-xl` with `leading-relaxed`

---

## Gradient System

### Primary Brand Gradient
```css
background: linear-gradient(to right, #4285f4, #8a2be2);
/* Tailwind: bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple */
```

### Gradient Text Effect
```css
background: linear-gradient(to right, #4285f4, #8a2be2);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
/* Tailwind: bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent */
```

### Button Gradient Border (Glass Variant)
Buttons use a pseudo-element gradient border technique:
```css
/* Gradient border with solid interior */
before: gradient border (1px)
after: solid bg fill (theme-aware)
```

### Glow Effects
```css
/* Hover glow for CTAs */
box-shadow: 0 0 20px rgba(66, 133, 244, 0.3), 0 0 30px rgba(138, 43, 226, 0.2);
```

---

## Glassmorphism Design System

### Glass Card Effect
```css
.glass-effect {
  background: hsla(var(--webdev-glass-bg));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid hsla(var(--webdev-glass-border));
}
```

### Key Principles:
- All cards, headers, footers, and modals use the `glass-effect` class
- Borders are semi-transparent and theme-aware
- Backdrop blur creates depth without opaque backgrounds
- Works in both light and dark themes

---

## Component Patterns

### Section Headers (Consistent across all pages)
1. **Badge pill** — glass-effect rounded-full with gradient dot + label
2. **Large heading** — `text-5xl md:text-7xl` with gradient keyword
3. **Supporting paragraph** — `text-xl text-wdp-text-secondary`

### Buttons
- **Primary CTA:** `glass` variant with gradient border, py-3 padding
- **Carousel nav:** Solid bg (theme-aware) with standard border, no gradient
- **Ghost/text links:** Gradient blue color, hover to purple

### Cards
- `glass-effect` + `rounded-xl` + `hover:scale-[1.02]`
- Gradient glow on hover: `hover:shadow-2xl hover:shadow-webdev-gradient-blue/10`

---

## Iconography

- **Icon library:** Lucide React
- **Icon treatment:** Icons inside gradient-bordered circular containers
  - Outer: gradient ring (blue→purple)
  - Inner: solid theme-aware background
  - Icon: SVG gradient stroke using `linearGradient` definition

---

## Animation & Motion

| Animation | Duration | Use Case |
|-----------|----------|----------|
| `fade-in-up` | 0.8s ease-out | Page section reveals |
| `smoke-float` | 20s linear infinite | Background atmosphere |
| `smoke-drift` | 15s ease-in-out infinite | Ambient movement |
| `bounce-slow` | 3s ease-in-out infinite | Scroll indicator |
| `scroll-indicator` | 2s ease-in-out infinite | Mouse scroll hint |
| `sparkle` | 2-5s ease-in-out infinite | Hero particles |
| Hover scale | 300ms | `hover:scale-[1.02]` on cards/buttons |

---

## Theme System

### Implementation
- CSS custom properties (HSL) in `index.css`
- `.dark` and `.light` class on `<html>`
- `ThemeContext` provides `theme`, `setTheme`, `toggleTheme`
- Preference stored in `profiles.theme_preference` (Supabase)
- Fallback to `localStorage` for non-authenticated users
- Default: `dark`

### Tailwind Usage
- Use `text-wdp-text` / `text-wdp-text-secondary` for text
- Use `theme-bg` for page backgrounds
- Use `glass-effect` for cards (auto-adapts)
- Brand gradient colors remain constant across themes

---

## Logo Treatment

```
</WebDevPro>
```
- "WebDev" in theme text color
- "Pro" in gradient (blue→purple)
- Wrapped in code-style angle brackets
- Font: bold, tracking-wide

---

## Social Media & Marketing Guidelines

### Colors for Social Assets
- **Primary backgrounds:** Dark (#000000) or Light (#fafafa)
- **Accent:** Always use the blue-to-purple gradient
- **Text on dark:** Silver (#c0c0c0) or White (#ffffff)
- **Text on light:** Dark navy (#0f172a) or Slate (#64748b)

### Imagery Style
- Glassmorphic UI mockups and screenshots
- Atmospheric smoke/particle effects in dark mode
- Clean, minimal compositions in light mode
- Blue-purple gradient accents on all visual assets

### Tone of Voice
- Smart, confident, helpful, clear
- Mix of industry-savvy and down-to-earth approachability
- Benefit-focused headings with action verbs
- Conversational but authoritative

---

## File Reference

| File | Purpose |
|------|---------|
| `src/index.css` | All CSS custom properties and theme tokens |
| `tailwind.config.ts` | Tailwind extensions and brand colors |
| `src/contexts/ThemeContext.tsx` | Theme state management |
| `src/components/ui/button.tsx` | Glass button variant |
| `src/components/Header.tsx` | Theme toggle in navigation |
| `src/components/SmokeBackground.tsx` | Theme-aware atmospheric bg |

---

*Document Version: 1.0 — March 2026*  
*Brand: WebDevPro.io by Reggie Cosens*
