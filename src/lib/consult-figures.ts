/* Build-time: the three Work with me figures. All three are THE RUNNER's own
   body (running.fbx), game-animation style: a retargeted mocap idle as the
   living base plus authored aim-blend gesture layers (baking/perform-bake.mjs):
   - research: the "study" performance in side profile, head down on the work,
     hands holding it, a page-turn and a lift-to-chin thinking beat (plus
     ruler ticks + a scan line the client sweeps);
   - performance: the hero run cycle at maximum stride;
   - lectures: the "lecture" performance facing the audience, weight shifting,
     gesticulating at waist-to-chest height, never above the shoulders.
   Bakes live in public/ so the client renderer in Consultancy.astro can fetch
   and replay the same data with the same transform. Each Fig carries data-*
   attrs wiring that up. */
import { readFileSync } from 'node:fs';

export type Fig = { viewBox: string; body: string; anim: Record<string, string>; props?: string };
type Proj = 'side' | 'front';

const hsh = (i: number) => { const x = Math.sin(i * 78.233 + 1.3) * 43758.5453; return x - Math.floor(x); };
const d16 = (s: string) => { const b = Buffer.from(s, 'base64'); return new Uint16Array(b.buffer, b.byteOffset, b.byteLength / 2); };
const f32 = (s: string) => { const b = Buffer.from(s, 'base64'); return new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4); };

type Bake = {
  n: number; F: number; dur: number; ts?: number; qbb: number[];
  q: Uint16Array; ea: Uint16Array; eb: Uint16Array; er: Float32Array;
  fc?: Uint16Array; fr?: Float32Array;               // faces + rest sizes -> translucent fills
  dw?: { x: number[]; z: number[] };                 // body-tight depth windows per axis
  anchors?: Record<string, number[]>;
};
function loadBake(file: string): Bake {
  const raw = JSON.parse(readFileSync(new URL(`../../public/${file}`, import.meta.url), 'utf8'));
  return {
    n: raw.n, F: raw.F, dur: raw.dur, ts: raw.ts, qbb: raw.qbb, q: d16(raw.pos), ea: d16(raw.ea), eb: d16(raw.eb), er: f32(raw.er),
    fc: raw.fc ? d16(raw.fc) : undefined,
    fr: raw.fr ? f32(raw.fr) : (raw.trS ? f32(raw.trS) : undefined),   // the hero bake calls it trS
    dw: raw.dw, anchors: raw.anchors,
  };
}
const BAKES: Record<string, Bake> = {
  runner: loadBake('runner-bake.json'),
  study: loadBake('study-bake.json'),
  lecture: loadBake('lecture-bake.json'),
};

const world = (b: Bake, f: number, i: number, a: number) =>
  b.qbb[a] + (b.q[(f * b.n + i) * 3 + a] / 65535) * (b.qbb[a + 3] - b.qbb[a]);

/* side: screen x = world z, depth = world x; front: screen x = world x, depth = world z. */
const axes = (p: Proj) => (p === 'side' ? { h: 2, d: 0 } : { h: 0, d: 2 });

type Nodes = { px: number[]; py: number[]; pd: number[]; minX: number; maxX: number; minY: number; maxY: number };
function frameNodes(b: Bake, f: number, proj: Proj): Nodes {
  const { h, d } = axes(proj);
  const px: number[] = [], py: number[] = [], pd: number[] = [];
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  // Depth tiers centre on THIS FRAME's mean depth (the body drifts as it
  // sways, so a fixed window mis-tiers half the clip); the span is calibrated
  // once from the rest pose (dw = p20..p80 of frame 0). Gesture reach clamps
  // to the brightest band instead of flattening the ramp.
  const dep: number[] = [];
  let dSum = 0;
  for (let i = 0; i < b.n; i++) {
    const x = world(b, f, i, h), y = -world(b, f, i, 1), dd = world(b, f, i, d);
    px.push(x); py.push(y); dep.push(dd); dSum += dd;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  if (b.dw) {
    const w = (d === 0 ? b.dw.x : b.dw.z), span = Math.max(1e-6, (w[1] - w[0]) * 2.2), mean = dSum / b.n;
    for (let i = 0; i < b.n; i++) pd.push(Math.max(0, Math.min(1, 0.5 + (dep[i] - mean) / span)));
  } else {
    for (let i = 0; i < b.n; i++) pd.push(Math.max(0, Math.min(1, (dep[i] - b.qbb[d]) / ((b.qbb[d + 3] - b.qbb[d]) || 1))));
  }
  return { px, py, pd, minX, maxX, minY, maxY };
}

function unionBox(b: Bake, proj: Proj) {
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (let f = 0; f < b.F; f++) {
    const nd = frameNodes(b, f, proj);
    minX = Math.min(minX, nd.minX); maxX = Math.max(maxX, nd.maxX);
    minY = Math.min(minY, nd.minY); maxY = Math.max(maxY, nd.maxY);
  }
  return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY };
}

