import data from '../data/publications.json';

export interface Author { name: string; isOwner: boolean; }
export interface Publication {
  id: string;
  type: string;
  title: string;
  authors: Author[];
  year: number | null;
  month: number | null;
  journal: string;
  doi: string;
  abstract: string;
  featured: boolean;
  theme: string;
}

export const publications = data as Publication[];
export const featured = publications.filter((p) => p.featured);
export const byYearDesc = [...publications].sort(
  (a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0),
);

export const THEME_LABELS: Record<string, string> = {
  'arterial-rt': 'Arterial stiffness & resistance training',
  'sedentary-vascular': 'Sedentary behaviour & vascular health',
  'bone-calcium': 'Bone, calcium & hypoxia',
  'clinical-rehab': 'Clinical exercise rehabilitation',
  'athlete-health': 'Athlete health & RED-S',
};
