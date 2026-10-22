import type { ImageMetadata } from 'astro';

// Toutes les images envoyées depuis l'espace d'édition arrivent dans src/assets/images
// et sont référencées dans les contenus sous la forme "/images/nom.jpg".
// On les retrouve ici pour qu'Astro les optimise (WebP, tailles adaptées) au build.
const fichiers = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

export function trouverImage(chemin?: string | null): ImageMetadata | undefined {
  if (!chemin) return undefined;
  const cle = chemin.replace(/^\/?images\//, '/src/assets/images/');
  return fichiers[cle]?.default;
}
