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