/* Widest frame of the run = full extension. */
function maxStrideFrame(b: Bake): number {
  let frame = 0, best = -1;
  for (let f = 0; f < b.F; f++) {
    const nd = frameNodes(b, f, 'side');
    if (nd.maxX - nd.minX > best) { best = nd.maxX - nd.minX; frame = f; }
  }
  return frame;
}
export const STRIDE = maxStrideFrame(BAKES.runner);

/* translucent depth-shaded face fills: the hero's volume device */
const FILL_BANDS: [number, number, number][] = [[0.12, 0.45, 0.035], [0.45, 0.7, 0.06], [0.7, 1.01, 0.095]];
function figFills(b: Bake, nd: Nodes, alpha: number): string {
  if (!b.fc || !b.fr) return '';
  let out = '';
  for (const [lo, hi, al] of FILL_BANDS) {
    let d = '';
    for (let i = 0; i < b.fr.length; i++) {
      const a = b.fc[i * 3], c = b.fc[i * 3 + 1], e = b.fc[i * 3 + 2];
      const pdAvg = (nd.pd[a] + nd.pd[c] + nd.pd[e]) / 3;
      if (pdAvg < lo || pdAvg >= hi) continue;
      const m = Math.max(
        Math.hypot(nd.px[a] - nd.px[c], nd.py[a] - nd.py[c]),
        Math.hypot(nd.px[c] - nd.px[e], nd.py[c] - nd.py[e]),
        Math.hypot(nd.px[a] - nd.px[e], nd.py[a] - nd.py[e]));
      if (m > b.fr[i] * 2.2) continue;                       // stretch-cull at reposed joints
      d += `M${nd.px[a].toFixed(1)} ${nd.py[a].toFixed(1)}L${nd.px[c].toFixed(1)} ${nd.py[c].toFixed(1)}L${nd.px[e].toFixed(1)} ${nd.py[e].toFixed(1)}Z`;
    }
    if (d) out += `<path d="${d}" fill="rgba(2,171,191,${(al * alpha).toFixed(3)})" stroke="none"/>`;
  }
  return out;
}

function figParts(b: Bake, f: number, proj: Proj, alpha: number, dots: boolean, scaleRef: number): string {
  const nd = frameNodes(b, f, proj);
  const keep = proj === 'front' ? 0.74 : 0.6;        // the front view has less limb overlap; keep more of the mesh
  const tiers: string[][] = [[], [], [], [], []];
  for (let e = 0; e < b.ea.length; e++) {
    if ((e * 0.618034) % 1 >= keep) continue;
    const a = b.ea[e], c = b.eb[e];
    if (Math.hypot(nd.px[a] - nd.px[c], nd.py[a] - nd.py[c]) > b.er[e] * 2) continue;
    tiers[Math.min(4, Math.floor(((nd.pd[a] + nd.pd[c]) / 2) * 5))].push(
      `M${nd.px[a].toFixed(1)} ${nd.py[a].toFixed(1)}L${nd.px[c].toFixed(1)} ${nd.py[c].toFixed(1)}`);
  }
  let out = figFills(b, nd, alpha);
  out += tiers.map((dd, i) => dd.length
    ? `<path d="${dd.join('')}" fill="none" stroke="#02abbf" stroke-opacity="${((0.28 + 0.5 * ((i + 0.5) / 5)) * alpha).toFixed(2)}" stroke-width="1" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`
    : '').join('');
  if (dots) for (let i = 0; i < b.n; i++) {
    if (hsh(i) < 0.05 && nd.pd[i] > 0.45)
      out += `<circle cx="${nd.px[i].toFixed(1)}" cy="${nd.py[i].toFixed(1)}" r="${(scaleRef * 0.014).toFixed(2)}" fill="#06c2d6" fill-opacity="${((0.5 + 0.5 * nd.pd[i]) * alpha).toFixed(2)}"/>`;
  }
  return out;
}

