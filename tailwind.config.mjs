/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand)',
        'brand-dark': 'var(--color-brand-dark)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        muted: 'var(--color-text-muted)',
      },
      fontFamily: {
        display: ['DisplayFont', 'Georgia', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-headings': 'var(--color-text)',
            '--tw-prose-body': 'var(--color-text)',
          },
        },
      },
    },
  },
  plugins: [],
};
