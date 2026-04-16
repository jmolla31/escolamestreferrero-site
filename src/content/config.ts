import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    heroImage: z.string().optional(),
    excerpt: z.string(),
    draft: z.boolean().default(false),
  }),
});

const cursosCollection = defineCollection({
  type: 'content',
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
  type: 'content',
  schema: z.object({
    name: z.string(),
    specialty: z.string(),
    photo: z.string().optional(),
    order: z.number().default(99),
  }),
});

const eventosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    image: z.string().optional(),
    ticketUrl: z.string().url().optional(),
  }),
});

const galeriaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    photos: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = {
  blog: blogCollection,
  cursos: cursosCollection,
  profesores: profesoresCollection,
  eventos: eventosCollection,
  galeria: galeriaCollection,
};
