const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

async function hashIp(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip || 'unknown');
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

async function checkRateLimit(ip) {
  const ipHash = await hashIp(ip);
  const now = Date.now();
  const record = rateLimitStore.get(ipHash) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  record.count += 1;
  rateLimitStore.set(ipHash, record);

  return {
    allowed: record.count <= RATE_LIMIT_MAX_REQUESTS,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - record.count),
    resetAt: record.resetAt,
  };
}

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function verifyRecaptcha(token, remoteIp, env) {
  if (!env.RECAPTCHA_SECRET || !token) return { ok: true };

  const payload = new URLSearchParams({
    secret: env.RECAPTCHA_SECRET,
    response: token,
    remoteip: remoteIp || '',
  });

  try {
    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload,
    });
    const json = await resp.json();
    return { ok: !!json.success, score: json.score };
  } catch {
    return { ok: false };
  }
}

async function sendSmsTwilio(body, env) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, ALERT_TO } = env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM || !ALERT_TO) {
    throw new Error('Missing Twilio env vars (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, ALERT_TO)');
  }

  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  const postData = new URLSearchParams({
    From: TWILIO_FROM,
    To: ALERT_TO,
    Body: body,
  });

  const resp = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(TWILIO_ACCOUNT_SID)}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: postData,
    },
  );

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Twilio error ${resp.status}: ${errorText}`);
  }
}

function sanitizePhone(phone) {
  return (phone || '').replace(/\D/g, '');
}

function buildSmsBody(lead) {
  const lines = [];
  lines.push('New Website Lead');
  if (lead.service) lines.push(`Service: ${lead.service}`);
  if (lead.name) lines.push(`Name: ${lead.name}`);
  if (lead.phone) lines.push(`Phone: ${lead.phone}`);
  if (lead.year || lead.make || lead.model) {
    lines.push(`Vehicle: ${lead.year || ''} ${lead.make || ''} ${lead.model || ''}`.trim());
  }
  if (lead.locationSlug) lines.push(`Location: ${lead.locationSlug}`);
  if (lead.notes) lines.push(`Notes: ${lead.notes}`);
  lines.push(`Source: ${lead.source || 'web'}`);
  lines.push(`Time: ${lead.timestamp || new Date().toISOString()}`);
  return lines.join('\n');
}

export async function onRequestPost({ request, env }) {
  try {
    const ipHeader = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
    const ip = ipHeader.split(',')[0].trim();

    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return jsonResponse(429, {
        ok: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateCheck.resetAt - Date.now()) / 1000),
      });
    }

    const data = await request.json().catch(() => ({}));

    if (data.company) {
      return jsonResponse(200, { ok: true, id: 'ignored-honeypot' });
    }

    const recaptcha = await verifyRecaptcha(data.recaptchaToken, ip, env);
    if (env.RECAPTCHA_SECRET && !recaptcha.ok) {
      return jsonResponse(400, { ok: false, error: 'Recaptcha failed' });
    }

    const phone = sanitizePhone(data.phone);
    if (!phone || phone.length < 10) {
      return jsonResponse(400, { ok: false, error: 'Invalid phone' });
    }

    const normalizedPhone = phone.length === 10 ? `+1${phone}` : `+${phone}`;

    const lead = {
      service: data.service || data.requestType || 'General',
      name: data.name || data.fullName || '',
      phone: normalizedPhone,
      year: data.vehicleYear || data.year || '',
      make: data.vehicleMake || data.make || '',
      model: data.vehicleModel || data.model || '',
      locationSlug: data.locationSlug || data.location || '',
      notes: data.notes || data.description || '',
      source: data.source || data.page || 'web',
      timestamp: data.timestamp || new Date().toISOString(),
    };

    const smsBody = buildSmsBody(lead);
    await sendSmsTwilio(smsBody, env);

    return jsonResponse(200, { ok: true, id: `${Date.now()}` });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Server error';
    return jsonResponse(500, { ok: false, error });
  }
}
