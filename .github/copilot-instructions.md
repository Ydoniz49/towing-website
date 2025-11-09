# Copilot Instructions for 24/7 Towing Services

## Project Overview
Multi-location towing & roadside assistance lead generation site built with **React 19 + TypeScript + Vite + MUI**. Core objective: Convert visitors via forms, local SEO, and clean UI/UX.

## Architecture & Key Patterns

### Theme & Styling
- **MUI theme defined in `src/main.tsx`**: Global component overrides for buttons (keep white text on hover, stable background), custom palette with `primary.main: '#ff385c'` (accent pink)
- **CSS baseline in `src/index.css`**: Neutralizes anchor hover colors, prevents MUI button-anchor underlines, limits native button hover styles
- **Design system**: Elevation 6 cards, borderRadius 3, pill-shaped buttons (`borderRadius: 999`), hover lift transforms (`translateY(-8px) scale(1.03)`)

### Routing & Code Splitting
- **Lazy-loaded pages** via `React.lazy()` in `src/App.tsx`: All major routes (HomePage, ServicesPage, LocationPage, blog posts) are code-split with `<Suspense>` fallbacks
- **Dynamic location routes**: `src/pages/LocationPage.tsx` reads `:slug` param and looks up `LOCATION_BY_SLUG` from `src/data/locations.ts`
- **Blog routes**: Each article has dedicated route (`/blog/emergency-towing-guide`, etc.) and uses shared `BlogLayout` component

### SEO & Structured Data
- **Location pages**: Inject `LocalBusiness` JSON-LD via `src/utils/schema.ts` → `generateLocalBusinessSchema()` + `injectSchema()` in `useEffect` cleanup
- **Blog posts**: Use `<BlogLayout>` wrapper (see `src/components/BlogLayout.tsx`) which automatically manages:
  - Document title & meta description
  - Canonical `<link>` tag
  - `BlogPosting` JSON-LD schema with author, publisher, datePublished, image
- **Feeds**: RSS (`/rss.xml`) and JSON Feed (`/feed.json`) in `public/` with autodiscovery links in `index.html`

### Data Management
- **Locations**: Single source of truth in `src/data/locations.ts` → exported `LOCATIONS` array and `LOCATION_BY_SLUG` map. Each location has `slug`, `name`, `city`, `state`, `phone`, `coords`, `radiusMiles`, `description`, optional `seo` metadata
- **Vehicle API**: `src/services/vehicleApi.ts` fetches make/model lists from NHTSA API. Used in both main lead form (`LeadCaptureForm`) and junk car form (`CashForJunkCarsPage`) for dynamic year→make→model dropdowns

### Forms & Lead Capture
- **react-hook-form** for all forms (see `src/components/LeadCaptureForm.tsx`, `src/pages/CashForJunkCarsPage.tsx`)
- **Dynamic vehicle selects**: Year drives make fetch, make drives model fetch; loading states show `CircularProgress`; disabled until dependencies resolve
- **Validation**: Simple required checks and type safety; no external schema lib currently

## Critical Workflows

### Development
```bash
npm run dev          # Start Vite dev server (HMR enabled)
npm run build        # TypeScript check + production build
npm run lint         # ESLint check
npm run preview      # Preview production build locally
```

### Adding a New Location
1. Add entry to `LOCATIONS` array in `src/data/locations.ts` with all required fields (`slug`, `name`, `city`, `state`, `phone`, `coords`, `radiusMiles`)
2. Ensure `", IL"` (or state abbreviation) is included in display names for consistency
3. Location page auto-renders via dynamic route; schema injection happens automatically

### Adding a Blog Post
1. Create new page in `src/pages/blog/` (e.g., `MyNewPost.tsx`)
2. Wrap content in `<BlogLayout>` with props: `title`, `description`, `canonicalPath`, `datePublished`, optional `image`
3. Add lazy import and route in `src/App.tsx`
4. Add post metadata to `posts` array in `src/pages/BlogPage.tsx`
5. Update RSS (`public/rss.xml`) and JSON Feed (`public/feed.json`) manually

### Linking Service Cards
Service cards in `src/components/ServicesSection.tsx` use `href` prop for deep-linking. Button text comes from optional `cta` prop (defaults to "Learn more"). Example:
```tsx
{ title: 'Emergency Towing', desc: '...', icon: <Icon />, href: '/blog/emergency-towing-guide' }
```

## Project-Specific Conventions

### Type Safety
- **verbatimModuleSyntax enabled**: Import types with `import type { X }` syntax (see `src/components/BlogLayout.tsx`)
- **Strict nullability**: Check for `null`/`undefined` before DOM manipulation (meta tags, canonical links)

### Component Patterns
- **Shared sections**: `ServicesSection` and `ContactSection` reused across multiple pages (home, locations) with consistent card styling
- **Icon badges**: 72×72px rounded squares with 10% opacity background, primary color icon at 40px
- **CTA hierarchy**: Primary actions use `variant="contained" color="primary"`, secondary use `variant="outlined"`

### Mobile-First Responsive
- **Breakpoints**: `xs` (mobile), `sm`, `md` (tablet+), `lg`, `xl` (wide desktop)
- **Grid layouts**: Use MUI `sx` prop with responsive object values, e.g., `gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(260px, 1fr))' }`
- **Header**: Floating pill-shaped nav with mobile hamburger drawer (see `src/App.tsx`)

### External Dependencies
- **MUI Icons**: `@mui/icons-material` for all icons (LocalShipping, Build, BatteryChargingFull, etc.)
- **NHTSA Vehicle API**: Free public API, no auth required; may rate-limit on heavy usage
- **No backend**: Static site, forms likely need integration with email/CRM service (not yet implemented)

## Key Files Reference
- `src/main.tsx` — App entry, MUI theme config
- `src/App.tsx` — Routing, lazy imports, header/footer, mobile drawer
- `src/data/locations.ts` — All location data
- `src/utils/schema.ts` — JSON-LD schema generators
- `src/components/BlogLayout.tsx` — Shared blog SEO wrapper
- `src/components/ServicesSection.tsx` — Service card grid (home + locations)
- `src/services/vehicleApi.ts` — NHTSA integration
- `public/rss.xml`, `public/feed.json` — Static feed files

## Testing & Validation
- **No test suite yet**: Validate changes via `npm run build` (TypeScript check) and manual browser testing
- **Structured data**: Use Google Rich Results Test or Schema.org validator for JSON-LD
- **Feed validation**: W3C Feed Validator for RSS, JSON Feed spec checker for JSON feed

---
*Last updated: 2025-11-08*
