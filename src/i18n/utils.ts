import { ui, type Lang, type TranslationKey } from './ui';

/**
 * Devuelve la función de traducción para el idioma dado.
 * Uso: const t = useTranslations('es');  t('nav.home')
 */
export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return ui[lang][key] ?? ui['es'][key] ?? key;
  };
}

/**
 * Devuelve el lang code a partir de la URL de la página.
 * Uso en Astro: const lang = getLangFromUrl(Astro.url);
 */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLocale] = url.pathname.split('/');
  if (maybeLocale === 'ca') return 'ca';
  return 'es';
}

/**
 * Genera la URL equivalente en el otro idioma.
 */
export function getAlternateLangUrl(url: URL): string {
  const lang = getLangFromUrl(url);
  if (lang === 'ca') {
    // Quitar el prefijo /ca
    return url.pathname.replace(/^\/ca/, '') || '/';
  } else {
    // Añadir el prefijo /ca
    return `/ca${url.pathname}`;
  }
}

/**
 * Dado un path de entrada de contenido (p. ej. "es/mi-post"),
 * devuelve el objeto { lang, slug }.
 */
export function parseContentPath(id: string): { lang: Lang; slug: string } {
  const parts = id.split('/');
  const lang = parts[0] === 'ca' ? 'ca' : 'es';
  // Strip file extensions (.md, .mdx) from slug
  const slug = parts.slice(1).join('/').replace(/\.(mdx?)$/, '');
  return { lang, slug };
}
