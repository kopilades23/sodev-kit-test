# Instructions pour Claude — site client Sodeev

Ce dépôt est un site vitrine pour un commerce local, construit sur le modèle Sodeev.
Stack : Astro (site statique) · contenus en JSON/Markdown · édition client via Pages CMS · hébergement Cloudflare Pages.

## Règle d'or

**Le design et le code restent dans `src/components`, `src/layouts`, `src/styles`. Tout ce que le client peut changer vit dans `src/data` et `src/content`.**
Ne jamais écrire de texte du client en dur dans un composant : il ne pourrait plus le modifier.

## Où se trouve quoi

| Fichier | Contenu | Visible par le client dans Pages CMS |
| --- | --- | --- |
| `src/data/entreprise.json` | Nom, métier, ville, téléphone, adresse, liens Google, réseaux | Oui (« Coordonnées ») |
| `src/data/accueil.json` | Textes et photos de la page d'accueil, SEO | Oui (« Page d'accueil ») |
| `src/data/horaires.json` | Horaires, bandeau d'annonce | Oui (« Horaires et annonce ») |
| `src/data/legal.json` | Infos des mentions légales | Oui (« Mentions légales ») |
| `src/content/actualites/*.md` | Actualités | Oui (« Actualités ») |
| `src/data/theme.json` | Couleurs, polices, arrondis | **Non** (réservé Sodeev) |
| `src/data/technique.json` | Domaine, type Google, clé formulaire, crédit, hébergeur | **Non** (réservé Sodeev) |
| `.pages.yml` | Ce que l'espace client affiche | Non |
| `src/assets/images/` | Toutes les photos (optimisées automatiquement au build) | Oui, via les champs photo |

Les photos sont référencées dans les contenus sous la forme `/images/nom.jpg` ; le fichier réel est dans `src/assets/images/nom.jpg`. Le composant `Img.astro` fait la correspondance et génère AVIF/WebP en plusieurs tailles.

## Personnaliser le site pour un nouveau client

Quand on te demande de préparer le site d'un nouveau client, à partir du brief :

1. **`technique.json`** : `url` (domaine final avec https://www), `type_schema` (type schema.org le plus précis : `Florist`, `Bakery`, `Restaurant`, `HairSalon`, `BeautySalon`, `Store`, `ClothingStore`, `AutoRepair`, `Dentist`, `RealEstateAgent`… sinon `LocalBusiness`), `web3forms_cle`, `afficher_actualites`.
2. **`theme.json`** : couleurs tirées du logo / de la devanture du client. Contraintes :
   - contraste texte/fond ≥ 4,5:1 (`couleur_texte` sur `couleur_fond`, `couleur_sur_principale` sur `couleur_principale`) ;
   - `couleur_fond` claire et légèrement teintée plutôt que blanc pur ;
   - polices disponibles : `fraunces`, `playfair` (titres élégants), `inter`, `dmsans` (texte). Pour en ajouter une : installer `@fontsource-variable/<police>`, l'importer dans `Base.astro`, l'ajouter à l'objet `polices`. Jamais de Google Fonts en lien externe (RGPD).
3. **`entreprise.json`, `horaires.json`, `legal.json`** : avec les infos du brief. Horaires au format `HH:MM`. Ce qui manque reste `[À COMPLÉTER]` (le script de vérification le détectera).
4. **`accueil.json`** : rédiger les textes. Ton chaleureux, concret, phrases courtes, aucun superlatif creux (« le meilleur », « unique »). Le titre SEO fait ≤ 65 caractères et contient métier + ville ; la description ≤ 160 caractères.
5. **Photos** : déposer celles du client dans `src/assets/images/` avec des noms parlants en minuscules sans accents (`devanture.jpg`, `bouquet-mariage.jpg`), puis mettre à jour les chemins. Supprimer les images d'exemple non utilisées. Chaque photo importante a un texte alternatif descriptif.
6. **Sections** : masquer une section sans contenu via son champ `afficher: false` plutôt que de supprimer le composant. Sections disponibles : `prestations`, `carte` (carte de restaurant ou grille de tarifs, avec ardoise du jour), `atouts`, `apropos`, `galerie`, `zone` (zone d'intervention), `avis`, `actualites`, `contact`. Leur ordre se règle dans `technique.json` → `sections`. Le bouton principal se règle dans `entreprise.json` → `action_principale` (vide = « Nous appeler »).
   Pour partir d'un secteur proche, appliquer d'abord la démo correspondante : `npm run demo -- restaurant` (ou `coiffure`, `artisan`, `boulangerie`, `paysagiste`, `batiment`), puis remplacer les contenus et passer `technique.demo` à `false`. Les photos Unsplash des démos doivent être remplacées par celles du client.
7. **Favicon** : remplacer `public/favicon.svg` (initiale ou logo du client, couleur principale).
8. Lancer `npm run build` puis `npm run verifier` et corriger jusqu'à 0 erreur.

## Modifier le design

- Tout le style est dans `src/styles/global.css` et utilise les variables CSS (`--c-principale`, `--f-titres`…). Ne pas coder de couleur en dur.
- Si tu ajoutes un champ éditable par le client : l'ajouter au JSON **et** dans `.pages.yml` (avec un libellé en français simple et une description si besoin).
- Si tu ajoutes une section : nouveau composant dans `src/components`, contenu dans `accueil.json` avec un booléen `afficher`, champ correspondant dans `.pages.yml`.
- Pas de dépendance JavaScript lourde, pas d'iframe tierce (Google Maps, YouTube, Instagram) sans prévoir un bandeau de consentement : sinon le site perd sa conformité « sans cookie ».

## Vérifications avant de livrer

```bash
npm run build      # doit passer sans erreur
npm run verifier   # doit afficher 0 erreur bloquante
npm run preview    # contrôle visuel sur http://localhost:4321
```

Contrôler aussi : affichage mobile (390 px) et ordinateur, contraste, tous les liens tel:/mailto:/itinéraire, page mentions légales complète.

## Ne jamais

- Mettre de vraies données personnelles de clients finaux dans le dépôt.
- Inventer des avis clients, des chiffres ou des labels.
- Supprimer `public/_headers` (sécurité + non-indexation de l'adresse *.pages.dev).
- Renommer les clés JSON existantes sans mettre à jour `.pages.yml` et les composants.
