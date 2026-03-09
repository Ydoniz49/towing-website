# Copilot Instructions for 24/7 Towing Services

## Project Overview
Multi-location towing & roadside assistance **lead generation site** built with **React 19 + TypeScript + Vite + MUI**. Core objective: Convert visitors via forms, local SEO, and clean UI/UX. Deployed on Vercel with serverless lead submission handler. Static-first architecture: no backend database (forms integrate via Twilio SMS + optional email/CRM).

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
- **Lead submission**: Form data POSTed to `/api/submit-lead` (serverless endpoint in `api/submit-lead.js`); includes optional reCAPTCHA v3 token
- **reCAPTCHA v3**: Lazily injected (see `src/utils/recaptcha.ts`); requires `VITE_RECAPTCHA_SITE_KEY` env var; graceful no-op if unconfigured
- **Analytics integration**: All form submissions tracked via `track()` function (GA4 if `VITE_GA_MEASUREMENT_ID` set)

## Critical Workflows

### Development
```bash
npm run dev          # Start Vite dev server (HMR enabled)
npm run build        # TypeScript check + production build
npm run lint         # ESLint check
npm run preview      # Preview production build locally
```

### Environment Variables
Required for production (set in Vercel dashboard or `.env.local` for local dev):
- `VITE_GA_MEASUREMENT_ID` — GA4 measurement ID for analytics (optional)
- `VITE_RECAPTCHA_SITE_KEY` — reCAPTCHA v3 site key (optional; graceful no-op if missing)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` — For SMS alerts via serverless handler
- `ALERT_TO` — Phone number to receive lead SMS alerts
- `RECAPTCHA_SECRET` — reCAPTCHA secret for server-side verification (optional)

### Adding a New Location
1. Add entry to `LOCATIONS` array in `src/data/locations.ts` with all required fields (`slug`, `name`, `city`, `state`, `phone`, `coords`, `radiusMiles`)
2. Ensure `", IL"` (or state abbreviation) is included in display names for consistency
3. Location page auto-renders via dynamic route; schema injection happens automatically

### Serverless Lead Handler (`api/submit-lead.js`)
**Architecture**: ESM endpoint runs on Vercel with 1GB memory, 10s timeout. Handles form submissions with rate limiting, reCAPTCHA verification, and Twilio SMS dispatch.

**Key patterns**:
- **Rate limiting**: In-memory store (resets on cold start), 5 requests per IP per 15 minutes
- **Twilio integration**: Sends formatted SMS to `ALERT_TO` with lead details + location info
- **reCAPTCHA verification**: Server-side verify if `RECAPTCHA_SECRET` and token provided; accepts request if verification fails (graceful fallback)
- **Error handling**: Always returns JSON; logs errors to stderr visible in Vercel dashboard
- **No database**: Pure serverless; logs rely on external integration (Twilio, email service)

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
- **noUnusedLocals/noUnusedParameters**: Strict enforcement; ESLint catches unreferenced vars
- **Erasable syntax**: Only importable const declarations; no runtime value exports for types

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
- **Twilio**: SMS delivery for lead alerts (server-side only in serverless handler)
- **Google Analytics 4**: Lazy-loaded via `initAnalytics()` in `src/App.tsx`, graceful no-op if `VITE_GA_MEASUREMENT_ID` unset
- **reCAPTCHA v3**: Lazy-loaded script, graceful fallback if unconfigured
- **Leaflet**: Interactive radius maps on location pages
- **React Router v7**: Dynamic routing with lazy-loaded page components

## Key Files Reference
- `src/main.tsx` — App entry, MUI theme config
- `src/App.tsx` — Routing, lazy imports, header/footer, mobile drawer
- `src/data/locations.ts` — All location data with `LocationInfo` type; single source of truth
- `src/utils/schema.ts` — JSON-LD schema generators (`generateLocalBusinessSchema()`, `injectSchema()`)
- `src/utils/analytics.ts` — GA4 lazy-load helper (`initAnalytics()`, `track()`)
- `src/utils/recaptcha.ts` — reCAPTCHA v3 execution (`executeRecaptcha()`)
- `src/components/BlogLayout.tsx` — Shared blog SEO wrapper with auto-managed meta tags & JSON-LD
- `src/components/LeadCaptureForm.tsx` — Main lead form with vehicle year→make→model cascading selects
- `src/components/ServicesSection.tsx` — Service card grid (home + locations)
- `src/services/vehicleApi.ts` — NHTSA API integration (`getMakes()`, `getModels()`)
- `api/submit-lead.js` — Serverless handler: rate-limiting, reCAPTCHA verify, Twilio SMS dispatch
- `vercel.json` — Vercel serverless config (1GB memory, 10s timeout for lead handler)
- `public/rss.xml`, `public/feed.json` — Static feed files with autodiscovery links in `index.html`

## Testing & Validation
- **No test suite yet**: Validate changes via `npm run build` (TypeScript + ESLint check) and manual browser testing
- **Structured data**: Use Google Rich Results Test or Schema.org validator for JSON-LD
- **Feed validation**: W3C Feed Validator for RSS, JSON Feed spec checker for JSON feed
- **Analytics**: Check GA4 dashboard or browser network tab for `gtag('event', ...)` calls
- **reCAPTCHA**: Browser console warns if `VITE_RECAPTCHA_SITE_KEY` unset; never blocks form submission

---

## Additional Patterns & Utilities

### Analytics (`src/utils/analytics.ts`)
- **Lazy-loaded GA4**: Only injects gtag script if `VITE_GA_MEASUREMENT_ID` env var set
- **No-op track()**: Safe to call anywhere; graceful fail if GA not initialized
- **Events tracked**: Form submissions via `track('submit_lead', {...})` in lead capture forms

### reCAPTCHA (`src/utils/recaptcha.ts`)
- **Action-based**: Each form uses different action name (`submit_lead`, `submit_junk_car`, etc.)
- **Graceful fallback**: Returns `null` if `VITE_RECAPTCHA_SITE_KEY` unset; forms still submit
- **Server verification**: `/api/submit-lead` verifies token if `RECAPTCHA_SECRET` + token present; accepts on verify failure

### LocationInfo Type (`src/data/locations.ts`)
```typescript
type LocationInfo = {
  slug: string;                    // Used in URL routes
  name: string;                    // Display name (e.g., "24/7 Towing — Plainfield, IL")
  city: string;                    // For schema + UI
  state: string;                   // 2-letter code
  phone: string;                   // tel: compatible
  coords: { lat: number; lng: number };
  radiusMiles: number;             // For radius circle on map
  description?: string;
  services?: string[];             // Service list on location page
  seo?: { eta?: string; highways?: string[]; neighborhoods?: string[]; zipCodes?: string[] };
};
```

---
*Last updated: 2025-01-24*
