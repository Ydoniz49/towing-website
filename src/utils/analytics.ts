// Minimal analytics helper that only initializes when a GA4 Measurement ID is provided
// Usage: call initAnalytics() once (e.g., in App), then track('event_name', params)

let initialized = false;

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

export function initAnalytics() {
  const mid = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!mid || initialized) return;
  // Inject gtag script lazily
  const s1 = document.createElement('script');
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${mid}`;
  document.head.appendChild(s1);

  const s2 = document.createElement('script');
  s2.innerHTML = `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${mid}');`;
  document.head.appendChild(s2);
  initialized = true;
}

export function track(event: string, params?: Record<string, unknown>) {
  // no-op if GA not present
  const w = window as AnalyticsWindow;
  if (typeof w.gtag === 'function') {
    w.gtag('event', event, params || {});
  }
}
