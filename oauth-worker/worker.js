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
  'https://escola-musica.pages.dev',
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
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: 'repo,user',
        redirect_uri: `${url.origin}/callback`,
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

      // Decap espera que la ventana se cierre con postMessage
      const html = `<!doctype html><html><body><script>
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}',
          '*'
        );
        window.close();
      </script></body></html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html', ...corsHeaders },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};
