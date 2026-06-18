import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Cite } from '@citation-js/core';
import '@citation-js/plugin-bibtex';
import { mapCslToPublication } from './map-publication.mjs';

const SRC = 'publications.bib';
const OUT = 'src/data/publications.json';

const bib = readFileSync(SRC, 'utf-8');
const cite = new Cite(bib);
const items = cite.data
  .map(mapCslToPublication)
  .filter((p) => p.title)
  .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(items, null, 2) + '\n');
console.log(`Wrote ${items.length} publications to ${OUT}`);
