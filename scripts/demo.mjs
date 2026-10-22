// Bascule le site sur une démo sectorielle : `npm run demo -- restaurant`
// Démos disponibles : restaurant, coiffure, artisan, boulangerie, paysagiste, batiment, modele (fleuriste d'origine).
import { cpSync, existsSync, readdirSync, rmSync, mkdirSync } from 'node:fs';

const nom = process.argv[2];
const racine = new URL('../', import.meta.url);
const dossiers = readdirSync(new URL('demos/', racine)).filter((d) => !d.startsWith('.'));

if (!nom || !dossiers.includes(nom)) {
  console.log(`\nUsage : npm run demo -- <nom>\nDémos disponibles : ${dossiers.join(', ')}\n`);
  process.exit(1);
}

const source = new URL(`demos/${nom}/`, racine);
for (const f of ['accueil', 'entreprise', 'horaires', 'legal', 'technique', 'theme']) {
  cpSync(new URL(`${f}.json`, source), new URL(`src/data/${f}.json`, racine));
}
const actus = new URL('src/content/actualites/', racine);
rmSync(actus, { recursive: true, force: true });
mkdirSync(actus, { recursive: true });
if (existsSync(new URL('actualites/', source))) cpSync(new URL('actualites/', source), actus, { recursive: true });

console.log(`\n✓ Démo « ${nom} » appliquée. Lancez \`npm run dev\` pour la voir.\n`);
