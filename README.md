# BMES — website

Full-cycle construction company site. Latvian (default, at the root) and English (under `/en/`).
Static build, 37 pages, no runtime dependencies for the animation.

**Live preview:** https://tigerstar07.github.io/bmes/

```bash
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve the built output
npm run check    # typecheck (must stay at 0 errors)
```

## Deployment

Pushing to `main` builds and publishes automatically via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Nothing else to run.

The preview sits on a GitHub Pages project URL, which serves from a subpath
(`/bmes/`) rather than the root. Two env vars in the workflow handle that:

| | preview (now) | real domain (later) |
|---|---|---|
| `ASTRO_SITE` | `https://tigerstar07.github.io` | unset → `https://bmes.lv` |
| `ASTRO_BASE` | `/bmes` | unset → `/` |

Every link in the site is built through the helpers in `src/i18n/utils.ts`, which
prepend `import.meta.env.BASE_URL`. So **moving to the real domain is deleting the two
`env:` lines from the workflow** — no link, canonical, hreflang or sitemap edits.

Both builds are verified: with the base set, all 1,983 internal links resolve under
`/bmes/`; without it, they resolve at the root against `bmes.lv`.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 7 | Static output, ~0 KB JS by default |
| Styling | Tailwind 4 + CSS custom properties | Tokens in `src/styles/global.css` |
| Motion | Native web platform, no library | See below |
| Fonts | Astro Fonts API, self-hosted | `latin-ext` subset — required for Latvian |
| Content | Astro content collections (Markdown) | `src/content/` |
| i18n | Astro built-in `i18n` routing | `src/i18n/` |

## Where things live

```
src/
├── i18n/ui.ts             All UI strings, route map, service slugs, company details
├── i18n/utils.ts          Translation + URL helpers
├── content.config.ts      Schemas — a bad frontmatter field fails the build
├── content/
│   ├── services/lv|en/    Six services per language
│   └── projects/lv|en/    Projects per language
├── components/
│   ├── pages/             One component per page type, takes `lang`
│   └── *.astro            Header, Footer, cards, placeholders
├── layouts/Base.astro     <head>, SEO, hreflang, JSON-LD, header/footer
├── scripts/motion.js      The whole motion layer (~1.6 KB gzipped)
├── styles/global.css      Design tokens + shared classes
└── pages/                 Thin route files that render a page component
```

Route files are deliberately thin — `src/pages/par-mums.astro` is four lines that render
`AboutPage` with `lang="lv"`, and `src/pages/en/about.astro` does the same with `lang="en"`.
The page itself is written once.

## Motion: why there is no animation library

The site uses the browser's own APIs rather than anime.js, GSAP or Motion:

- **Reveals** — CSS transitions switched on by a small `IntersectionObserver`.
- **Parallax on media** — CSS scroll-driven animations (`animation-timeline: view()`),
  which run on the compositor thread with no JavaScript at all.
- **Page transitions** — the native cross-document View Transitions API.
- **Counters** — a short `requestAnimationFrame` loop.

Total shipped JavaScript for the entire site: **1.6 KB gzipped**, against roughly 20 KB for
anime.js or 35 KB+ for GSAP with ScrollTrigger. There is also no licence question and nothing
to break on a dependency update.

Because each navigation is a real document load, there is no teardown problem between pages —
the exact issue that makes library-based scroll animation awkward on multi-page sites.

**Safety net:** content is visible by default. The hiding rules are scoped to `.js-motion`,
a class added by an inline script in `<head>`, so a script error can never leave the page
blank. A 4-second failsafe reveals anything still hidden.

## Editing content

**Text on service and project pages** — edit the Markdown in `src/content/`. Frontmatter is
schema-validated, so a typo in a field name fails the build instead of shipping a blank page.

**Menu labels, buttons, form labels, headings** — `src/i18n/ui.ts`.

**Company phone, email, address, registration number** — `company` in `src/i18n/ui.ts`.
These feed the header, footer, contact page, privacy policy and the structured data at once.

**URLs** — `routes` and `serviceSlugs` in `src/i18n/ui.ts`. Changing a slug there updates the
navigation, footer, sitemap, hreflang tags and language switcher together.

## Before launch

1. **More photographs.** Three real photos are in. The remaining slots are still labelled
   placeholders (`src/components/Placeholder.astro`) — see "Photos" below for how to add more.
2. **Company details.** `company` in `src/i18n/ui.ts` is placeholder data — real registration
   number, address and phone are needed.
