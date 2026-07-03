import type { ImageMetadata } from 'astro';

/**
 * Découverte automatique des photos.
 *
 * Toutes les images placées dans src/assets/photos/** sont détectées ici.
 * Les photos d'une galerie sont triées par nom de fichier (tri naturel :
 * photo-2 avant photo-10) — il suffit donc de nommer les fichiers dans
 * l'ordre souhaité (ex: 01-xxx.jpg, 02-yyy.jpg).
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}',
  { eager: true },
);

const byPath = new Map<string, ImageMetadata>(
  Object.entries(modules).map(([path, mod]) => [
    path.replace('/src/assets/photos/', ''),
    mod.default,
  ]),
);

const collator = new Intl.Collator('fr', { numeric: true });

/** Photos d'une galerie, ex: galleryPhotos('projects', 'wild-care'). */
export function galleryPhotos(
  category: 'projects' | 'services',
  slug: string,
): ImageMetadata[] {
  const prefix = `${category}/${slug}/`;
  return [...byPath.entries()]
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => collator.compare(a, b))
    .map(([, image]) => image);
}

/** Photo précise par chemin relatif à src/assets/photos/, ex: 'about/portrait.jpg'. */
export function photo(path: string): ImageMetadata {
  const image = byPath.get(path);
  if (!image) {
    throw new Error(
      `Photo introuvable : "src/assets/photos/${path}". Vérifie le chemin dans le fichier YAML.`,
    );
  }
  return image;
}

/** Vignette (cover) d'une galerie déclarée dans son fichier YAML. */
export function galleryCover(
  category: 'projects' | 'services',
  slug: string,
  cover: string,
): ImageMetadata {
  return photo(`${category}/${slug}/${cover}`);
}
