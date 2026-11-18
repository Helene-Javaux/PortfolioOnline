// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // URL finale du site (utilisée pour les balises Open Graph / sitemap).
  site: 'https://helenejavaux.be',

  // Cache d'Astro (dont les images déjà générées par Sharp) sorti de
  // node_modules/, son emplacement par défaut : en CI, `npm ci` efface
  // node_modules/ avant le build, ce qui détruirait le cache restauré par
  // actions/cache. Voir l'étape « Cache des images Astro » dans deploy.yml.
  cacheDir: './.astro-cache',

  // Génère sitemap-index.xml (référencé dans public/robots.txt) ; la 404
  // n'a rien à y faire.
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],

  // Si le site est déployé sur GitHub Pages SANS nom de domaine personnalisé
  // (ex: https://helene-javaux.github.io/PortfolioOnline/), décommenter :
  // base: '/PortfolioOnline',
});
