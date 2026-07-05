/* Build-time only: renders one grounded frame of the hero's baked run cycle
   (public/runner-bake.json) as a small inline-SVG wireframe glyph, so the
   footer can close the page with the same figure the hero opened it with.
   Never shipped to the client as data; the component emits plain SVG markup. */
import { readFileSync } from 'node:fs';

type Tier = { opacity: number; d: string };
export type RunnerGlyph = { viewBox: string; tiers: Tier[]; dots: { x: number; y: number; r: number; o: number }[] };

const bake = JSON.parse(readFileSync(new URL('../../public/runner-bake.json', import.meta.url), 'utf8'));

const dec16 = (s: string) => { const b = Buffer.from(s, 'base64'); return new Uint16Array(b.buffer, b.byteOffset, b.byteLength / 2); };
const decF32 = (s: string) => { const b = Buffer.from(s, 'base64'); return new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4); };
const hsh = (i: number) => { const x = Math.sin(i * 78.233 + 1.3) * 43758.5453; return x - Math.floor(x); };

export function runnerGlyph(): RunnerGlyph {
  const n: number = bake.n, F: number = bake.F, qb: number[] = bake.qbb, bb = bake.bb;
  const q = dec16(bake.pos);
  const world = (f: number, i: number, a: number) => {
    const k = (f * n + i) * 3 + a;
    return qb[a] + (q[k] / 65535) * (qb[a + 3] - qb[a]);
  };

  // Pick the most grounded frame: the one where the lowest foot reaches deepest.
  let frame = 0, lowest = Infinity;
  for (let f = 0; f < F; f++) {
    let minY = Infinity;
    for (let i = 0; i < n; i++) { const wy = world(f, i, 1); if (wy < minY) minY = wy; }
    if (minY < lowest) { lowest = minY; frame = f; }
  }

  // Project side-on, exactly like the hero: x = world z, y = -world y, depth = world x.
  const px = new Float32Array(n), py = new Float32Array(n), pd = new Float32Array(n);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const dRange = (bb.maxx - bb.minx) || 1;
  for (let i = 0; i < n; i++) {
    px[i] = world(frame, i, 2);
    py[i] = -world(frame, i, 1);
    pd[i] = Math.max(0, Math.min(1, (world(frame, i, 0) - bb.minx) / dRange));
    if (px[i] < minX) minX = px[i]; if (px[i] > maxX) maxX = px[i];
    if (py[i] < minY) minY = py[i]; if (py[i] > maxY) maxY = py[i];
  }

  const ea = dec16(bake.ea), eb = dec16(bake.eb), er = decF32(bake.er);
  const TIERS = 5, WIRE_KEEP = 0.6;
  const parts: string[][] = Array.from({ length: TIERS }, () => []);
  for (let e = 0; e < ea.length; e++) {
    if ((e * 0.618034) % 1 >= WIRE_KEEP) continue;          // same stable thinning as the hero
    const a = ea[e], b = eb[e];
    if (Math.hypot(px[a] - px[b], py[a] - py[b]) > er[e] * 2) continue;   // stretch cull
    const t = (pd[a] + pd[b]) / 2;
    const tier = Math.min(TIERS - 1, Math.floor(t * TIERS));
    parts[tier].push(`M${px[a].toFixed(1)} ${py[a].toFixed(1)}L${px[b].toFixed(1)} ${py[b].toFixed(1)}`);
  }
  const tiers: Tier[] = parts
    .map((d, i) => ({ opacity: +(0.28 + 0.5 * ((i + 0.5) / TIERS)).toFixed(2), d: d.join('') }))
    .filter((t) => t.d.length > 0);

  const h = maxY - minY;
  const dots = [] as RunnerGlyph['dots'];
  for (let i = 0; i < n; i++) {                             // a sparse scatter of near-side vertices
    if (hsh(i) > 0.055 || pd[i] < 0.45) continue;
    dots.push({ x: +px[i].toFixed(1), y: +py[i].toFixed(1), r: +(h * 0.016).toFixed(2), o: +(0.5 + 0.5 * pd[i]).toFixed(2) });
  }

  const pad = h * 0.03;
  const viewBox = `${(minX - pad).toFixed(1)} ${(minY - pad).toFixed(1)} ${(maxX - minX + pad * 2).toFixed(1)} ${(maxY - minY + pad).toFixed(1)}`;
  return { viewBox, tiers, dots };
}