/* The lab bench scene for the research figure, placed from the bake's
   skeleton anchors (world units; side view: screen x = world z, y = -world y).
   Same wireframe grammar as everything else: hairlines, one teal. */
function studyProps(b: Bake): { body: string; minX: number; maxX: number; minY: number } {
  const A = b.anchors!;
  const fy = b.qbb[1];                                // world floor = min y over the clip
  const P = (z: number, y: number) => `${z.toFixed(1)} ${(-y).toFixed(1)}`;
  const L = (z1: number, y1: number, z2: number, y2: number, op = 0.5, w = 1) =>
    `<path d="M${P(z1, y1)}L${P(z2, y2)}" stroke="#02abbf" stroke-opacity="${op}" stroke-width="${w}" fill="none" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`;
  const headZ = A.head[2], headY = A.head[1];
  const handRZ = A.handR[2], handRY = A.handR[1];
  const benchY = Math.min(A.handL[1], A.handR[1]) - 10;  // hand BONES sit ~9 units above the CURLED FINGERTIPS (measured); the write beat's pen-hand just kisses the surface
  const b0 = headZ - 1, b1 = headZ + 86;
  let out = '';
  out += L(b0, benchY, b1, benchY, 0.55, 1.1);                          // bench top, with thickness
  out += L(b0 + 1, benchY - 2.2, b1, benchY - 2.2, 0.32, 0.9);
  out += L(b0 + 5, benchY, b0 + 5, fy, 0.4) + L(b1 - 6, benchY, b1 - 6, fy, 0.4);   // bench legs (near pair)
  out += L(b0 + 9, benchY - 2.2, b0 + 9, fy, 0.22, 0.8) + L(b1 - 2, benchY - 2.2, b1 - 2, fy, 0.22, 0.8);   // far pair, fainter = depth
  // stool under the pelvis: four-legged, crossbar
  const seatY = A.hips[1] - 12, s0 = A.hips[2] - 13, s1 = A.hips[2] + 9;
  out += L(s0, seatY, s1, seatY, 0.5, 1.1);
  out += L(s0 + 1, seatY - 1.8, s1 - 1, seatY - 1.8, 0.3, 0.9);         // seat thickness
  out += L(s0 + 3, seatY, s0 - 1, fy, 0.4) + L(s1 - 3, seatY, s1 + 1, fy, 0.4);
  out += L(s0 + 6, seatY - 1.8, s0 + 2.5, fy, 0.22, 0.8) + L(s1 - 6, seatY - 1.8, s1 - 2.5, fy, 0.22, 0.8);   // far legs
  const cbU = 0.62;                                   // crossbar between the legs
  out += L(s0 + 3 + (s0 - 1 - (s0 + 3)) * cbU, seatY + (fy - seatY) * cbU, s1 - 3 + (s1 + 1 - (s1 - 3)) * cbU, seatY + (fy - seatY) * cbU, 0.35, 0.9);
  // MICROSCOPE: the iconic compound-scope silhouette, knob under his fingers.
  // Anchored off the right hand: base plate, C-arm (curved), angled eyepiece
  // CYLINDER (two parallel lines + cap), nosepiece with two objectives,
  // stage with a slide, coarse-focus knob, illuminator.
  const P2 = (z: number, y: number) => `${z.toFixed(1)},${(-y).toFixed(1)}`;
  // MICROSCOPE, built DOWN from the face point so the eyepiece meets the brow
  // during the scope phase (head anchor is captured then), every part in fixed
  // proportion: eyepiece cylinder -> nosepiece/objectives -> stage -> C-arm ->
  // base plate on the bench.
  const eZ = headZ + 11, eY = headY - 9;              // the eyepiece/brow contact point (brow of a BOWED head sits low and forward of the head bone)
  const tBotZ = eZ + 12, tBotY = eY - 11;             // 45° tube
  const nx = 1.1, ny = 1.2;                           // ⊥ offset for the cylinder walls
  out += L(tBotZ + nx, tBotY + ny, eZ + nx, eY + ny, 0.7, 1.3);
  out += L(tBotZ - nx, tBotY - ny, eZ - nx, eY - ny, 0.7, 1.3);
  out += L(eZ + nx + 0.6, eY + ny + 0.7, eZ - nx - 0.6, eY - ny - 0.7, 0.75, 1.5);  // eyepiece cap
  // nosepiece + two objectives
  out += L(tBotZ, tBotY, tBotZ + 2, tBotY - 5, 0.65, 1.2);
  out += L(tBotZ + 2, tBotY - 5, tBotZ + 1, tBotY - 10, 0.65, 1.2);
  out += L(tBotZ + 2, tBotY - 5, tBotZ + 5.5, tBotY - 9, 0.55, 1.1);
  // stage under the objectives, tied into the arm
  const stY = tBotY - 14;
  out += L(eZ + 1, stY, eZ + 23, stY, 0.65, 1.2);
  out += L(eZ + 4, stY + 1.5, eZ + 14, stY + 1.5, 0.5, 1);                          // slide
  // C-arm: base rear up to the tube bottom, bowing back
  out += `<path d="M${P2(eZ + 24, benchY + 3)} Q${P2(eZ + 24.5, (benchY + 3 + tBotY) / 2 + 3)} ${P2(tBotZ + 2.5, tBotY + 1)}" fill="none" stroke="#02abbf" stroke-opacity="0.8" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`;
  out += L(eZ + 23, stY, eZ + 26.2, stY, 0.5, 1);                                   // stage->arm tie
  // base plate (doubled line = solid)
  out += L(eZ + 2, benchY + 1, eZ + 28, benchY + 1, 0.78, 1.6);
  out += L(eZ + 3, benchY + 3, eZ + 27, benchY + 3, 0.55, 1.1);
  // coarse-focus knob at his fingertips, axle into the arm plane
  out += `<circle cx="${(handRZ + 2).toFixed(1)}" cy="${(-(handRY + 1)).toFixed(1)}" r="3.4" fill="none" stroke="#02abbf" stroke-opacity="0.72" stroke-width="1.3" vector-effect="non-scaling-stroke"/>`;
  out += `<circle cx="${(handRZ + 2).toFixed(1)}" cy="${(-(handRY + 1)).toFixed(1)}" r="1.3" fill="#02abbf" fill-opacity="0.55"/>`;
  out += L(handRZ + 5, handRY + 1, eZ + 25, handRY + 2.5, 0.45, 0.9);
  // open laptop in profile at the far end of the bench, facing him: analysis
  // waiting for the microscope's numbers (real 13-inch proportions)
  const lpHinge = b1 - 16, lpFront = b1 - 40;
  out += L(lpFront, benchY + 1.4, lpHinge, benchY + 1.4, 0.6, 1.4);                 // base
  out += L(lpFront + 1.5, benchY + 3, lpHinge - 0.8, benchY + 3, 0.32, 0.9);        // base thickness
  out += L(lpHinge, benchY + 1.4, lpHinge + 6.5, benchY + 17, 0.6, 1.4);            // screen, tilted away
  out += L(lpHinge - 1.6, benchY + 1.8, lpHinge + 4.9, benchY + 17.4, 0.4, 1);      // screen thickness
  out += L(lpHinge + 1.9, benchY + 4.6, lpHinge + 5.4, benchY + 14.4, 0.3, 0.9);    // display hint
  // slide box beside the scope base: two slots of prepared specimens
  const sbZ = eZ + 32;
  out += L(sbZ, benchY + 1, sbZ + 8, benchY + 1, 0.45, 1) + L(sbZ, benchY + 5, sbZ + 8, benchY + 5, 0.45, 1);
  out += L(sbZ, benchY + 1, sbZ, benchY + 5, 0.45, 1) + L(sbZ + 8, benchY + 1, sbZ + 8, benchY + 5, 0.45, 1);
  out += L(sbZ + 2.7, benchY + 1, sbZ + 2.7, benchY + 5, 0.3, 0.8) + L(sbZ + 5.4, benchY + 1, sbZ + 5.4, benchY + 5, 0.3, 0.8);
  // notebook where the writing hand comes down
  const nz = A.handRWrite[2];
  out += L(nz - 15, benchY + 1.5, nz + 3, benchY + 1.5, 0.55, 1) + L(nz - 13, benchY + 3.5, nz + 1, benchY + 3.5, 0.4, 0.8);
  // a pen resting beside it, waiting for the write beat
  out += L(nz + 5, benchY + 1.6, nz + 10.5, benchY + 3.2, 0.45, 1.1);
  return { body: out, minX: s0 - 4, maxX: b1 + 2, minY: -(eY + 8) };
}

