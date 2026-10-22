import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const actualites = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/actualites' }),
  schema: z.object({
    titre: z.string(),
    date: z.coerce.date(),
    image: z.string().optional().nullable(),
    image_alt: z.string().optional().nullable(),
    resume: z.string().optional().nullable(),
    publie: z.boolean().optional().default(true),
  }),
});

export const collections = { actualites };
