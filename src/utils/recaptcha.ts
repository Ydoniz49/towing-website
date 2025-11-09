// reCAPTCHA v3 utility
// Site key must be set via VITE_RECAPTCHA_SITE_KEY env var

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, params: unknown) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/**
 * Execute reCAPTCHA v3 and return a token
 * @param action - Action name for this verification (e.g., 'submit_lead', 'submit_junk_car')
 * @returns Promise<string | null> - Returns token or null if reCAPTCHA unavailable
 */
export async function executeRecaptcha(action: string): Promise<string | null> {
  // If no site key configured, skip reCAPTCHA
  if (!SITE_KEY) {
    console.warn('[recaptcha] VITE_RECAPTCHA_SITE_KEY not set, skipping verification');
    return null;
  }

  // If grecaptcha not loaded yet, skip
  if (!window.grecaptcha) {
    console.warn('[recaptcha] grecaptcha not loaded, skipping verification');
    return null;
  }

  try {
    return await new Promise<string>((resolve, reject) => {
      window.grecaptcha!.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(SITE_KEY!, { action });
          resolve(token);
        } catch (err) {
          console.error('[recaptcha] Execute failed:', err);
          reject(err);
        }
      });
    });
  } catch (err) {
    console.error('[recaptcha] Error executing reCAPTCHA:', err);
    return null;
  }
}

/**
 * Initialize reCAPTCHA v3 (call after script loads)
 * Only needed if using explicit render mode
 */
export function initRecaptcha(): void {
  if (!SITE_KEY) return;
  
  if (window.grecaptcha) {
    window.grecaptcha.ready(() => {
      console.log('[recaptcha] reCAPTCHA v3 ready with site key:', SITE_KEY.substring(0, 10) + '...');
    });
  }
}
