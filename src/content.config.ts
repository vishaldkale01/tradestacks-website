import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(10).max(120),
    description: z.string().min(20).max(190),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['Engineering', 'Research', 'Architecture', 'Project Updates']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});
export const collections = { blog };
