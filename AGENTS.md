# AGENTS.md

## Project overview

Astro site for **Escola Mestre Ferrero**, a music school in Ontinyent. Bilingual (Catalan `ca` + Spanish `es`) via file-based routing.

## Commands

```bash
npm run dev       # astro dev
npm run build     # astro build
npm run preview   # astro preview
```

There is no linter or typecheck configured.

## Build and check changes

After finish working on a feature, always run a build to check for errors.

## Architecture — two-layer page pattern

Every page has two layers:

1. **Route file** in `src/pages/` — thin Astro file that passes `lang` prop
2. **Page component** in `src/components/pages/` — contains all logic

```
src/pages/sobre-nosaltres/index.astro  →  imports AboutPage.astro, passes lang="ca"
src/pages/es/sobre-nosaltres/index.astro → imports AboutPage.astro, passes lang="es"
```

Lang codes: `ca` (Catalan, default at `/`) and `es` (Spanish at `/es/`).

## Content collections

All defined in `src/content.config.ts`. Files live in `src/content/<collection>/<lang>/<slug>.md`.

| Collection | Directory            | Purpose        |
|------------|----------------------|----------------|
| blog       | src/content/blog/    | News posts     |
| cursos     | src/content/cursos/  | Course catalog |
| profesores | src/content/profesores/ | Teachers   |
| eventos    | src/content/eventos/ | Events         |
| generic    | src/content/generic/ | Static pages (about, banda jove, etc.) |

### How to add a new content entry

1. Create `<lang>/<slug>.md` in the right `src/content/` subdirectory
2. Both `ca/` and `es/` dirs must have the same slugs for bilingual parity
3. Frontmatter fields defined by the zod schema in `content.config.ts`
4. Body markdown is rendered via `render()` → `<Content lang={lang} />`

### How content is consumed

- **Listing pages** — `getCollection('name')` → filter by `lang` → card components
- **Detail pages** — `getEntry('name', id)` + `render()` → `<Content />` for body
- **Language filtering** — `parseContentPath(id)` from `src/i18n/utils.ts` splits `"es/slug"` into `{ lang, slug }`

## i18n

- Translation strings in `src/i18n/ui.ts` — `ui.es` and `ui.ca` objects
- `useTranslations(lang)` returns `t(key)` function
- Always add new UI strings to both `es` and `ca` objects
- The `Lang` type is `'es' | 'ca'`

## Styles

- Tailwind CSS + custom CSS layers in `src/styles/`
- CSS custom properties for theming (`--color-brand`, `--color-accent`, etc.)
- `prose` class for rendered markdown body content

## Adding a new page

1. Create the page component in `src/components/pages/` (example: `FooPage.astro`)
2. Accept `lang: Lang` as a prop
3. Create route files: `src/pages/foo/index.astro` and `src/pages/es/foo/index.astro`
4. Add navigation labels to `src/i18n/ui.ts` if needed
5. Add nav items to the Nav component


# General Agent Instructions

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