function baseline(x0: number, x1: number, gy: number): string {
  return `<line x1="${x0.toFixed(1)}" y1="${gy.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${gy.toFixed(1)}" stroke="#02abbf" stroke-opacity="0.35" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
}
function rulerTicks(x0: number, x1: number, gy: number, h: number): string {
  let out = '';
  for (let i = 0; i <= 24; i++) {
    const x = x0 + (x1 - x0) * (i / 24), tall = (i % 5 === 0 ? 0.03 : 0.015) * h;
    out += `<line x1="${x.toFixed(1)}" y1="${gy.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(gy - tall).toFixed(1)}" stroke="#02abbf" stroke-opacity="0.42" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
  }
  return out;
}

type FigOpts = { proj: Proj; ticks?: boolean; tight?: boolean; scene?: boolean; inlineProps?: boolean; anim?: { bake: string; loopMs: number } };
function makeFig(bakeKey: string, frame: number, opts: FigOpts): Fig {
  const b = BAKES[bakeKey];
  const U = opts.tight ? frameNodes(b, frame, opts.proj) : unionBox(b, opts.proj);
  const h = U.maxY - U.minY, pad = h * 0.05;
  const gy = U.maxY + h * 0.006;
  let x0 = U.minX - pad, x1 = U.maxX + pad, yTop = U.minY - pad;
  let props: string | undefined;
  if (opts.scene) {                                  // the lab bench extends the box
    const p = studyProps(b);
    x0 = Math.min(x0, p.minX); x1 = Math.max(x1, p.maxX); yTop = Math.min(yTop, p.minY);
    props = p.body;
  }
  let body = baseline(x0, x1, gy);
  if (opts.ticks) body += rulerTicks(x0, x1, gy, h);
  body += figParts(b, frame, opts.proj, 1, true, h);
  if (props && opts.inlineProps) { body = props + body; props = undefined; }   // wings: everything in one svg
  const anim: Record<string, string> = {};
  if (opts.anim) {
    anim['data-bake'] = `/${opts.anim.bake}`;
    anim['data-proj'] = opts.proj;
    anim['data-loop'] = String(opts.anim.loopMs);
    anim['data-gy'] = gy.toFixed(2);       // baseline in viewBox units, so the canvas redraw matches the SVG exactly
    anim['data-fh'] = h.toFixed(2);        // figure height in viewBox units (dot sizing)
    if (opts.ticks) anim['data-ticks'] = '1';
  }
  return {
    viewBox: `${x0.toFixed(1)} ${yTop.toFixed(1)} ${(x1 - x0).toFixed(1)} ${(gy - yTop + h * 0.012).toFixed(1)}`,
    body,
    anim,
    props,
  };
}

export function consultFigures(): Record<string, Fig> {
  return {
    research: makeFig('study', 0, { proj: 'side', scene: true, anim: { bake: 'study-bake.json', loopMs: Math.round(BAKES.study.dur * 1000) } }),
    performance: makeFig('runner', STRIDE, { proj: 'side', anim: { bake: 'runner-bake.json', loopMs: Math.round((BAKES.runner.dur / (BAKES.runner.ts ?? 0.5)) * 1000) } }),
    lectures: makeFig('lecture', 97, { proj: 'front', anim: { bake: 'lecture-bake.json', loopMs: Math.round(BAKES.lecture.dur * 1000) } }),
  };
}

/* Small waiting figures: static, everything in one svg. */
export function consultWings(): Record<string, Fig> {
  return {
    research: makeFig('study', 0, { proj: 'side', scene: true, inlineProps: true }),
    performance: makeFig('runner', STRIDE, { proj: 'side', tight: true }),
    lectures: makeFig('lecture', 97, { proj: 'front', tight: true }),
  };
}
