# Security & Analytics Setup Guide

## reCAPTCHA v3 (Optional but Recommended)

### 1. Get reCAPTCHA v3 Keys
1. Go to https://www.google.com/recaptcha/admin/create
2. Choose **reCAPTCHA v3**
3. Add your domain (e.g., `yourdomain.com`)
4. Copy your **Site Key** and **Secret Key**

### 2. Add Environment Variables in Vercel
Go to your Vercel project → Settings → Environment Variables:

**Production & Preview:**
- `VITE_RECAPTCHA_SITE_KEY` = (your site key from step 1)
- `RECAPTCHA_SECRET` = (your secret key from step 1)

**Important:** After adding these, redeploy for them to take effect.

### 3. How It Works
- Client generates invisible reCAPTCHA token on form submit
- Token sent to `/api/submit-lead` in payload
- Server verifies token with Google
- If verification enabled (RECAPTCHA_SECRET set) but fails, form rejected with 400
- If RECAPTCHA_SECRET not set, verification is skipped (graceful fallback)

---

## Google Analytics 4 (GA4)

### 1. Create GA4 Property
1. Go to https://analytics.google.com/
2. Admin → Create Property
3. Follow setup wizard (enter your site URL)
4. Copy your **Measurement ID** (looks like `G-XXXXXXXXXX`)

### 2. Add Environment Variable in Vercel
**Production & Preview:**
- `VITE_GA_MEASUREMENT_ID` = G-XXXXXXXXXX

### 3. Tracked Events
Once GA4 is configured, the site will automatically track:

| Event | Trigger | Parameters |
|-------|---------|------------|
| `phone_click` | User clicks header phone button | `placement: 'header'` |
| `service_card_click` | User clicks service card CTA | `service`, `href` |
| `lead_submit` | Form successfully submitted | `service`, `location`, `vehicle`, `source` |
| `blog_read` | User views blog article | `title`, `slug`, `category: 'blog'` |

### 4. View Events in GA4
- Go to Analytics → Reports → Realtime
- Submit a form or click around the site
- Events should appear within ~5 seconds

---

## Rate Limiting

**Already enabled** in `/api/submit-lead`:
- Max 5 requests per IP per 15-minute window
- Returns HTTP 429 (Too Many Requests) when exceeded
- Automatically resets after window expires
- IP hashed for privacy (SHA-256, first 16 chars stored)

**Note:** Rate limit store is in-memory, resets on serverless function cold starts (~15-30 min of inactivity).

### Testing Rate Limit
```bash
# Submit form 6 times rapidly from same IP
# 6th submission should return 429 with error message
```

---

## Current Protection Stack

✅ **Honeypot** - Hidden `company` field catches bots  
✅ **Rate Limiting** - 5 requests / 15 min per IP  
✅ **reCAPTCHA v3** - Optional invisible verification (if keys set)  
✅ **Phone Validation** - Requires 10-digit US phone  
✅ **Environment Gating** - API disabled unless `VITE_ENABLE_API=true`

---

## Troubleshooting

### reCAPTCHA Not Working
1. Check browser console for errors about site key
2. Verify `VITE_RECAPTCHA_SITE_KEY` set in Vercel **before build**
3. Hard refresh (Cmd+Shift+R) to clear cached JS
4. Check Vercel function logs for reCAPTCHA verification failures

### GA4 Events Not Appearing
1. Verify `VITE_GA_MEASUREMENT_ID` set in Vercel
2. Redeploy after adding the env var
3. Open browser console → Network tab → filter "google-analytics"
4. Should see POST requests to `google-analytics.com/g/collect`
5. Wait up to 24 hours for events to appear in standard reports (Realtime is instant)

### Rate Limit Too Strict
Edit `api/submit-lead.js`:
```javascript
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // Change to 30 * 60 * 1000 for 30 min
const RATE_LIMIT_MAX_REQUESTS = 5; // Change to 10 for more lenient limit
```

---

## Next Steps

1. **Add reCAPTCHA keys** (recommended before going live)
2. **Set up GA4 property** (can wait until site is live)
3. **Test form submissions** to verify SMS + all security layers
4. **Monitor GA4 Realtime** after launch to validate tracking
5. **Review Twilio logs** for successful SMS delivery

---

**Questions?** Check Vercel function logs (Project → Functions → api/submit-lead → Logs) for detailed error messages.
