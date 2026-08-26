/**
 * Photo enhancement pass.
 *
 * Drop originals into photos/incoming/ and run `npm run photos`.
 * Enhanced masters land in src/assets/photos/, where Astro's <Image>
 * takes over and generates responsive AVIF/WebP at build time.
 *
 * What this actually does (real photographic processing, not AI
 * upscaling — it cannot invent detail that is not in the file):
 *
 *   1. Auto-orients from the EXIF rotation flag
 *   2. STRIPS ALL METADATA, including GPS coordinates. Phone photos of a
 *      private property carry the address in them; this removes it.
 *   3. Lifts contrast and saturation, which phone JPEGs usually need
 *   4. Unsharp mask, tuned so foliage and gravel do not go crunchy
 *   5. Resizes to a sensible master size with a high-quality kernel
 *   6. Writes a side-by-side before/after so the result can be judged
 */

import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const IN = 'photos/incoming';
const OUT = 'src/assets/photos';
const PROOF = 'photos/before-after';

/**
 * Cap on the master long edge, never an upscale target. These sources came
 * through WhatsApp at 2-3 MP; enlarging them then letting the browser scale
 * back down would add file size and zero detail.
 */
const LONG_EDGE = 2400;

/**
 * Tuning. Deliberately restrained, and gentler than it would be for a raw
 * camera file: WhatsApp has already applied lossy compression, so an
 * aggressive unsharp mask would sharpen its blocking artifacts along with
 * the actual edges. The tiny pre-blur softens ringing before the unsharp
 * mask restores real edge contrast.
 */
const GRADE = {
  preBlur: 0.3,
  /**
   * The measured problem was not haze: the histograms already spanned
   * 0-255. It was exposure, with channel means down at 93-111. Gamma is
   * what fixes that, since it reshapes the midtones while leaving both
   * ends pinned, so nothing clips. Graded against a four-way visual test;
   * pushing further started blocking up the tree canopy and the wet soil.
   */
  gamma: 1.20,
  saturation: 1.16,
  contrast: { mul: 1.07, off: -7 },
  /**
   * m2 is 1.2 rather than 1.5. Sharpening adds high-frequency detail, and
   * mud and foliage are already the most expensive thing a photo codec can
   * encode — at 1.5 the hero was costing 566 KB at 1200px. This is very
   * close visually and materially cheaper to ship.
   */
  sharpen: { sigma: 0.8, m1: 0.4, m2: 1.2 },
};

/**
 * Extra crops, cut from the graded master to the exact shape of the frame
 * they will sit in. Without these the browser downloads a tall portrait
 * photo and CSS throws ~44% of it away — on the hero, which is the LCP
 * image. `focus` is the vertical centre of the crop, 0 = top, 1 = bottom.
 */
const CROPS = {
  '01-operators-kabine': [{ name: '16x9', ratio: 16 / 9, focus: 0.45 }],
  '03-transeja-izbuve':  [
    { name: '3x2',  ratio: 3 / 2,  focus: 0.55 },
    { name: '16x9', ratio: 16 / 9, focus: 0.52 },
  ],
  '02-ekskavators-gruntsdarbi': [{ name: '3x2', ratio: 3 / 2, focus: 0.5 }],
};

const slugify = (name) =>
  path.parse(name).name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function enhance(file) {
  const src = path.join(IN, file);
  const base = slugify(file);

  const original = sharp(src, { failOn: 'none' });
  const meta = await original.metadata();

  // EXIF orientation may swap the reported dimensions.
  const upright = meta.orientation && meta.orientation >= 5;
  const w = upright ? meta.height : meta.width;
  const h = upright ? meta.width : meta.height;
  const portrait = h > w;

  const pipeline = sharp(src, { failOn: 'none' })
    .rotate()                                   // apply EXIF orientation, then drop it
    .resize({
      width:  portrait ? null : LONG_EDGE,
      height: portrait ? LONG_EDGE : null,
      fit: 'inside',
      withoutEnlargement: true,   // cap only, never enlarge
      kernel: 'lanczos3',
    })
    .blur(GRADE.preBlur)
    .gamma(GRADE.gamma)
    .modulate({ saturation: GRADE.saturation })
    .linear(GRADE.contrast.mul, GRADE.contrast.off)
    .sharpen(GRADE.sharpen);

  const outFile = path.join(OUT, `${base}.jpg`);
  const info = await pipeline
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outFile);

  // Aspect-ratio crops, cut from the finished master.
  const crops = [];
  for (const c of CROPS[base] ?? []) {
    const cw = info.width;
    const chh = Math.round(cw / c.ratio);
    if (chh > info.height) continue;             // frame is taller than the source
    const centre = info.height * c.focus;
    const top = Math.max(0, Math.min(info.height - chh, Math.round(centre - chh / 2)));
    const cropFile = path.join(OUT, `${base}-${c.name}.jpg`);
    const ci = await sharp(outFile)
      .extract({ left: 0, top, width: cw, height: chh })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(cropFile);
    crops.push(`${c.name} ${ci.width}x${ci.height}`);
  }

  // Before/after proof sheet at a viewable size.
  const proofH = 900;
  const beforeBuf = await sharp(src, { failOn: 'none' })
    .rotate().resize({ height: proofH }).jpeg({ quality: 88 }).toBuffer();
  const afterBuf = await sharp(outFile).resize({ height: proofH }).jpeg({ quality: 88 }).toBuffer();
  const bw = (await sharp(beforeBuf).metadata()).width;
  const aw = (await sharp(afterBuf).metadata()).width;

  await sharp({
    create: { width: bw + aw + 24, height: proofH, channels: 3, background: '#0C2A20' },
  })
    .composite([
      { input: beforeBuf, left: 0, top: 0 },
      { input: afterBuf, left: bw + 24, top: 0 },
    ])
    .jpeg({ quality: 88 })
    .toFile(path.join(PROOF, `${base}.jpg`));

  return {
    file, base,
    from: `${w}x${h}`,
    to: `${info.width}x${info.height}`,
    orientation: portrait ? 'portrait' : 'landscape',
    ratio: (info.width / info.height).toFixed(3),
    kb: Math.round(info.size / 1024),
    crops,
    hadGps: Boolean(meta.exif),
  };
}

const run = async () => {
  for (const d of [OUT, PROOF]) if (!existsSync(d)) await mkdir(d, { recursive: true });

  if (!existsSync(IN)) {
    console.error(`Missing ${IN}/ — create it and drop the photos in.`);
    process.exit(1);
  }

  const files = (await readdir(IN)).filter((f) => /\.(jpe?g|png|heic|heif|webp|tiff?)$/i.test(f));

  if (!files.length) {
    console.log(`No images in ${IN}/ yet. Drop the originals there and re-run.`);
    return;
  }

  const results = [];
  for (const f of files) {
    try {
      const r = await enhance(f);
      results.push(r);
      console.log(
        `  ${r.file}\n     ${r.from} -> ${r.to}  ${r.orientation}  ratio ${r.ratio}  ${r.kb} KB` +
        (r.hadGps ? '   [metadata stripped]' : ''),
      );
    } catch (err) {
      console.error(`  FAILED ${f}: ${err.message}`);
    }
  }

  await writeFile(
    path.join(PROOF, 'index.json'),
    JSON.stringify(results, null, 2),
    'utf8',
  );

  console.log(`\n${results.length} enhanced -> ${OUT}/`);
  console.log(`Before/after sheets -> ${PROOF}/`);
};

run();
