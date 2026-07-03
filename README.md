# helenejavaux.be — Site portfolio

Site portfolio de **Hélène Javaux**, photographe indépendante basée à Bruxelles
([@helenejvx_photography](https://www.instagram.com/helenejvx_photography/)).

Site 100 % statique construit avec [Astro](https://astro.build) : pas de CMS,
pas de backend. Les formulaires passent par [Web3Forms](https://web3forms.com).

## Démarrage

```bash
npm install
npm run dev        # serveur local → http://localhost:4321
npm run build      # build de production dans dist/
npm run preview    # prévisualisation du build
```

## Structure

```
src/
├── assets/photos/          ← LES PHOTOS (voir « Ajouter du contenu »)
│   ├── projects/<slug>/    photos d'un projet
│   ├── services/<slug>/    photos d'une galerie de service
│   └── about/              portrait de la page d'accueil
├── content/                ← LES MÉTADONNÉES (fichiers YAML)
│   ├── projects/<slug>.yaml
│   ├── services/<slug>.yaml
│   ├── prints/<nom>.yaml   tirages du shop
│   └── tarifs/<nom>.yaml   cartes de la page tarifs
├── components/             composants réutilisables (galerie, lightbox, formulaires…)
├── layouts/BaseLayout.astro
├── pages/                  les pages du site (1 fichier = 1 URL)
├── lib/                    helpers (découverte des photos, envoi Web3Forms)
└── config.ts               ⚠️ coordonnées + CLÉS WEB3FORMS
```

## ⚠️ Activer les formulaires (Web3Forms)

Les deux formulaires (contact et demande de tirage) sont fonctionnels mais
utilisent des clés placeholder. Pour les activer :

1. Créer **deux** clés d'accès gratuites sur [web3forms.com](https://web3forms.com)
   (une pour le contact, une pour le shop — cela permet de trier les e-mails reçus).
2. Ouvrir [`src/config.ts`](src/config.ts) et remplacer les deux
   `YOUR_ACCESS_KEY_HERE` par les vraies clés.

Tant que les clés ne sont pas remplacées, le formulaire affiche un message
d'erreur explicite au lieu d'envoyer.

## Ajouter du contenu

### Ajouter un projet (ou un service)

1. Créer un dossier de photos : `src/assets/photos/projects/mon-projet/`
   (pour un service : `src/assets/photos/services/mon-service/`).
2. Y déposer les photos **en pleine résolution** (JPG/PNG/WebP). Elles sont
   affichées dans l'ordre alphabétique du nom de fichier — utiliser un préfixe
   numérique à deux chiffres : `01-xxx.jpg`, `02-yyy.jpg`, …
   Astro génère automatiquement vignettes et grands formats optimisés.
3. Créer le fichier de métadonnées `src/content/projects/mon-projet.yaml`
   (le nom du fichier = le slug de l'URL = le nom du dossier photos) :

   ```yaml
   title: Mon projet
   year: 2026
   order: 1                # position dans l'index (plus petit = premier)
   cover: 01-xxx.jpg       # photo utilisée comme vignette
   description: >-
     Court texte d'intention affiché en tête de galerie.
   ```

C'est tout — la page `/portfolio/projets/mon-projet/` est générée au prochain build.

### Ajouter une photo à une galerie existante

Déposer le fichier dans le dossier de la galerie avec le bon préfixe numérique.
Rien d'autre à faire.

### Ajouter un tirage au shop

Créer `src/content/prints/mon-tirage.yaml` :

```yaml
title: Nom du tirage
reference: HJ-XX-01                      # référence unique, reçue dans l'e-mail
photo: projects/mon-projet/01-xxx.jpg    # chemin relatif à src/assets/photos/
description: Tirage issu de la série…
order: 1
available: true                          # false pour le masquer sans le supprimer
formats:
  - label: A4 (21 × 29,7 cm)
    price: 45 €
  - label: A3 (29,7 × 42 cm)
    price: 70 €
```

### Modifier les tarifs

Éditer les fichiers `src/content/tarifs/*.yaml` (une carte par prestation).
Les frais de déplacement se modifient dans [`src/pages/tarifs.astro`](src/pages/tarifs.astro).

### Coordonnées, réseaux sociaux

Tout est centralisé dans [`src/config.ts`](src/config.ts).

## Contenu placeholder à remplacer

- Les galeries **Services** (portrait, sport, packshot, événementiel)
  contiennent des copies de photos des projets en attendant les vraies images
  (fichiers nommés `placeholder-*.jpg`, descriptions marquées `[PLACEHOLDER]`).
- Les **prix** (tarifs et tirages) sont indicatifs, marqués `[PLACEHOLDER]`
  dans les YAML.
- Les **témoignages** ([`src/components/Testimonials.astro`](src/components/Testimonials.astro),
  affichés sur Tarifs et Contact) sont fictifs — à remplacer par de vraies
  citations avec l'accord des clients.
- Les **conditions générales de vente**
  ([`src/pages/conditions-generales-de-vente.astro`](src/pages/conditions-generales-de-vente.astro))
  sont un document type à faire valider juridiquement.
- Les clés **Web3Forms** (voir plus haut).

## Identité visuelle

- Palette héritée de l'ancien site : encre `#242424`, papier `#ffffff`,
  gris doux `#f4f4f4` — header, footer et bandes CTA en sombre.
- Typographies : **Syne** (titres) + **Manrope** (texte courant), via Google Fonts.
- Signature récurrente : le « kicker » (petit libellé en capitales précédé
  d'un trait) qui introduit chaque titre — classe CSS `.kicker` dans
  [`src/styles/global.css`](src/styles/global.css).
- Animations : apparition au scroll via `data-reveal` (IntersectionObserver
  dans le layout), fondu entre photos dans la lightbox, micro-interactions au
  survol. Tout respecte `prefers-reduced-motion`.

## Site expérimental « La galerie » (`/experimental/`)

Une seconde version du site, **complètement indépendante en design**, vit sous
[`/experimental/`](src/pages/experimental/) pour expérimentation : expérience
sombre et immersive « galerie d'exposition » (Fraunces + accent bronze), pensée
pour maximiser la prise de contact et la vente de tirages :

- accueil plein écran avec diaporama en fondu, manifeste, « salles » (séries) ;
- **une page dédiée par tirage** (`/experimental/boutique/<slug>/`) avec
  formulaire de commande inline et référence pré-remplie ;
- **une landing page par prestation** (`/experimental/prestations/<slug>/`) :
  galerie d'exemples + tarifs + témoignage + devis sur une seule page. Le champ
  optionnel `relatedProject` d'un YAML de service (`src/content/services/`)
  fait le pont vers la série cousine de la galerie ;
- tirages de la série proposés en fin de chaque galerie (cross-sell) ;
- prestations & tarifs fusionnés sur une page, CTA de contact partout.

Il partage les mêmes contenus (collections YAML), les mêmes photos et les mêmes
clés Web3Forms que le site principal — layout
[`src/layouts/ExpLayout.astro`](src/layouts/ExpLayout.astro), styles
[`src/styles/experimental.css`](src/styles/experimental.css). Il est balisé
`noindex` tant qu'il n'est pas retenu. Pour le supprimer : effacer
`src/pages/experimental/`, `src/layouts/ExpLayout.astro` et
`src/styles/experimental.css`.

## Déploiement (GitHub Pages)

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
construit et déploie le site à chaque push sur `main`.
À activer une fois : réglages du repo GitHub → **Pages** → Source :
**GitHub Actions**.

- **Avec le domaine helenejavaux.be** : configurer le domaine personnalisé dans
  les réglages Pages (le `site` est déjà réglé dans `astro.config.mjs`).
- **Sans domaine personnalisé** (`https://<user>.github.io/PortfolioOnline/`) :
  décommenter la ligne `base: '/PortfolioOnline'` dans `astro.config.mjs`.

> Note : les photos de `src/assets/photos/` doivent être **commitées** pour que
> le build GitHub Actions les trouve (l'ancien dossier `images/` de l'ancien
> site reste ignoré par git et sert d'archive locale).
