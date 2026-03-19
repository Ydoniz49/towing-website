# Security & Analytics Setup Guide

## reCAPTCHA v3 (Optional but Recommended)

### 1. Get reCAPTCHA v3 Keys
1. Go to https://www.google.com/recaptcha/admin/create
2. Choose **reCAPTCHA v3**
3. Add your domain (for example, `yourdomain.com`)
4. Copy your **Site Key** and **Secret Key**

### 2. Add Environment Variables in Cloudflare Pages
Go to Cloudflare Dashboard → Workers & Pages → your project → Settings → Variables and Secrets.

Set these for both Preview and Production:
- `VITE_RECAPTCHA_SITE_KEY` (site key)
- `RECAPTCHA_SECRET` (secret key)

After adding variables, redeploy to apply them.

### 3. How It Works
- Client generates an invisible reCAPTCHA token on form submit
- Token is sent to `/api/submit-lead`
- Cloudflare function verifies token with Google
- If `RECAPTCHA_SECRET` is set and verification fails, form is rejected (HTTP 400)
- If `RECAPTCHA_SECRET` is not set, verification is skipped (graceful fallback)

---

## Google Analytics 4 (GA4)

### 1. Create GA4 Property
1. Go to https://analytics.google.com/
2. Admin → Create Property
3. Follow setup wizard
4. Copy the **Measurement ID** (format `G-XXXXXXXXXX`)

### 2. Add Environment Variable in Cloudflare Pages
Set for both Preview and Production:
- `VITE_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`

Redeploy after adding the variable.

### 3. Tracked Events
Once configured, the site tracks:

| Event | Trigger | Parameters |
|-------|---------|------------|
| `phone_click` | User clicks header phone button | `placement: 'header'` |
| `service_card_click` | User clicks service card CTA | `service`, `href` |
| `lead_submit` | Form submitted successfully | `service`, `location`, `vehicle`, `source` |
| `blog_read` | User views a blog article | `title`, `slug`, `category: 'blog'` |

### 4. View Events in GA4
- Go to Analytics → Reports → Realtime
- Submit a form or interact with pages
- Events should appear in a few seconds

---

## Rate Limiting

Rate limiting is enabled in `functions/api/submit-lead.js`:
- Max 5 requests per IP per 15-minute window
- Returns HTTP 429 when exceeded
- Window resets automatically
- IP is hashed for privacy (SHA-256, first 16 chars stored)

Note: current store is in-memory and may reset between isolates or cold starts.

### Testing Rate Limit
```bash
# Submit the form 6 times quickly from the same IP.
# The 6th request should return HTTP 429.
```

---

## Current Protection Stack

✅ Honeypot hidden `company` field
✅ Rate limiting (5 requests / 15 min per IP)
✅ Optional reCAPTCHA v3 verification
✅ Phone validation (minimum 10 digits)
✅ API gating with `VITE_ENABLE_API=true`

---

## Troubleshooting

### reCAPTCHA Not Working
1. Check browser console for site key errors
2. Verify `VITE_RECAPTCHA_SITE_KEY` is set before build
3. Hard refresh browser cache
4. Check Cloudflare function logs for verification errors

### GA4 Events Not Appearing
1. Verify `VITE_GA_MEASUREMENT_ID` is set
2. Redeploy after adding env var
3. Open browser devtools Network tab and filter `google-analytics`
4. Confirm requests to `google-analytics.com/g/collect`
5. Realtime appears quickly, standard reports can take longer

### Rate Limit Too Strict
Edit `functions/api/submit-lead.js`:
```javascript
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
```

---

## Next Steps

1. Add reCAPTCHA keys
2. Set up GA4 property
3. Test both form flows end-to-end
4. Verify Twilio SMS delivery
5. Review function logs after launch
