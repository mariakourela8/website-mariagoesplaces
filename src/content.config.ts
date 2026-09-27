import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Decap CMS writes empty optional fields as "", so treat those as "not set".
const empty = (v: unknown) => (v === '' || v === null ? undefined : v);
const optNumber = z.preprocess(empty, z.coerce.number().optional());
const optString = z.preprocess(empty, z.string().optional());

const stories = defineCollection({
  // content/en/*.md and content/gr/*.md  →  ids like "en/salvador-part-1"
  loader: glob({ pattern: ['en/*.md', 'gr/*.md'], base: './content' }),
  schema: z.object({
    title: z.string(),
    description: optString,
    date: z.coerce.date(),
    category: z.enum(['story', 'guide']).default('story'),
    country: z.string(),
    city: optString,
    series: optString,
    part: optNumber,
    cover: z.string(),
    coverAlt: z.preprocess(empty, z.string().default('')),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    lat: optNumber,
    lng: optNumber,
    tags: z.array(z.string()).default([]),
    gallery: z
      .array(z.object({ image: z.string(), caption: optString }))
      .default([]),
    highlights: z
      .array(
        z.object({
          key: z.string(),
          title: z.string(),
          text: z.string(),
          image: optString,
        }),
      )
      .default([]),
  }),
});

const pages = defineCollection({
  // content/pages/en/about.md  →  id "pages/en/about"
  loader: glob({ pattern: 'pages/**/*.md', base: './content' }),
  schema: z.object({
    title: z.string(),
    subtitle: optString,
    image: optString,
    image2: optString,
  }),
});

export const collections = { stories, pages };
