// centralised configuration values sourced from environment variables
// makes it easy to deploy the same codebase with different branding/data.

export const SITE_NAME = import.meta.env.VITE_SITE_NAME || '24/7 Towing Services';
export const HERO_TITLE = import.meta.env.VITE_HERO_TITLE || '24/7 Emergency Towing Services';
export const HERO_SUBTITLE =
  import.meta.env.VITE_HERO_SUBTITLE ||
  'Fast, Reliable & Professional Towing Service When You Need It Most';
export const HERO_PHONE = import.meta.env.VITE_HERO_PHONE || '1-800-TOWING';
export const PHONE = HERO_PHONE; // general purpose phone number


export const BLOG_AUTHOR = import.meta.env.VITE_BLOG_AUTHOR || '24/7 Towing Team';
export const BLOG_PUBLISHER =
  import.meta.env.VITE_BLOG_PUBLISHER || '24/7 Towing Services';

export const DEFAULT_LOCATION_SLUG =
  import.meta.env.VITE_DEFAULT_LOCATION_SLUG || 'plainfield';

// helper to pick location record either from hostname mapping or default slug
import { LOCATION_BY_SLUG } from './data/locations';

const HOST_MAP: Record<string, string> = {
  // add any special hostname->slug mappings here
};

export function getCurrentLocation() {
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const slug = HOST_MAP[host] || DEFAULT_LOCATION_SLUG;
  return LOCATION_BY_SLUG[slug] || null;
}
