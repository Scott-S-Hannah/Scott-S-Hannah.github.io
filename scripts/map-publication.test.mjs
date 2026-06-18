import { describe, it, expect } from 'vitest';
import { mapCslToPublication, assignTheme } from './map-publication.mjs';

const sampleCsl = {
  id: 'jch70020',
  type: 'article-journal',
  title: 'Arterial stiffness and wave reflection responses following heavy and moderate load resistance training protocols',
  author: [
    { family: 'Karanasios', given: 'Eleftherios' },
    { family: 'Hannah', given: 'Scott' },
  ],
  issued: { 'date-parts': [[2025, 4]] },
  'container-title': 'Journal of Clinical Hypertension',
  DOI: '10.1111/jch.70020',
  abstract: 'This study compared the acute effects of resistance training...',
};

describe('mapCslToPublication', () => {
  const pub = mapCslToPublication(sampleCsl);
  it('keeps the id and title', () => {
    expect(pub.id).toBe('jch70020');
    expect(pub.title).toContain('Arterial stiffness and wave reflection');
  });
  it('normalises type to a short label', () => {
    expect(pub.type).toBe('article');
  });
  it('extracts year and month from issued', () => {
    expect(pub.year).toBe(2025);
    expect(pub.month).toBe(4);
  });
  it('maps the journal and doi', () => {
    expect(pub.journal).toBe('Journal of Clinical Hypertension');
    expect(pub.doi).toBe('10.1111/jch.70020');
  });
  it('flags Scott Hannah as the owner author', () => {
    expect(pub.authors).toEqual([
      { name: 'Eleftherios Karanasios', isOwner: false },
      { name: 'Scott Hannah', isOwner: true },
    ]);
  });
  it('marks the flagship DOI as featured', () => {
    expect(pub.featured).toBe(true);
  });
  it('tags the arterial-stiffness theme', () => {
    expect(pub.theme).toBe('arterial-rt');
  });
});

describe('mapCslToPublication – conference venue fallback', () => {
  it('paper-conference type maps to "conference" and uses container-title as journal', () => {
    const csl = {
      id: 'c1',
      type: 'paper-conference',
      title: 'A conference talk on arterial stiffness',
      author: [{ family: 'Hannah', given: 'Scott' }],
      issued: { 'date-parts': [[2025, 6]] },
      'container-title': 'Physiology 2025',
    };
    const pub = mapCslToPublication(csl);
    expect(pub.type).toBe('conference');
    expect(pub.journal).toBe('Physiology 2025');
  });

  it('falls back to the note venue when container-title and publisher are absent', () => {
    const csl = {
      id: 'c2',
      type: 'paper-conference',
      title: 'Training to volitional failure in clinical populations',
      author: [{ family: 'Hannah', given: 'Scott' }],
      issued: { 'date-parts': [[2025, 6]] },
      note: 'Some Society Meeting ; Conference date: 02-06-2025',
    };
    const pub = mapCslToPublication(csl);
    expect(pub.journal).toBe('Some Society Meeting');
  });

  it('joins a publisher array when there is no container-title or note', () => {
    const csl = {
      id: 'c3',
      type: 'paper-conference',
      title: 'Resistance training and arterial stiffness',
      author: [{ family: 'Hannah', given: 'Scott' }],
      issued: { 'date-parts': [[2025, 6]] },
      publisher: ['John Wiley', 'Sons Inc.'],
    };
    const pub = mapCslToPublication(csl);
    expect(pub.journal).toBe('John Wiley Sons Inc.');
  });
});

describe('assignTheme', () => {
  it('tags sitting / Long COVID work as sedentary-vascular', () => {
    expect(assignTheme('Uninterrupted and interrupted sitting on vascular function in adults with Long COVID', '')).toBe('sedentary-vascular');
  });
  it('tags bone/calcium/hypoxia work', () => {
    expect(assignTheme('Take My Bone Away? Hypoxia and bone: a narrative review', 'bone metabolism, hypoxia')).toBe('bone-calcium');
  });
  it('tags stroke/rehab work', () => {
    expect(assignTheme('The implementation of robot-assisted gait training in a UK NHS stroke service', '')).toBe('clinical-rehab');
  });
  it('tags RED-S / athlete-health work', () => {
    expect(assignTheme('Body Image, Disordered Eating, and the Behavioural Pathways to Relative Energy Deficiency in Sport', '')).toBe('athlete-health');
  });
  it('falls back to arterial-rt for resistance-training / pulse-wave work', () => {
    expect(assignTheme('Effort matched resistance training protocols on arterial stiffness', 'pulse wave velocity')).toBe('arterial-rt');
  });
});