3. **Domain.** Set `SITE` in `astro.config.mjs`, and the sitemap URL in `public/robots.txt`.
4. **Contact form.** Set `ENDPOINT` in `src/components/pages/ContactPage.astro` to the
   Cloudflare Pages Function URL. Until then the form validates fully but tells the visitor
   to email directly rather than pretending to send.
5. **Copy.** All Latvian and English text is a drafted placeholder for review.
6. **Privacy policy.** `src/components/pages/PrivacyPage.astro` is a drafted template and
   should be reviewed before publication.

## Two copy decisions to confirm with dad

**Spelling: *Inženierkomunikācijas*, not *Inžinier-*.** The brief said *Inžinier-*, but standard
Latvian derives the compound from *inženieris*, the reference site uses *Inženier-*, and ten other
places in the copy already did (*inženiersistēmas*, *būvinženieri*, *inženiertīkli*). The URL slug
was already `inzenier-`, so the brief's spelling left the title contradicting its own address.
Now consistent everywhere. To go back to the brief's spelling, change the `title` in both
`src/content/services/*/inzenierkomunikacijas.md`, the site description in `src/i18n/ui.ts`,
and the slug in `serviceSlugs`.

**Headline changed.** It read *"No idejas / līdz atslēgai"*, which is effectively Althaus's own
tagline (*"Būvniecība no idejas līdz atslēgai"*). Using a direct competitor's line seemed worth
avoiding, so it now reads *"Viens uzņēmums, / viss objekts"* — the same promise in BMES's words,
and the argument the rest of the site actually makes. It's two strings in `src/i18n/ui.ts`
(`hero.line1` / `hero.line2`) if you want something else.

## House style

No em dashes anywhere in the copy, in either language. Sentences use commas, colons or full
stops instead. The page title separator is a pipe (`BMES | Būvniecība…`).

## Photos

Drop originals into `photos/incoming/` and run:

    npm run photos

That grades them into `src/assets/photos/` and writes before/after sheets to
`photos/before-after/` so the result can be judged rather than assumed.

The grade is exposure-led, not a generic "punch it up": the sources measured at
0-255 range already (no haze) but with channel means down at 93-111, so it is gamma
that fixes them, plus a modest saturation lift and a restrained unsharp mask. All
metadata is stripped, GPS included.

`CROPS` in the script cuts each photo to the exact shape of the frame it sits in.
That matters more than the codec here: the hero was 787 KB as an uncropped upright
frame and is 310 KB cropped to 16:9, because CSS was throwing away 44% of the pixels
it had just downloaded.

Two things were measured and rejected, so they don't get retried:

- **AVIF came out larger than WebP** at matched quality settings (725 vs 619 KB on the
  home page). Astro's `quality` is not equivalent across codecs.
- **Lowering quality barely helps.** 68 to 50 saved 15%. The cost is the subject —
  mud, gravel and foliage are about the most expensive thing a photo codec can encode.

To swap which photo goes where: the hero is an import at the top of
`src/components/pages/HomePage.astro`, service photos are a `photo:` block in the
service markdown, and project photos are `leadPhoto` + `photos` in the project markdown.

## Latvian typography notes

Latvian is not English-shaped, and three settings here exist because of that:

- **Heading line-height is 1.08, not tighter.** Macrons (ā ē ī ū) sit above the cap line and
  cedillas (ģ ķ ļ ņ) below it, so headings need more vertical room than the same design would
  in English. The hero is 0.98 for the same reason.
- **The hero's masked reveal has `padding-block: 0.16em`** with a matching negative margin.
  The mask is `overflow: hidden`, and at the original line-height it had *negative* headroom,
  so it was shaving the tops and tails off glyphs.
- **Headings carry `hyphens: auto` and `overflow-wrap: break-word`,** and grid children that
  hold them carry `min-width: 0`. Latvian compounds get long: *Inženierkomunikācijas* is 21
  characters and overflowed its column on a phone before this.

## Verified

- 0 typecheck errors, 0 warnings (`npm run check`)
- 1,983 internal links crawled, 0 broken
- No horizontal overflow and no headline wrapping inside its mask, checked on every page type
  at 320, 375, 768, 1280 and 1600 px
- WCAG AA contrast passes on all 266 text/background pairs across 13 pages, light and dark
- Tap targets meet the 24 px WCAG 2.5.8 minimum
- `prefers-reduced-motion` honoured throughout
- Latvian diacritics render from the self-hosted `latin-ext` subset (`U+0100–02BA`)
- hreflang pairs each page with its counterpart in the other language
- Zero em dashes in source or built output
