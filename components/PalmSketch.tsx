/**
 * Decorative palm-tree line sketch (vintage etching feel) pinned to the
 * bottom right, blended into the paper background. Pure inline SVG - no
 * image request - and the geometry is generated from fixed seeds so the
 * server and client render identical markup.
 */

import { cn } from "@/lib/utils";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = [number, number];

const n = (v: number) => Math.round(v * 10) / 10;

const qPoint = (t: number, p0: Pt, c: Pt, p1: Pt): Pt => {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
    u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
  ];
};

const qTangent = (t: number, p0: Pt, c: Pt, p1: Pt): Pt => {
  const u = 1 - t;
  return [2 * u * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]), 2 * u * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1])];
};

const cPoint = (t: number, p0: Pt, c1: Pt, c2: Pt, p1: Pt): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * c1[0] + c * c2[0] + d * p1[0],
    a * p0[1] + b * c1[1] + c * c2[1] + d * p1[1],
  ];
};

const cTangent = (t: number, p0: Pt, c1: Pt, c2: Pt, p1: Pt): Pt => {
  const u = 1 - t;
  const a = 3 * u * u;
  const b = 6 * u * t;
  const c = 3 * t * t;
  return [
    a * (c1[0] - p0[0]) + b * (c2[0] - c1[0]) + c * (p1[0] - c2[0]),
    a * (c1[1] - p0[1]) + b * (c2[1] - c1[1]) + c * (p1[1] - c2[1]),
  ];
};

/** One drooping frond: arching rib plus leaflets swept towards the tip. */
function frond(top: Pt, angleDeg: number, length: number, rand: () => number): string {
  const a = (angleDeg * Math.PI) / 180;
  const droop = length * (angleDeg < -60 && angleDeg > -120 ? 0.14 : 0.34);
  const p1: Pt = [top[0] + Math.cos(a) * length, top[1] + Math.sin(a) * length + droop];
  const c: Pt = [top[0] + Math.cos(a) * length * 0.55, top[1] + Math.sin(a) * length * 0.55 - length * 0.26];

  let d = `M ${n(top[0])} ${n(top[1])} Q ${n(c[0])} ${n(c[1])} ${n(p1[0])} ${n(p1[1])}`;

  const steps = 4 + Math.floor(rand() * 2);
  for (let i = 1; i <= steps; i++) {
    const t = 0.16 + (i / (steps + 1)) * 0.78;
    const p = qPoint(t, top, c, p1);
    const tan = qTangent(t, top, c, p1);
    const mag = Math.hypot(tan[0], tan[1]) || 1;
    const tx = tan[0] / mag;
    const ty = tan[1] / mag;
    const px = -ty;
    const py = tx;
    const size = Math.sin(Math.PI * t) * length * (0.17 + rand() * 0.05);

    for (const side of [1, -1]) {
      // Leaflets fan forward along the rib, not straight out.
      const dx = px * side * 0.72 + tx * 0.7;
      const dy = py * side * 0.72 + ty * 0.7;
      const dm = Math.hypot(dx, dy) || 1;
      d += ` M ${n(p[0])} ${n(p[1])} L ${n(p[0] + (dx / dm) * size)} ${n(p[1] + (dy / dm) * size)}`;
    }
  }
  return d;
}

/** Trunk as a gentle curve plus the ring hatch marks of an etching. */
function trunk(base: Pt, top: Pt, lean: number, rand: () => number): string[] {
  const c1: Pt = [base[0] + lean * 0.15, base[1] - (base[1] - top[1]) * 0.4];
  const c2: Pt = [base[0] + lean * 0.8, base[1] - (base[1] - top[1]) * 0.75];

  const outline = `M ${n(base[0])} ${n(base[1])} C ${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(top[0])} ${n(top[1])}`;
  const rings: string[] = [outline];

  // A few sparse ring marks low on the trunk - minimal shading, architectural feel.
  const count = 6;
  for (let i = 1; i < count; i++) {
    const t = i / count;
    if (t > 0.62) continue;
    const p = cPoint(t, base, c1, c2, top);
    const tan = cTangent(t, base, c1, c2, top);
    const mag = Math.hypot(tan[0], tan[1]) || 1;
    const half = (1 - t) * 3 + 1.2;
    const px = (-tan[1] / mag) * half;
    const py = (tan[0] / mag) * half;
    const skew = (rand() - 0.5) * 1.4;
    rings.push(
      `M ${n(p[0] - px + skew)} ${n(p[1] - py)} L ${n(p[0] + px + skew)} ${n(p[1] + py)}`,
    );
  }
  return rings;
}

type Palm = { x: number; h: number; lean: number; fronds: number; seed: number };

const BASE_Y = 412;

const PALMS: Palm[] = [
  { x: 172, h: 206, lean: -14, fronds: 6, seed: 7 },
  { x: 216, h: 302, lean: -7, fronds: 7, seed: 21 },
  { x: 258, h: 356, lean: 4, fronds: 8, seed: 42 },
  { x: 302, h: 266, lean: 11, fronds: 7, seed: 99 },
  { x: 344, h: 324, lean: 17, fronds: 7, seed: 5 },
  { x: 388, h: 222, lean: -11, fronds: 6, seed: 13 },
];

/** Every path in the sketch, flattened once at module load. */
const PATHS: string[] = (() => {
  const out: string[] = [];

  for (const p of PALMS) {
    const rand = rng(p.seed);
    const base: Pt = [p.x, BASE_Y];
    const top: Pt = [p.x + p.lean, BASE_Y - p.h];
    out.push(...trunk(base, top, p.lean, rand));

    const count = p.fronds;
    for (let i = 0; i < count; i++) {
      const angle = -172 + (i * 156) / (count - 1) + (rand() - 0.5) * 9;
      const length = p.h * (0.36 + rand() * 0.13);
      out.push(frond(top, angle, length, rand));
    }
  }

  // Sparse ground hatch so the cluster sits on something.
  const rand = rng(1234);
  for (let i = 0; i < 11; i++) {
    const x = 140 + rand() * 290;
    const y = BASE_Y + 4 + rand() * 8;
    const w = 6 + rand() * 26;
    out.push(`M ${n(x)} ${n(y)} L ${n(x + w)} ${n(y)}`);
  }

  return out;
})();

export default function PalmSketch({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none select-none", className)}>
      <svg
        viewBox="40 -100 470 545"
        className="h-auto w-full"
        fill="none"
        stroke="#6f8a63"
        strokeWidth={1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </div>
  );
}
