import horaires from '../data/horaires.json';

export type Jour = (typeof horaires.jours)[number];

const JOURS_SCHEMA = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const valide = (h?: string) => !!h && /^([01]\d|2[0-3]):[0-5]\d$/.test(h);

export function creneaux(j: Jour): [string, string][] {
  if (j.ferme) return [];
  const liste: [string, string][] = [];
  if (valide(j.debut_1) && valide(j.fin_1)) liste.push([j.debut_1, j.fin_1]);
  if (valide(j.debut_2) && valide(j.fin_2)) liste.push([j.debut_2, j.fin_2]);
  return liste;
}

// "09:00" -> "9 h", "12:30" -> "12 h 30"
export function heureFr(h: string): string {
  const [hh, mm] = h.split(':');
  return `${Number(hh)}\u00a0h${mm === '00' ? '' : '\u00a0' + mm}`;
}

export function plagesJour(j: Jour): string[] {
  return creneaux(j).map(([a, b]) => `${heureFr(a)} – ${heureFr(b)}`);
}

export function texteJour(j: Jour): string {
  const c = creneaux(j);
  if (!c.length) return 'Fermé';
  return c.map(([a, b]) => `${heureFr(a)} – ${heureFr(b)}`).join(' · ');
}

// Données structurées pour Google (openingHoursSpecification)
export function horairesSchema() {
  return horaires.jours.flatMap((j, i) =>
    creneaux(j).map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: JOURS_SCHEMA[i],
      opens,
      closes,
    })),
  );
}

// Version compacte pour le script "ouvert maintenant" côté navigateur (0 = lundi)
export function horairesCompacts(): [string, string][][] {
  return horaires.jours.map((j) => creneaux(j));
}

export { horaires };
