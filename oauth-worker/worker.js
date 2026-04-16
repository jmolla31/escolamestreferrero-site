/**
 * Cloudflare Worker – Proxy OAuth para Decap CMS + GitHub
 *
 * Despliegue:
 *   npx wrangler secret put GITHUB_CLIENT_ID
 *   npx wrangler secret put GITHUB_CLIENT_SECRET
 *   npx wrangler deploy
 *
 * Referencia: https://decapcms.org/docs/github-backend/
 */

const ALLOWED_ORIGINS = [
  // Actualiza con el dominio real de tu sitio
  'https://escolamestreferrero.com',
  'https://oauth.escolamestreferrero.com',
];

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') ?? '';

    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // /auth → redirige a GitHub
    if (url.pathname === '/auth') {
      const state = Array.from(crypto.getRandomValues(new Uint8Array(4)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: 'repo,user',
        redirect_uri: `${url.origin}/callback`,
        state,
      });
      return Response.redirect(`${GITHUB_AUTH_URL}?${params}`, 302);
    }

    // /callback → intercambia código por token y cierra la ventana
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code', { status: 400 });
      }

      const tokenRes = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenRes.json();

      if (data.error) {
        return new Response(`OAuth error: ${data.error_description}`, { status: 400 });
      }

      // Decap CMS usa un handshake de dos pasos:
      // 1. El popup envía "authorizing:github" al opener para indicar que está listo.
      // 2. Decap responde con cualquier mensaje.
      // 3. El popup entonces envía el token y se cierra.
      // Sin este handshake, la ventana se cierra antes de que Decap procese el token.
      const token = data.access_token;
      const html = `<!doctype html>
<html>
<head>
  <script>
    const receiveMessage = (message) => {
      window.opener.postMessage(
        'authorization:github:success:' + JSON.stringify({ token: ${JSON.stringify(token)}, provider: 'github' }),
        '*'
      );
      window.removeEventListener('message', receiveMessage, false);
      setTimeout(function () { window.close(); }, 100);
    };
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  <\/script>
</head>
<body><p>Autoritzant Decap CMS...</p></body>
</html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html', ...corsHeaders },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};
