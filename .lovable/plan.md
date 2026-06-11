
# Version III Web Services Rebrand & Homepage Polish

A two-phase rollout: (1) global rebrand of brand name, metadata, and footer; (2) homepage restructure with new sections and revised copy. The cinematic dark theme, space hero, and gradient system are preserved.

## Phase 1 — Global Rebrand

**Header logo (`src/components/Header.tsx`)**
- Replace "WebDevPro" lockup with text lockup:
  - Primary: `Version III` with gradient on `III` + small "Web Services" supporting text
- Keep current sizing/positioning so layout doesn't shift.

**Footer (`src/components/Footer.tsx`)**
- Change `© 2025 WebDevPro` → `© 2025 Version III Web Services LLC`
- Mobile and desktop variants both updated.

**Metadata**
- `index.html`: title, description, og:*, twitter:*, JSON-LD organization name → Version III Web Services.
- `src/components/SEOHead.tsx`: default title/description/author/og strings replaced. Keep `webdevpro.io` domain references intact (canonical domain memory) unless you'd prefer to swap — see Open Questions.
- `src/pages/Index.tsx`: organizationData name + homepage SEOHead title/description.
- Other page-level SEOHead overrides (Services, AISolutions, Portfolio, Blog, Contact, ProjectBrief) updated to new brand in titles only — descriptions tweaked minimally to remove "WebDevPro".

**Misc copy sweep**
- `src/components/SmokeBackground` etc unaffected.
- ChatBot system prompt already updated previously — no change.

## Phase 2 — Homepage Restructure (`src/pages/Index.tsx` + components)

**New section order:**
1. Hero (unchanged visuals; copy already aligned)
2. **NEW: "What We Build"** — 3-card overview (Web Dev / AI Solutions / Custom Web Tools)
3. Featured Work
4. Services (Web Dev preview — existing `Services.tsx`, copy tightened)
5. AI Solutions Highlight (existing, copy tightened)
6. **REPLACED: "Built for Businesses Ready to Modernize"** — replaces ProcessSection on homepage (3 cards: Outdated Websites / Manual Workflows / Disconnected Technology)
7. Testimonials
8. Project Brief Highlight (LaunchPad)
9. Final CTA (copy revised)

**New components:**
- `src/components/WhatWeBuild.tsx` — 3-card grid using existing `card-unified card-feature` styling, gradient icons (Code2, Sparkles, Wrench), links to /services, /ai-solutions, /contact.
- `src/components/ModernizeSection.tsx` — 3-card grid replacing the homepage ProcessSection block; uses existing dark card styling with gradient accents.

**Edits:**
- `Index.tsx` — swap imports, reorder sections, replace `ProcessSection` with `ModernizeSection`, insert `WhatWeBuild` after hero.
- `HeroTypewriter`/hero copy — verify headline reads "Launch Your Business Into the Next Dimension" and supporting copy matches brief; light tweaks only.
- `CallToAction.tsx` — heading "Ready to Build a Stronger Digital Presence?" with revised body + Start Your Project / Explore Services CTAs.
- `Services.tsx` (homepage component) — replace "WebDevPro" mentions in heading/intro if any, tighten intro.
- `AISolutionsHighlight.tsx` — same: tighten intro to match practical-AI positioning.

**Out of scope for this pass (can follow):**
- AI Solutions page "Practical Process for AI Solutions" timeline section.
- Navigation label review (current nav already close).
- Logo asset design (using text lockup).
- ProcessSection.tsx file kept (still used on /services).

## Technical Notes
- All new sections wrapped in existing `ScrollReveal` for animation parity.
- Reuse design tokens: `card-unified`, `card-feature`, `icon-gradient-container`, `from-webdev-gradient-blue to-webdev-gradient-purple`.
- No backend, schema, or function changes.
- No new dependencies.

## Open Questions
1. **Domain**: Memory says canonical is `webdevpro.io`. Should I leave URLs/canonical untouched for now (rebrand visual + textual only), or also swap canonical to a new domain? Default: leave domain alone, swap only brand text.
2. **Header lockup style**: Plain `Version III` + "Web Services" subtext, or the developer-style `</Version III>` variant? Default: plain (cleaner, lower risk).
3. **Replace homepage ProcessSection entirely** with ModernizeSection (keeping ProcessSection on /services page only) — confirm.
