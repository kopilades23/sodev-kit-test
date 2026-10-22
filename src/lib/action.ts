import entreprise from '../data/entreprise.json';

// Bouton d'action principal : « Réserver une table », « Prendre rendez-vous », « Demander un devis »…
// Si rien n'est renseigné, le bouton principal est « Nous appeler ».
export const telephoneLien = `tel:${entreprise.telephone.replace(/[^\d+]/g, '')}`;
const a = (entreprise as { action_principale?: { texte?: string; lien?: string } }).action_principale;
export const action = a?.texte && a?.lien
  ? { texte: a.texte, lien: a.lien, externe: /^https?:\/\//.test(a.lien) }
  : null;
