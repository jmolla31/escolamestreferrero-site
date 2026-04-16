import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    heroImage: z.string().optional(),
    excerpt: z.string(),
    draft: z.boolean().default(false),
  }),
});

const cursosCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cursos' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),
    image: z.string().optional(),
    level: z.enum(['iniciacion', 'elemental', 'medio', 'avanzado', 'todos']),
    shortDesc: z.string(),
    featured: z.boolean().default(false),
  }),
});

const profesoresCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/profesores' }),
  schema: z.object({
    name: z.string(),
    specialty: z.string(),
    photo: z.string().optional(),
    order: z.number().default(99),
  }),
});

const eventosCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/eventos' }),
  schema: z.object({
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    image: z.string().optional(),
    ticketUrl: z.string().url().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  cursos: cursosCollection,
  profesores: profesoresCollection,
  eventos: eventosCollection,
};
