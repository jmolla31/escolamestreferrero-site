/**
 * Cloudflare Worker – Contact form handler
 *
 * Receives POST from the contact form, validates it, and forwards
 * the submission to a Google Workspace inbox via the Resend API.
 *
 * Secrets (set with wrangler secret put):
 *   RESEND_API_KEY  – API key from resend.com (Send permission only)
 *   TO_EMAIL        – destination inbox, e.g. info@escolamestreferrero.com
 *
 * Deploy:
 *   npx wrangler secret put RESEND_API_KEY
 *   npx wrangler secret put TO_EMAIL
 *   npx wrangler deploy
 */

const ALLOWED_ORIGINS = [
  'https://escolamestreferrero.com',
  // add preview / local origins as needed:
  // 'http://localhost:4321',
];

const RESEND_API = 'https://api.resend.com/emails';
const FROM_ADDRESS = 'no-reply@escolamestreferrero.com';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin);

    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Pre-flight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/submit') {
      return handleSubmit(request, env, corsHeaders);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleSubmit(request, env, corsHeaders) {
  let body;
  try {
    // Accept both application/x-www-form-urlencoded and application/json
    const contentType = request.headers.get('Content-Type') ?? '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = Object.fromEntries(new URLSearchParams(text));
    }
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400, corsHeaders);
  }

  // Honeypot check (field name must match the form's hidden input)
  if (body._gotcha) {
    // Silently accept to not tip off bots
    return jsonResponse({ ok: true }, 200, corsHeaders);
  }

  // Validate required fields
  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();

  if (!name || !email || !message) {
    return jsonResponse({ error: 'Missing required fields' }, 422, corsHeaders);
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ error: 'Invalid email address' }, 422, corsHeaders);
  }

  // Build and send email via Resend
  const emailPayload = {
    from: FROM_ADDRESS,
    to: [env.TO_EMAIL],
    reply_to: email,
    subject: `Nou missatge de contacte de ${name}`,
    html: buildEmailHtml(name, email, message),
    text: buildEmailText(name, email, message),
  };

  let resendRes;
  try {
    resendRes = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });
  } catch {
    return jsonResponse({ error: 'Failed to send email' }, 502, corsHeaders);
  }

  if (!resendRes.ok) {
    const err = await resendRes.text();
    console.error('Resend error:', err);
    return jsonResponse({ error: 'Email delivery failed' }, 502, corsHeaders);
  }

  return jsonResponse({ ok: true }, 200, corsHeaders);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailHtml(name, email, message) {
  const n = escapeHtml(name);
  const e = escapeHtml(email);
  const m = escapeHtml(message).replace(/\n/g, '<br>');
  return `
    <h2>Nou missatge de contacte</h2>
    <p><strong>Nom:</strong> ${n}</p>
    <p><strong>Correu:</strong> <a href="mailto:${e}">${e}</a></p>
    <p><strong>Missatge:</strong></p>
    <p>${m}</p>
  `;
}

function buildEmailText(name, email, message) {
  return `Nou missatge de contacte\n\nNom: ${name}\nCorreu: ${email}\n\nMissatge:\n${message}`;
}

function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
