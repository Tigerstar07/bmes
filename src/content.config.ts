import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content lives in per-language folders:
 *   src/content/services/lv/*.md   src/content/services/en/*.md
 *   src/content/projects/lv/*.md   src/content/projects/en/*.md
 *
 * `key` (services) and `pid` (projects) pair the two languages together,
 * so the language switcher can jump between counterparts. A missing or
 * misspelled field fails the build rather than shipping a blank page.
 */

const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/services' }),
  schema: z.object({
    key: z.enum([
      'buvnieciba',
      'inzenierkomunikacijas',
      'rekonstrukcija',
      'arhitektura',
      'interjers',
      'apsekosana',
    ]),
    lang: z.enum(['lv', 'en']),
    order: z.number(),
    title: z.string(),
    /** One-line subtext used on cards and in the services index. */
    short: z.string(),
    /** Longer intro used at the top of the service page. */
    summary: z.string(),
    /** Bulleted list of what the service actually covers. */
    covers: z.array(z.string()).min(1),
    /** Numbered process steps shown on the service page. */
    process: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    /** Shared identifier + URL slug, identical in both languages. */
    pid: z.string(),
    lang: z.enum(['lv', 'en']),
    order: z.number(),
    title: z.string(),
    location: z.string(),
    year: z.number(),
    area: z.string().optional(),
    client: z.string().optional(),
    scope: z.string(),
    /** Which service keys this project belongs to. Drives filtering. */
    services: z.array(z.string()).min(1),
    featured: z.boolean().default(false),
    /** Number of gallery slots to render until real photos arrive. */
    gallery: z.number().default(4),
  }),
});

export const collections = { services, projects };
