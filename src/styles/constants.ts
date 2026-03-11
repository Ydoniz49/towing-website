// shared visual constants to keep the design vocabulary consistent across
// components. values here are based on the system described in
// .github/copilot-instructions.md (border radius 3, pill buttons, etc.)

/** border radius applied to cards/papers via theme override; exposed here
 * mostly for places where you still need an explicit value in sx props
 * (e.g. manual <Box> wrappers). */
export const BORDER_RADIUS = 3;

/** Box used around icons in service/contact cards */
export const ICON_BOX = {
  size: 72,
  radius: '16px',
  bg: 'rgba(255,56,92,0.1)', // 10% opacity primary pink
  color: 'primary.main' as const,
};

/** generic card hover effect (transform + shadow) */
export const HOVER_EFFECT = {
  transform: 'scale(1.03) translateY(-8px)',
  boxShadow: '0 12px 48px rgba(16,24,40,0.18)',
};

/** subtle red gradient used beneath headers in a few sections */
export const SUBTLE_PINK_GRADIENT =
  'linear-gradient(160deg, rgba(255,56,92,0.12), rgba(255,56,92,0) 75%)';

// gradient used for featured service card background
export const FEATURED_SERVICE_GRADIENT =
  'linear-gradient(160deg, rgba(255,56,92,0.2), rgba(35,40,48,1) 45%, rgba(35,40,48,1) 100%)';

/** background overlay used on home/services wrappers */
export const LIGHT_TRANSPARENT_BG = 'rgba(255,255,255,0.02)';

// shared content width used across page sections to keep the site feeling
// intentionally narrow and mobile-first, even on desktop.
export const SECTION_MAX_WIDTH = 'md' as const;

// various alpha variants of primary pink used around the UI
export const PINK_10 = 'rgba(255,56,92,0.1)';
export const PINK_20 = 'rgba(255,56,92,0.2)';
export const PINK_28 = 'rgba(255,56,92,0.28)';
export const PINK_35 = 'rgba(255,56,92,0.35)';
export const PINK_40 = 'rgba(255,56,92,0.4)';
export const PINK_45 = 'rgba(255,56,92,0.45)';
