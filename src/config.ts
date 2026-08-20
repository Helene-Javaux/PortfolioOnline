/**
 * Configuration générale du site.
 *
 * ⚠️ CLÉS WEB3FORMS ⚠️
 * C'est ICI qu'il faut insérer les clés d'accès Web3Forms (https://web3forms.com).
 * Créer DEUX clés distinctes (une par formulaire) puis remplacer les
 * placeholders "YOUR_ACCESS_KEY_HERE" ci-dessous.
 */

// Clé du formulaire de CONTACT (page /contact)
export const WEB3FORMS_CONTACT_KEY = 'cd8b2f2c-2ebe-4b2b-9668-cddbcaf1b08e';

// Clé du formulaire de DEMANDE DE TIRAGE (page /shop) — clé séparée
export const WEB3FORMS_PRINTS_KEY = '51059d65-1436-4527-aa51-92273e557f37';

/**
 * Token Cloudflare Web Analytics.
 *
 * Où le trouver : dash.cloudflare.com → Analytics & Logs → Web Analytics →
 * « Add a site » → helenejavaux.be. Cloudflare affiche un extrait de code ;
 * le token est la valeur de `data-cf-beacon` (une chaîne hexadécimale).
 *
 * Pas besoin que le site soit hébergé chez Cloudflare ni que le DNS y passe :
 * le beacon JS fonctionne depuis GitHub Pages.
 *
 * Ce token n'est pas un secret (il est visible dans le HTML public), il a donc
 * sa place ici et non dans un secret GitHub.
 *
 * Laisser la chaîne vide désactive complètement l'analytics.
 */
export const CLOUDFLARE_ANALYTICS_TOKEN = '0a39bfd3c37645649256d8d79da62045';

export const SITE = {
  name: 'Hélène Javaux',
  title: 'Hélène Javaux — Photographe',
  description:
    "Hélène Javaux, photographe indépendante basée à Bruxelles. Portraits, sport, packshot, événementiel et projets documentaires. Tirages d'art disponibles.",
  email: 'info@helenejavaux.be',
  phone: '+32 471 72 37 33',
  phoneHref: 'tel:+32471723733',
  instagram: 'https://www.instagram.com/helenejvx_photography/',
  instagramHandle: '@helenejvx_photography',
  location: 'Bruxelles, Belgique',
};
