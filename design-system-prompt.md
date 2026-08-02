# UI/UX Redesign & Enhancement Prompt Template

> **How to use:** Copy this entire document at the start of any redesign request. Fill in the bracketed placeholders. The AI will use this as its design foundation and constraint system.

---

## 🎯 Project Context

**Project type:** [Landing page / Mobile app / Dashboard / Admin panel / etc.]
**Platform:** [Web / iOS / Android / Cross-platform]
**Project name:** [Your project name]
**One-line description:** [What this product does and who it's for]

---

## 🎨 Design System Foundation

Use the following as the non-negotiable visual foundation for this redesign. Do not deviate from these tokens unless explicitly told to.

### Color Palette

| Role | Token Name | Hex | Usage |
|------|------------|-----|-------|
| Background (primary) | `bg-base` | `#f4f3f0` | Main page background |
| Background (elevated) | `bg-surface` | `#fafaf8` | Cards, panels, modals |
| Background (dark) | `bg-dark` | `#1a1a1a` | Dark panels, split screens |
| Accent (primary) | `accent` | `#c92a2a` | CTAs, active states — use sparingly |
| Text (primary) | `text-primary` | `#1c1c1c` | Body copy, headings |
| Text (secondary) | `text-muted` | `#6b6b6b` | Captions, metadata, labels |
| Border | `border` | `#e2e0db` | Dividers, input outlines |
| White | `white` | `#ffffff` | Form fields, high-contrast elements |

**Palette philosophy:** Warm off-white instead of flat white. The base tones should feel like quality paper stock — never clinical or sterile. The red accent (`#c92a2a`) is a scalpel, not a paintbrush — applied only to the single most important interactive element per screen.

### Typography

**Primary typeface:** Plus Jakarta Sans (Google Fonts)
- Use for all body text, UI labels, navigation, and forms
- Weights in use: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

**Display typeface:** Plus Jakarta Sans ExtraBold (800) or a paired serif if the brief calls for editorial weight
- Use for hero headlines and section titles only

**Type scale:**

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Hero headline | 48–64px | 800 | 1.1 |
| Section title | 28–36px | 700 | 1.2 |
| Subsection / card title | 18–22px | 600 | 1.3 |
| Body | 15–16px | 400 | 1.6 |
| Label / caption | 12–13px | 500 | 1.4 |
| Button | 14px | 600 | — |

**Rules:**
- Sentence case everywhere (not Title Case for UI elements)
- No system fonts (Arial, Helvetica) — always load Plus Jakarta Sans
- Letter-spacing on uppercase labels: `0.06em`

### Spacing & Layout

- Base unit: `8px`
- Common spacing values: `8, 16, 24, 32, 48, 64, 96px`
- Content max-width: `1200px` (desktop), full-bleed for hero sections
- Mobile breakpoint: `768px`
- Card border-radius: `12px` (standard), `8px` (compact), `20px` (hero/feature cards)
- Input border-radius: `8px`
- Button border-radius: `8px`

### Elevation & Surfaces

- Avoid heavy drop shadows. Use `box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05)` for cards
- Dark panels use the `bg-dark` token — no pure black
- Borders instead of shadows preferred for inputs and dividers

---

## 🧩 Component Library

### BrandMark / Logo Treatment
- Use a custom dot/symbol icon — never a generic exclamation badge or letter-in-a-box
- Pair with wordmark in Plus Jakarta Sans SemiBold
- Dark version: white mark + white wordmark on `bg-dark`
- Light version: dark mark + dark wordmark on `bg-base` or `bg-surface`

### Buttons

| Variant | Style |
|---------|-------|
| Primary | `bg: #c92a2a`, white text, hover: darken 8% |
| Secondary | `bg: transparent`, `border: 1.5px solid #1c1c1c`, dark text |
| Ghost | No border, `text: #c92a2a`, underline on hover |
| Disabled | `opacity: 0.4`, `cursor: not-allowed` |

- All buttons: `height: 44px` minimum (touch target), `padding: 0 20px`
- Loading state: replace label with a subtle spinner, keep button width locked

### Form Inputs

- Background: `#ffffff`
- Border: `1.5px solid #e2e0db`
- Focus border: `1.5px solid #1c1c1c`
- Error border: `1.5px solid #c92a2a`
- Label: above input, `font-size: 13px`, `font-weight: 500`, `color: #6b6b6b`
- Error message: below input, `font-size: 12px`, `color: #c92a2a`
- No placeholder-as-label pattern

### Navigation / Header

- Transparent on hero, `bg-surface` on scroll (with subtle `border-bottom`)
- Logo left, nav links center (desktop), CTA button right
- "Sign in" link: ghost style — no filled button unless it's the primary CTA
- Mobile: hamburger → slide-in drawer

---

## 📐 Page Architecture Patterns

### Landing Page Pattern

Follow this structure unless the brief specifies otherwise:

```
[Header] — Logo + Nav + "Sign in" CTA (ghost)
[Hero] — Headline + 1-line description + primary CTA + phone/device mockup (right-aligned)
[Social proof] — logos or a single stat strip (optional)
[How it works] — 3 clear steps, numbered, icon + label + 1-line description
[Feature highlights] — 2–3 cards, benefit-led copy, no feature-dump
[Separate paths CTA] — Two-column split: one for each user type (e.g. individual vs authority)
[Footer] — Minimal: logo + key links + legal
```

**Key rules:**
- No login form on the landing page
- Marketing copy only — no system UI, no forms
- Phone/device mockup should show the actual product screen (points dashboard, etc.), not a generic placeholder
- Each section has one job; don't combine pitch + signup

### Login / Auth Page Pattern

Split-screen layout:

```
[Left panel — dark, bg-dark]
  BrandMark (white)
  Short brand statement or tagline
  Optional: subtle decorative element or blurred product screenshot

[Right panel — light, bg-surface or white]
  "Welcome back" / context-aware heading
  Unified form (adapts fields by role/mode)
  Role selector if applicable (tabs or segmented control)
  Primary submit button (accent color)
  Forgot password / Register links (ghost or text)
```

**Key rules:**
- One form that adapts — not two separate pages per role
- Loading state on submit: spinner in button, inputs disabled
- Errors inline, never in a toast for auth failures
- Link back to landing: subtle, top-left of right panel

### Dashboard Pattern

```
[Sidebar nav — dark or light depending on brief]
[Top bar — search, notifications, avatar]
[Main content area]
  Summary stat cards (3–4 across, key metrics)
  Primary data table or chart
  Secondary panels / recent activity
```

---

## ✍️ Copy & Voice Guidelines

- **Active voice always.** "Track your points" not "Points can be tracked"
- **Sentence case.** Headings, buttons, labels — no Title Case
- **Specificity over cleverness.** "See your 3 active branches" not "Manage locations"
- **No filler words.** Cut "seamlessly," "powerful," "robust," "intuitive"
- **Error messages name the problem and the fix.** "Incorrect password. Try again or reset it." — never just "Error."
- **Empty states invite action.** "No records yet. Add your first branch →"
- **Button labels match what happens next.** "Continue" if there's a next step. "Save" if it persists. "Send" if it goes somewhere.

---

## 🚫 Anti-Patterns (Never Do These)

- ❌ Flat pure white (`#ffffff`) as the page background
- ❌ Generic stock photography
- ❌ Heavy drop shadows or neumorphism
- ❌ All-caps body text or navigation labels
- ❌ Accent color (`#c92a2a`) on more than one element per section
- ❌ System fonts (Arial, Helvetica, sans-serif as the only declaration)
- ❌ Login form embedded on the landing/home page
- ❌ Placeholder text used as field labels (disappears on focus)
- ❌ Generic icon badges (`!` in a circle, letter-in-box logos)
- ❌ Inconsistent border-radius across the same page
- ❌ Toast notifications for form validation errors
- ❌ More than 2 font families on a single page

---

## 📱 Responsive Behavior

- **Mobile-first** CSS, scale up with breakpoints
- Touch targets: minimum `44×44px`
- Split-screen layouts stack vertically on mobile (dark panel becomes a slim header)
- Nav collapses to hamburger at `768px`
- Hero device mockup hides or shrinks to inline below headline on mobile
- Cards go full-width on mobile (`< 480px`)

---

## ♿ Accessibility Baseline

- Color contrast: minimum `4.5:1` for body text, `3:1` for large text
- Focus rings: visible, styled (not browser default), `2px offset`
- All interactive elements keyboard-navigable
- `aria-label` on icon-only buttons
- `prefers-reduced-motion`: disable transitions and animations
- Form inputs always have an associated `<label>` (not just placeholder)

---

## 🛠️ Tech Preferences

> Fill in your stack. The AI will use these when generating code.

- **Framework:** [React / Next.js / Vue / plain HTML+CSS / etc.]
- **Styling:** [Tailwind CSS / CSS Modules / Styled Components / plain CSS]
- **Icons:** [Lucide / Heroicons / Phosphor / etc.]
- **Fonts loaded via:** [Google Fonts / local / next/font]
- **Component style:** [Functional components with hooks / etc.]

---

## 📋 Per-Project Overrides

> Use this section to layer project-specific decisions on top of the base system above.

**Current project specifics:**
- [e.g., "This is a kiosk loyalty app. Primary users are store cashiers and customers."]
- [e.g., "The mobile app has a points dashboard as its main screen — feature this in the hero mockup."]
- [e.g., "Two user roles: Individual and Authority. The login form adapts fields based on role selection."]
- [e.g., "Navigation paths: `/` for landing, `/login` for auth, `/dashboard` for app."]

**Screens to redesign (list them):**
1. [Screen name + route + current issue]
2. [Screen name + route + current issue]
3. [Screen name + route + current issue]

**Specific constraints or must-haves:**
- [e.g., "The BrandMark must use the dot icon, not the exclamation badge."]
- [e.g., "Keep the 3-step 'How it works' section but make it cleaner."]

---

*End of design system prompt. The AI should treat everything above as the authoritative design constraint for this project and apply it without drifting toward generic defaults.*
