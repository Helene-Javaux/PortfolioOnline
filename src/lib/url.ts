/**
 * Préfixe les liens internes avec la base du site (astro.config.mjs).
 * Permet au site de fonctionner tel quel sur GitHub Pages avec ou sans
 * nom de domaine personnalisé.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
