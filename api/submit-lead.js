// Serverless endpoint (Vercel/Netlify compatible) - ESM version
// IMPORTANT: Do not hardcode secrets. Set environment variables on your host.
// Required env vars:
// - TWILIO_ACCOUNT_SID
// - TWILIO_AUTH_TOKEN
// - TWILIO_FROM (Twilio SMS-enabled number, e.g., +18151234567)
// - ALERT_TO (Your personal/dispatch mobile number to receive alerts)
// - RECAPTCHA_SECRET (optional; if present and body.recaptchaToken provided, verify it)

import https from 'https';

function jsonResponse(res, status, data) {
  if (res && typeof res.status === 'function') {
    // Vercel style
    return res.status(status).json(data);
  }
  // Netlify style
  return { statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
}

async function verifyRecaptcha(token, remoteip) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret || !token) return { ok: true };
  const payload = new URLSearchParams({ secret, response: token, remoteip: remoteip || '' }).toString();
  return new Promise((resolve) => {
    const req = https.request({
      method: 'POST',
      host: 'www.google.com',
      path: '/recaptcha/api/siteverify',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(payload) },
    }, (resp) => {
      let data = '';
      resp.on('data', (c) => (data += c));
      resp.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ ok: !!json.success, score: json.score });
        } catch {
          resolve({ ok: false });
        }
      });
    });
    req.on('error', () => resolve({ ok: false }));
    req.write(payload);
    req.end();
  });
}

async function sendSmsTwilio({ body }) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, ALERT_TO } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM || !ALERT_TO) {
    throw new Error('Missing Twilio env vars (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, ALERT_TO)');
  }
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  const postData = new URLSearchParams({ From: TWILIO_FROM, To: ALERT_TO, Body: body }).toString();
  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'POST',
      host: 'api.twilio.com',
      path: `/2010-04-01/Accounts/${encodeURIComponent(TWILIO_ACCOUNT_SID)}/Messages.json`,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (resp) => {
      let data = '';
      resp.on('data', (c) => (data += c));
      resp.on('end', () => {
        if (resp.statusCode && resp.statusCode >= 200 && resp.statusCode < 300) {
          resolve({ ok: true, status: resp.statusCode, body: data });
        } else {
          reject(new Error(`Twilio error ${resp.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function sanitizePhone(p) {
  return (p || '').replace(/\D/g, '');
}

function buildSmsBody(lead) {
  const lines = [];
  lines.push('New Website Lead');
  if (lead.service) lines.push(`Service: ${lead.service}`);
  if (lead.name) lines.push(`Name: ${lead.name}`);
  if (lead.phone) lines.push(`Phone: ${lead.phone}`);
  if (lead.year || lead.make || lead.model) lines.push(`Vehicle: ${lead.year || ''} ${lead.make || ''} ${lead.model || ''}`.trim());
  if (lead.locationSlug) lines.push(`Location: ${lead.locationSlug}`);
  if (lead.notes) lines.push(`Notes: ${lead.notes}`);
  lines.push(`Source: ${lead.source || 'web'}`);
  lines.push(`Time: ${lead.timestamp || new Date().toISOString()}`);
  return lines.join('\n');
}

async function handlerImpl(req, res, rawEvent) {
  try {
    // Log environment check (safe to log presence, not values)
    console.log('[submit-lead] Env check:', {
      hasSID: !!process.env.TWILIO_ACCOUNT_SID,
      hasAuth: !!process.env.TWILIO_AUTH_TOKEN,
      hasFrom: !!process.env.TWILIO_FROM,
      hasAlertTo: !!process.env.ALERT_TO,
    });

    const method = req?.method || rawEvent?.httpMethod;
    if (method !== 'POST') {
      return jsonResponse(res, 405, { ok: false, error: 'Method not allowed' });
    }

    let bodyText = req?.body;
    if (!bodyText && rawEvent?.body) bodyText = rawEvent.body;
    // Netlify sends body as string, Vercel may parse; normalize to object
    const isString = typeof bodyText === 'string';
    const data = isString ? JSON.parse(bodyText) : bodyText || {};
    console.log('[submit-lead] Received submission for service:', data.service);

    // Honeypot check
    if (data.company) {
      return jsonResponse(res, 200, { ok: true, id: 'ignored-honeypot' });
    }

    // reCAPTCHA v3 verify if provided
    const ip = req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || undefined;
    const recaptcha = await verifyRecaptcha(data.recaptchaToken, Array.isArray(ip) ? ip[0] : ip);
    if (process.env.RECAPTCHA_SECRET && !recaptcha.ok) {
      return jsonResponse(res, 400, { ok: false, error: 'Recaptcha failed' });
    }

    // Basic validation
    const phone = sanitizePhone(data.phone);
    if (!phone || phone.length < 10) {
      return jsonResponse(res, 400, { ok: false, error: 'Invalid phone' });
    }

    const lead = {
      service: data.service || data.requestType || 'General',
      name: data.name || data.fullName || '',
      phone: `+1${phone.length === 10 ? phone : phone}`,
      year: data.vehicleYear || data.year || '',
      make: data.vehicleMake || data.make || '',
      model: data.vehicleModel || data.model || '',
      locationSlug: data.locationSlug || data.location || '',
      notes: data.notes || data.description || '',
      source: data.source || data.page || 'web',
      timestamp: data.timestamp || new Date().toISOString(),
    };

    const smsBody = buildSmsBody(lead);
    console.log('[submit-lead] Sending SMS to:', process.env.ALERT_TO);
    await sendSmsTwilio({ body: smsBody });
    console.log('[submit-lead] SMS sent successfully');

    return jsonResponse(res, 200, { ok: true, id: `${Date.now()}` });
  } catch (err) {
    console.error('[submit-lead] Error:', err);
    return jsonResponse(res, 500, { ok: false, error: (err && err.message) || 'Server error' });
  }
}

// Vercel default export
export default async function handler(req, res) {
  const result = await handlerImpl(req, res, null);
  if (!res || typeof res.status !== 'function') {
    return result;
  }
}

// Netlify function export (if deployed there)
export const handler = async (event) => {
  return handlerImpl(null, null, event);
};
