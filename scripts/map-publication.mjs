export const FEATURED_DOIS = new Set([
  '10.1111/jch.70020',
  '10.1371/journal.pone.0318942',
  '10.1002/jcp.29921',
]);

const TYPE_MAP = {
  'article-journal': 'article',
  'paper-conference': 'conference',
  'article': 'article',
  'chapter': 'chapter',
};

const THEME_RULES = [
  { theme: 'sedentary-vascular', re: /(sitting|sedentary|long covid)/i },
  { theme: 'bone-calcium', re: /(bone|calcium|hypoxi|parathyroid|pth)/i },
  { theme: 'clinical-rehab', re: /(stroke|spinal cord|rehabilitation|gait|compression|cryocompression)/i },
  { theme: 'athlete-health', re: /(red-?s|relative energy|body image|disordered eating|athlete)/i },
  { theme: 'arterial-rt', re: /(arterial|resistance training|pulse wave|stiffness|occlusion|blood flow restriction|wave reflection)/i },
];

export function assignTheme(title = '', keywords = '') {
  const haystack = `${title} ${keywords}`;
  for (const rule of THEME_RULES) {
    if (rule.re.test(haystack)) return rule.theme;
  }
  return 'arterial-rt';
}

function fullName(author) {
  return [author.given, author.family].filter(Boolean).join(' ').trim();
}

export function mapCslToPublication(csl) {
  const dateParts = csl.issued && csl.issued['date-parts'] && csl.issued['date-parts'][0]
    ? csl.issued['date-parts'][0]
    : [];
  const keywords = Array.isArray(csl.keyword) ? csl.keyword.join(' ') : (csl.keyword || '');
  return {
    id: csl.id,
    type: TYPE_MAP[csl.type] || 'article',
    title: (csl.title || '').replace(/\s+/g, ' ').trim(),
    authors: (csl.author || []).map((a) => {
      const name = fullName(a);
      return { name, isOwner: a.family === 'Hannah' && /scott/i.test(a.given || '') };
    }),
    year: dateParts[0] ?? null,
    month: dateParts[1] ?? null,
    journal: csl['container-title'] || csl['publisher'] || '',
    doi: csl.DOI || '',
    abstract: (csl.abstract || '').replace(/\s+/g, ' ').trim(),
    featured: csl.DOI ? FEATURED_DOIS.has(csl.DOI) : false,
    theme: assignTheme(csl.title || '', keywords),
  };
}
