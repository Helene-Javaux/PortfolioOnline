/**
 * Recompression des photos sources de src/assets/photos/.
 *
 * Pourquoi : les photos exportées depuis Lightroom/Photoshop le sont à une
 * qualité JPEG quasi maximale. Une photo de 533x800 px peut ainsi peser 400 KB
 * alors que 60 KB suffisent visuellement. Comme ces fichiers vivent dans le
 * dépôt git, chaque build GitHub Actions doit les retélécharger : c'est le
 * poste de dépense le plus lourd de la CI, très loin devant le build Astro.
 *
 * Ce script plafonne la largeur des sources à MAX_WIDTH et les réencode en
 * JPEG mozjpeg. Astro les recompresse ensuite en WebP pour le visiteur, donc
 * la qualité finalement servie est inchangée.
 *
 * Usage :
 *   npm run photos:check              # simulation sur tout le dossier
 *   npm run photos:optimize           # réécrit tout le dossier en place
 *   node scripts/optimize-photos.mjs <fichier>...   # seulement ces fichiers
 *
 * La forme avec fichiers explicites est celle qu'utilise le hook pre-commit :
 * parcourir les 118 photos prend ~36 s même quand il n'y a rien à faire, ce
 * qui serait insupportable à chaque commit.
 *
 * Le script est idempotent : relancé, il ne retouche rien (il n'écrit que si
 * le résultat est plus léger d'au moins MIN_GAIN).
 */
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Largeur maximale conservée (la hauteur suit librement le ratio).
 *
 * On plafonne la LARGEUR et non le plus grand côté. La plus grande largeur
 * demandée par le site est 2000 px (diaporama d'accueil, index.astro), devant
 * 1800 px pour la lightbox de PhotoGrid.astro. Plafonner le plus grand côté
 * ramènerait une photo portrait 2:3 à 1707 px de large, en dessous de ces deux
 * valeurs. 2560 px les couvre avec une marge pour le Retina.
 *
 * Si un jour une vue demande plus de 2560 px de large, relever cette valeur
 * puis relancer le script sur les originaux.
 */
const MAX_WIDTH = 2560;

/**
 * Qualité JPEG, à deux niveaux.
 *
 * Les photos plus larges que MAX_WIDTH sont des originaux d'appareil : elles
 * font tout le poids du dépôt et sont redimensionnées, ce qui gomme déjà le
 * bruit de compression — q82 y est indiscernable.
 *
 * Les photos déjà à la taille du web ne sont pas redimensionnées : les
 * réencoder cumule une seconde perte JPEG sur une première. Elles ne pèsent
 * qu'une poignée de Mo au total, donc on leur laisse q88 (+2,4 Mo sur
 * l'ensemble) pour garder de la marge.
 */
const QUALITY_RESIZED = 82;
const QUALITY_ALREADY_SMALL = 88;
/** On ne réécrit que si on gagne au moins 5 % : évite de recompresser à perte. */
const MIN_GAIN = 0.05;

const PHOTOS_DIR = path.join(process.cwd(), 'src/assets/photos');
const EXTENSIONS = new Set(['.jpg', '.jpeg']);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
/** Fichiers passés explicitement (hook pre-commit), hors options. */
const explicit = args.filter((a) => !a.startsWith('--'));

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
}

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;
const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;

const candidates = explicit.length
  ? explicit.map((file) => path.resolve(file))
  : await walk(PHOTOS_DIR);

const files = candidates.filter((file) =>
  EXTENSIONS.has(path.extname(file).toLowerCase()),
);

if (!files.length) {
  console.log('Aucune photo à traiter.');
  process.exit(0);
}

let totalBefore = 0;
let totalAfter = 0;
let rewritten = 0;

for (const file of files.sort()) {
  const before = (await stat(file)).size;
  totalBefore += before;

  const source = await readFile(file);
  const { width } = await sharp(source).metadata();
  const quality = width > MAX_WIDTH ? QUALITY_RESIZED : QUALITY_ALREADY_SMALL;

  // .rotate() sans argument applique l'orientation EXIF avant qu'on ne perde
  // les métadonnées ; keepIccProfile() préserve le profil couleur (les photos
  // du dépôt sont taguées sRGB ou Adobe RGB, il ne faut pas le jeter).
  const output = await sharp(source)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .keepIccProfile()
    .toBuffer();

  const relative = path.relative(process.cwd(), file);
  const gain = (before - output.length) / before;

  if (gain < MIN_GAIN) {
    totalAfter += before;
    console.log(`  =  ${relative} — déjà optimisée (${kb(before)})`);
    continue;
  }

  totalAfter += output.length;
  rewritten += 1;
  console.log(
    `  ${dryRun ? '~' : '✓'}  ${relative} — ${kb(before)} → ${kb(output.length)} (-${Math.round(gain * 100)} %)`,
  );

  if (!dryRun) await writeFile(file, output);
}

console.log(
  [
    '',
    `${files.length} photo(s), ${rewritten} à réécrire`,
    `Avant : ${mb(totalBefore)}`,
    `Après : ${mb(totalAfter)} (-${Math.round(((totalBefore - totalAfter) / totalBefore) * 100)} %)`,
    dryRun ? '\nSimulation : aucun fichier modifié. Lancer `npm run photos:optimize` pour appliquer.' : '',
  ].join('\n'),
);
