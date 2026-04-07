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
| `--webdev-bg` | `hsl(220, 20%, 95%)` | Page background (cool gray) |
| `--webdev-bg-secondary` | `hsl(220, 18%, 93%)` | Subtle background layers |
| `--webdev-bg-tertiary` | `hsl(220, 14%, 96%)` | Cards, inputs, elevated surfaces |
| `--webdev-text-primary` | `hsl(222, 47%, 11%)` / `#0f172a` | Primary body text (dark navy) |
| `--webdev-text-secondary` | `hsl(215, 20%, 35%)` | Secondary/muted text (high contrast) |
| `--webdev-glass-bg` | `hsla(0, 0%, 100%, 0.85)` | Glassmorphism card backgrounds |
| `--webdev-glass-border` | `hsla(220, 13%, 75%, 0.35)` | Glassmorphism borders |

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

### Button Gradient (Light Mode)
```css
/* Solid gradient fill with shimmer animation */
background: linear-gradient(135deg, #4285f4, #7c3aed, #8a2be2);
background-size: 200% 200%;
color: white;
/* Hover: background-position shifts for shimmer effect */
```

### Button Gradient Border (Dark Mode — Glass Variant)
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
/* Dark mode */
.dark .glass-effect {
  background: hsla(0, 0%, 10%, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid hsla(0, 0%, 75%, 0.1);
}

/* Light mode — multi-stop gradient with elevated shadow */
.light .glass-effect {
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,245,255,0.92), rgba(245,240,255,0.88));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(66, 133, 244, 0.18);
  box-shadow: 0 4px 24px rgba(66, 133, 244, 0.08), 0 2px 8px rgba(138, 43, 226, 0.04);
}
```

### Key Principles:
- All cards, headers, footers, and modals use the `glass-effect` class
- Light mode cards use white-to-blue-to-purple gradient backgrounds for visual distinction from the cool gray page background
- Dark mode cards use translucent dark backgrounds
- Backdrop blur creates depth without opaque backgrounds
- Works in both light and dark themes

---

## Button System

### Dark Mode — Glass Variant
- Gradient border via pseudo-elements (before/after)
- Solid dark interior (`bg-wdp-bg-tertiary`)
- Theme text color
- Hover: blue/purple glow shadow + `scale(1.02)`
- Border-radius: `0.75rem` (rounded-xl)

### Light Mode — Gradient Fill
- Solid brand gradient background (`#4285f4` → `#7c3aed` → `#8a2be2`)
- `background-size: 200%` for shimmer animation on hover
- White text and white icon colors
- Hover: `scale(1.02)` + elevated glow shadow (matches dark mode enlarge behavior)
- Border-radius: `0.75rem` (matches dark mode — uniform across themes)
- Applied uniformly to ALL primary buttons site-wide via `[data-variant="glass"]`

### All Buttons:
- Uniform border-radius: `0.75rem` (rounded-xl) in both themes
- Consistent `tracking-wide font-medium` typography
- `hover:scale(1.02)` enlarge effect on hover (both themes)
- Gradient glow shadow on hover (both themes)

### Start My Brief (LaunchPad CTA)
- Custom larger sizing: `px-14 py-5 text-lg font-semibold`
- Same gradient fill in both themes (inline style for maximum control)
- Identical hover behavior: shimmer + scale + glow

---

## Badge System

### Interactive Badge Effects
- Class: `badge-hover` applied to all section badges site-wide (Homepage, Services, Portfolio, Blog)
- Hover: `transform: scale(1.08)` + dual-layer gradient glow
- Light mode resting state: stronger blue border + elevated shadow for visibility
- Light mode hover: intensified glow (`0.45` blue, `0.3` purple opacity)
- Dark mode resting state: glass-effect translucent

### Blog Tags
- Light mode: gradient-tinted background with blue/purple border, dark indigo text
- Dark mode: standard glass-effect appearance

### Service Sub-Cards
- Class: `service-sub-card` on Key Benefits, Technologies & Tools, What You'll Receive
- Light mode: subtle blue-purple gradient bg at rest, full intensity on hover
- Dark mode: transparent at rest, glass-effect bg on hover

---

## Icon System

