import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Schéma commun des galeries (projets & services).
 * Chaque galerie = 1 fichier YAML ici + 1 dossier de photos dans
 * src/assets/photos/<projects|services>/<slug>/ (voir README).
 */
const gallerySchema = z.object({
  title: z.string(),
  year: z.number().optional(),
  // Court texte d'intention affiché en tête de galerie
  description: z.string().optional(),
  // Nom du fichier (dans le dossier de photos) utilisé comme vignette
  cover: z.string(),
  // Position CSS du cadrage de la vignette (ex: '50% 38%')
  coverPosition: z.string().optional(),
  // Recadrage de l'aperçu de partage (1200 × 630) tiré de la cover :
  // 'center' par défaut, 'attention' vise le sujet le plus saillant
  ogPosition: z.enum(['center', 'top', 'bottom', 'attention', 'entropy']).optional(),
  // Ordre d'affichage dans l'index (plus petit = premier)
  order: z.number().default(99),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: gallerySchema,
});

const services = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/services' }),
  schema: gallerySchema.extend({
    // Slug d'un projet de la galerie dont le regard est proche de cette
    // prestation (lien « approche » sur la page prestation) — optionnel
    relatedProject: z.string().optional(),
    // Trois photos (noms de fichiers du dossier) du « gallery wall » sur la
    // page Prestations : la 1re en grand, les 2 suivantes empilées à côté.
    // Optionnel — à défaut : la cover puis les premières photos du dossier.
    featured: z.array(z.string()).max(3).optional(),
    // Option du menu « Votre envie » du formulaire de contact présélectionnée
    // par les boutons « Demander un devis » (texte exact de l'<option>)
    contactType: z.string().optional(),
  }),
});

/** Tirages disponibles à la vente (page Shop). */
const prints = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/prints' }),
  schema: z.object({
    title: z.string(),
    // Référence unique du tirage, transmise dans le formulaire de demande
    reference: z.string(),
    // Chemin de la photo relatif à src/assets/photos/
    // ex: "projects/wild-care/wildcare-16.jpg"
    photo: z.string(),
    description: z.string().optional(),
    // Formats proposés avec prix indicatif
    formats: z.array(
      z.object({
        label: z.string(), // ex: "A4 (21 × 29,7 cm)"
        price: z.string(), // ex: "45 €"
        available: z.boolean().default(true),
      }),
    ),
    available: z.boolean().default(true),
    order: z.number().default(99),
  }),
});

const tarifPackageSchema = z.object({
  title: z.string(),
  price: z.string(),
  details: z.array(z.string()),
});

/** Grille tarifaire (page Tarifs) — une carte par type de prestation. */
const tarifs = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/tarifs' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    halfDay: z.string().optional(),
    fullDay: z.string().optional(),
    includes: z.array(z.string()).default([]),
    packages: z.array(tarifPackageSchema).optional(),
    notes: z.array(z.string()).optional(),
    note: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { projects, services, prints, tarifs };