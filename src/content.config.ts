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
  schema: ({ image }) => z.object({
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
    /** Optional wide image for the service page. */
    photo: z
      .object({ src: image(), alt: z.string(), focus: z.string().optional() })
      .optional(),
    /** Numbered process steps shown on the service page. */
    process: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
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
    /**
     * Real photographs, in display order. The first is used as the lead
     * image and on the project card. Paths are relative to this file.
     */
    photos: z
      .array(z.object({ src: image(), alt: z.string(), focus: z.string().optional() }))
      .default([]),
    /**
     * Optional 16:9 crop for the lead image. Without it the lead falls back
     * to photos[0], which for an upright photo means shipping pixels the
     * frame immediately crops away.
     */
    leadPhoto: z.object({ src: image(), alt: z.string() }).optional(),
    /**
     * Number of empty slots to render when `photos` is empty. Lets a
     * project without photography still show the shape of its gallery.
     */
    gallery: z.number().default(4),
  }),
});

export const collections = { services, projects };
