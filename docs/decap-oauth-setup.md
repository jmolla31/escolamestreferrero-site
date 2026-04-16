# Configurar autenticación OAuth para Decap CMS en Cloudflare Pages

Decap CMS necesita un proxy OAuth para comunicarse con la API de GitHub.
La solución más sencilla es un **Cloudflare Worker** que actúa como intermediario.

## 1. Crear una GitHub OAuth App

1. Ve a **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Rellena:
   - **Application name**: Escola de Música CMS
   - **Homepage URL**: `https://tu-sitio.pages.dev`
   - **Authorization callback URL**: `https://tu-oauth-proxy.workers.dev/callback`
3. Genera un **Client Secret** y guarda el **Client ID** y el **Client Secret**.

## 2. Desplegar el Worker OAuth en Cloudflare

Usa el Worker de código abierto [`decap-cms-github-oauth-provider`](https://github.com/stefanprobst/netlify-cms-github-oauth-provider) adaptado para Workers, o el Worker incluido en este proyecto:

```bash
cd oauth-worker
npm install
npx wrangler secret put GITHUB_CLIENT_ID    # pega el Client ID
npx wrangler secret put GITHUB_CLIENT_SECRET # pega el Client Secret
npx wrangler deploy
```

Anota la URL que devuelve Wrangler (p. ej. `https://escola-oauth.tu-usuario.workers.dev`).

## 3. Actualizar config.yml

En `public/admin/config.yml`, cambia:

```yaml
backend:
  base_url: https://escola-oauth.tu-usuario.workers.dev
```

## 4. Agregar secretos en GitHub Actions

En el repositorio de GitHub: **Settings → Secrets and variables → Actions**

| Nombre                  | Valor                                     |
|-------------------------|-------------------------------------------|
| `CLOUDFLARE_API_TOKEN`  | Token API de Cloudflare (permisos Pages)  |
| `CLOUDFLARE_ACCOUNT_ID` | ID de tu cuenta Cloudflare                |

El token debe tener el permiso **Cloudflare Pages – Edit**.
Créalo en: https://dash.cloudflare.com/profile/api-tokens

## 5. Acceder al CMS

Una vez desplegado, el CMS estará disponible en:
`https://tu-sitio.pages.dev/admin/`

Los editores inician sesión con su cuenta de GitHub (deben tener acceso al repositorio).
