/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand)',
        'brand-mid': 'var(--color-brand-mid)',
        'brand-dark': 'var(--color-brand-dark)',
        accent: 'var(--color-accent)',
        'accent-dark': 'var(--color-accent-dark)',
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        muted: 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['Weissenhof Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Weissenhof Grotesk', 'system-ui', 'sans-serif'],
        body: ['Weissenhof Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
