---
name: Monochrome Absolute
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1c'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.1em
  caption:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
spacing:
  unit: 4px
  container-max: 1440px
  gutter-desktop: 24px
  margin-desktop: 64px
  gutter-mobile: 16px
  margin-mobile: 20px
---

## Brand & Style

The design system is engineered for the high-end luxury e-commerce sector, specifically targeting a sophisticated, fashion-forward global audience. The brand personality is authoritative yet understated, allowing the product photography to serve as the primary visual hero.

The aesthetic follows a **Strict Minimalist** movement. It prioritizes clarity, structural integrity, and the removal of the superfluous. By utilizing a high-ratio of white space (negative space), the UI evokes an "art gallery" emotional response—clean, quiet, and premium. Design decisions are governed by a rigid adherence to alignment and proportion, ensuring the interface feels intentional and curated.

## Colors

The palette is strictly monochrome to maintain a high-fashion editorial feel. 

- **Primary (#000000):** Used for core branding, primary typography, and call-to-action backgrounds. It represents strength and timelessness.
- **Secondary (#FFFFFF):** The foundational canvas. Generous use of white creates the "luxury breathability" required for high-price-point items.
- **Tertiary (#767676):** Reserved for secondary information, metadata, and breadcrumbs to create a clear visual hierarchy without distracting from the black/white contrast.
- **Neutral (#F5F5F5):** A very light grey used for subtle section separators or background containers to provide depth without introducing a new hue.

## Typography

The typography utilizes **Inter**, a highly systematic and neutral sans-serif that echoes the modernist clarity of Helvetica while offering superior digital legibility. 

- **Weight Strategy:** Use 'Light' (300) for large display headers to convey elegance. Use 'Regular' (400) for body and secondary headers. 'SemiBold' (600) is reserved strictly for functional labels and micro-copy.
- **Scaling:** Headlines scale down significantly for mobile to maintain a tight, editorial look.
- **Uppercase:** Labels and small navigational elements use uppercase with increased letter-spacing to create a distinctive "luxury label" aesthetic.

## Layout & Spacing

The design system utilizes a **Fixed Grid** philosophy on desktop to maintain strict control over line lengths and image aspect ratios, transitioning to a fluid model on smaller devices.

- **Desktop (1440px):** 12-column grid. The generous 64px outer margins act as a frame, pushing the content into a focused central stage.
- **Spacing Rhythm:** Based on a 4px baseline. Vertical spacing between sections should be aggressive (e.g., 80px, 120px, or 160px) to reinforce the minimalist narrative.
- **Consistency:** Align all elements—text, images, and buttons—to the same vertical grid lines. Avoid staggering heights in product grids.

## Elevation & Depth

This design system rejects shadows and blurs in favor of **Low-Contrast Outlines** and **Tonal Layers**. Depth is communicated through structural layering rather than physical simulation.

- **Borders:** Use 1px solid strokes in `#E5E5E5` for structural separation.
- **Surfaces:** All surfaces are flat. Interactive elements do not "lift" on hover; instead, they utilize color inversions (e.g., a white button becomes black) to indicate state.
- **Overlays:** Full-screen takeovers for menus and search use solid white backgrounds with no transparency to maintain a clean, opaque environment.

## Shapes

The shape language is strictly **Sharp (0px)**. 

No border radii are permitted on any UI elements, including buttons, input fields, or cards. This architectural approach emphasizes precision and mimics the sharp edges of high-fashion tailoring and luxury packaging. Circular elements are only permitted for specific functional icons (like a "Close" 'X' within a circle) or status indicators.

## Components

### Buttons
- **Primary:** Solid black background, white text (Inter SemiBold, 14px, Uppercase). No border.
- **Secondary:** Solid white background, 1px black border, black text.
- **Hover State:** Invert colors completely. 0.2s ease-in-out transition.

### Product Cards
- **Style:** Zero-border, zero-shadow. 
- **Image:** 3:4 aspect ratio. 
- **Typography:** Brand name in `label-caps`, product name in `body-md`, and price in `body-md` (Regular).
- **Hover:** Show secondary product image or a subtle "Quick Add" text-only button.

### Input Fields
- **Style:** 1px bottom-border only. 
- **Labels:** Floating labels using `label-caps` at 10px.
- **State:** Border color changes from light grey to black on focus.

### Icons
- **Style:** 1.5pt stroke weight. Geometric, minimal, and non-rounded. Use only when necessary for global actions (Cart, Search, Profile).

### Lists & Navigation
- **Style:** Large horizontal lists for categories. Use `headline-md` for main navigation items with significant padding (32px+) between links.