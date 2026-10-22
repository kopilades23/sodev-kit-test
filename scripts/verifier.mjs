// Vérification avant mise en ligne : `npm run verifier`
// Signale tout ce qui trahirait un site pas fini.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const lire = (f) => JSON.parse(readFileSync(new URL(`../src/data/${f}`, import.meta.url)));
const entreprise = lire('entreprise.json');
const legal = lire('legal.json');
const technique = lire('technique.json');
const accueil = lire('accueil.json');
const theme = lire('theme.json');

const erreurs = [];
const alertes = [];

// 1. Champs à compléter
const parcourir = (obj, chemin) => {
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && /À COMPLÉTER|lorem|exemple\.fr/i.test(v)) erreurs.push(`${chemin}.${k} contient encore « ${v} »`);
    else if (v && typeof v === 'object') parcourir(v, `${chemin}.${k}`);
  }
};
parcourir(entreprise, 'entreprise');
parcourir(legal, 'legal');
parcourir(accueil, 'accueil');
if (/exemple\.fr/.test(technique.url)) erreurs.push('technique.url : remplacer https://www.exemple.fr par le vrai domaine');

// 2. Mentions légales obligatoires
for (const champ of ['raison_sociale', 'siren', 'directeur_publication']) if (!legal[champ]) erreurs.push(`legal.${champ} est vide (mentions légales obligatoires)`);
if (/SARL|SAS|EURL|SASU|SNC/.test(legal.forme) && !legal.capital) erreurs.push('legal.capital est vide (obligatoire pour une société)');

// 3. Technique
if (!technique.web3forms_cle) erreurs.push('technique.web3forms_cle est vide : le formulaire de contact ne fonctionnera pas');
if (!entreprise.lien_google_maps) alertes.push('Pas de lien Google Maps : le bouton Itinéraire sera masqué');
if (!entreprise.lien_avis_google) alertes.push('Pas de lien vers les avis Google : l\'encart avis sera masqué');
if ((accueil.seo?.titre ?? '').length > 65) alertes.push('Titre SEO > 65 caractères : il sera coupé dans Google');
if ((accueil.seo?.description ?? '').length > 160) alertes.push('Description SEO > 160 caractères : elle sera coupée dans Google');

// 3 bis. Contrastes du thème (WCAG AA : 4,5:1)
const lum = (hex) => {
  const c = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
for (const [t, f, nom] of [
  ['couleur_texte', 'couleur_fond', 'texte sur fond'],
  ['couleur_texte_doux', 'couleur_fond', 'texte doux sur fond'],
  ['couleur_sur_principale', 'couleur_principale', 'texte des boutons'],
  ['couleur_principale', 'couleur_fond', 'liens et prix sur fond'],
]) {
  const r = contraste(theme[t], theme[f]);
  if (r < 4.5) erreurs.push(`Contraste insuffisant (${nom}) : ${r.toFixed(2)}:1, minimum 4,5:1 — ajuster theme.json`);
}

// 4. Images d'exemple restantes (dégradés du modèle, toutes < 120 Ko)
const dossier = new URL('../src/assets/images/', import.meta.url).pathname;
const modeles = ['hero.jpg', 'apropos.jpg', 'prestation-1.jpg', 'prestation-2.jpg', 'prestation-3.jpg', 'galerie-1.jpg', 'actu-1.jpg', 'actu-2.jpg'];
const utilisees = JSON.stringify([accueil]) + readdirSync(new URL('../src/content/actualites/', import.meta.url)).map((f) => readFileSync(new URL(`../src/content/actualites/${f}`, import.meta.url), 'utf8')).join('');
for (const m of modeles) if (utilisees.includes(`/images/${m}`)) alertes.push(`Image d'exemple encore utilisée : ${m}`);
for (const f of readdirSync(dossier)) {
  const taille = statSync(join(dossier, f)).size;
  if (taille > 8 * 1024 * 1024) alertes.push(`Image très lourde (${(taille / 1048576).toFixed(1)} Mo) : ${f} — elle sera optimisée, mais alourdit le dépôt`);
}

console.log('\n=== Vérification avant mise en ligne ===\n');
erreurs.forEach((e) => console.log('  ✗', e));
alertes.forEach((a) => console.log('  !', a));
if (!erreurs.length && !alertes.length) console.log('  ✓ Tout est en ordre.');
console.log(`\n${erreurs.length} erreur(s) bloquante(s), ${alertes.length} alerte(s).\n`);
process.exit(erreurs.length ? 1 : 0);