### Dark Mode
- Outer: gradient ring (blue→purple) via `p-0.5` padding trick
- Inner: solid dark background (`bg-webdev-dark-gray`)
- Icon: SVG gradient stroke using `linearGradient` definition

### Light Mode
- Outer: same gradient ring
- Inner: solid gradient fill background (`linear-gradient(135deg, #4285f4, #8a2be2)`)
- Icon: white solid stroke (`stroke: white`)
- Applied via `.light .icon-gradient-container .icon-inner` CSS

---

## Component Patterns

### Section Headers (Consistent across all pages)
1. **Badge pill** — glass-effect rounded-full with gradient dot + label
2. **Large heading** — `text-5xl md:text-7xl` with gradient keyword
3. **Supporting paragraph** — `text-xl text-wdp-text-secondary`

### Cards
- `glass-effect` + `rounded-xl` + `hover:scale-[1.02]`
- Gradient glow on hover: `hover:shadow-2xl hover:shadow-webdev-gradient-blue/10`
- Light mode: elevated with stronger borders and shadows for distinction from background

### Carousel Controls
- Standardized `carousel-chevron` (2rem circular buttons)
- `carousel-dot` slide indicators with morphing-width animation
- Active dot: `width: 1.5rem` + brand gradient fill

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
| Badge hover glow | 300ms ease | `scale(1.08)` + gradient box-shadow |

---

## Theme System

### Implementation
- CSS custom properties (HSL) in `index.css`
- `.dark` and `.light` class on `<html>`
- `ThemeContext` provides `theme`, `setTheme`, `toggleTheme`
- Preference stored in `profiles.theme_preference` (Supabase)
- Fallback to `localStorage` for non-authenticated users
- Default: `dark`

### Light vs Dark Design Philosophy
- **Dark mode**: Pure black background, translucent glass cards, gradient stroke icons, gradient-border buttons with `scale(1.02)` hover
- **Light mode**: Cool gray background (`hsl(220, 20%, 95%)`), white gradient cards with elevated shadows, solid gradient-fill icons with white glyphs, solid gradient-fill buttons with `scale(1.02)` hover + shimmer
- Both modes share: brand gradient accents, animation system, component structure, typography scale, uniform `0.75rem` button radius, `scale(1.02)` hover behavior

### Dashboard Light Mode
- Headings: dark navy (`hsl(222, 47%, 11%)`) via `.dash-heading`
- Body text: slate (`hsl(215, 20%, 35%)`) via `.dash-text`
- Muted text: gray (`hsl(215, 16%, 47%)`) via `.dash-text-muted`
- Skeleton loaders: light gray (`hsl(220, 14%, 90%)`) via `.dash-skeleton`

### Tailwind Usage
- Use `text-wdp-text` / `text-wdp-text-secondary` for text
- Use `theme-bg` for page backgrounds
- Use `glass-effect` for cards (auto-adapts)
- Brand gradient colors remain constant across themes

---

## Smoke Background

### Dark Mode
- Subtle silver/gray radial gradients
- Low opacity (`0.08–0.12`) for atmospheric depth

### Light Mode
- Blue/purple tinted radial gradients
- Very low opacity (`0.025–0.03`) for subtle texture without distraction
- Less prominent than dark mode to maintain clean, bright aesthetic

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
- **Primary backgrounds:** Dark (#000000) or Cool Gray (#eef0f4)
- **Accent:** Always use the blue-to-purple gradient
- **Text on dark:** Silver (#c0c0c0) or White (#ffffff)
- **Text on light:** Dark navy (#0f172a) or Slate (#4a5568)

### Imagery Style
- Glassmorphic UI mockups and screenshots
- Atmospheric smoke/particle effects in dark mode
- Clean, elevated compositions with subtle gradient tints in light mode
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
| `src/index.css` | All CSS custom properties, theme tokens, and component overrides |
| `tailwind.config.ts` | Tailwind extensions and brand colors |
| `src/contexts/ThemeContext.tsx` | Theme state management |
| `src/components/ui/button.tsx` | Glass button variant with data-variant attribute |
| `src/components/Header.tsx` | Theme toggle + Button component integration |
| `src/components/SmokeBackground.tsx` | Theme-aware atmospheric background |

---

*Document Version: 2.0 — April 2026*  
*Brand: WebDevPro.io by Reggie Cosens*
