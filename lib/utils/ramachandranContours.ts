/**
 * Smooth PROCHECK Ramachandran Energy Contours
 * Beautiful, natural, high-resolution organic curves matching PROCHECK reference lobes.
 * Formatted as smooth polygons that render naturally as SVG paths or polygons with clean borders.
 */

export interface ProcheckContour {
  code: "A" | "B" | "L" | "a" | "b" | "l" | "p" | "~a" | "~b" | "~l" | "~p";
  label: string;
  category: "core" | "allowed" | "generous";
  // [phi, psi] coordinates in degrees [-180, 180]
  points: [number, number][];
  labelPos?: [number, number]; // [phi, psi] for label positioning
}

/**
 * Generate Catmull-Rom or cubic spline smoothed polygon points
 */
function smoothPolygon(inputPoints: [number, number][], isClosed: boolean = true, subdivisions: number = 4): [number, number][] {
  if (inputPoints.length < 3) return inputPoints;

  // Sanitize points: remove duplicate adjacent points and duplicate closing endpoints
  // which cause 0-length tangent vectors, producing unnatural loops/kinks in Catmull-Rom splines
  const clean: [number, number][] = [];
  for (let i = 0; i < inputPoints.length; i++) {
    const p = inputPoints[i];
    const prev = clean[clean.length - 1];
    if (!prev || Math.hypot(p[0] - prev[0], p[1] - prev[1]) > 0.001) {
      clean.push(p);
    }
  }

  if (
    isClosed &&
    clean.length > 2 &&
    Math.hypot(clean[0][0] - clean[clean.length - 1][0], clean[0][1] - clean[clean.length - 1][1]) < 0.001
  ) {
    clean.pop();
  }

  const pts: [number, number][] = clean;
  const n = pts.length;
  if (n < 3) return inputPoints;

  const result: [number, number][] = [];

  for (let i = 0; i < n; i++) {
    const p0 = isClosed ? pts[(i - 1 + n) % n] : pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = isClosed ? pts[(i + 1) % n] : pts[Math.min(n - 1, i + 1)];
    const p3 = isClosed ? pts[(i + 2) % n] : pts[Math.min(n - 1, i + 2)];

    for (let s = 0; s < subdivisions; s++) {
      const t = s / subdivisions;
      const t2 = t * t;
      const t3 = t2 * t;

      // Catmull-Rom spline formula:
      // 0.5 * ((2*P1) + (-P0 + P2)*t + (2*P0 - 5*P1 + 4*P2 - P3)*t^2 + (-P0 + 3*P1 - 3*P2 + P3)*t^3)
      const x =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);

      const y =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);

      result.push([Number(x.toFixed(2)), Number(y.toFixed(2))]);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// 1. GENEROUS REGIONS (~a, ~b, ~l, ~p)
// ---------------------------------------------------------------------------

// Smooth large envelope covering entire left and lower/upper allowed corridor
const rawGenerousLeft: [number, number][] = [
  [-180, 180],
  [-12, 180],
  [-5, 170],
  [5, 155],
  [8, 138],
  [0, 115],
  [-12, 95],
  [-16, 75],
  [-8, 55],
  [6, 40],
  [12, 18],
  [14, -15],
  [12, -45],
  [12, -75],
  [8, -95],
  [-6, -112],
  [-24, -122],
  [-46, -125],
  [-52, -145],
  [-52, -180],
  [-180, -180],
  [-180, 180]
];

// Generous top right strip (~b near phi=50..180, psi=180)
const rawGenerousTopRight: [number, number][] = [
  [30, 180],
  [75, 180],
  [75, 168],
  [30, 168],
  [30, 180]
];

// Generous ~l lobe (Upper right)
const rawGenerousL: [number, number][] = [
  [16, 122],
  [36, 128],
  [65, 130],
  [82, 126],
  [95, 115],
  [95, 78],
  [105, 55],
  [105, 12],
  [102, -15],
  [90, -28],
  [65, -30],
  [45, -28],
  [32, -18],
  [25, 2],
  [22, 28],
  [16, 62],
  [16, 95],
  [16, 122]
];

// Generous ~p lobe (Lower right)
const rawGenerousP: [number, number][] = [
  [30, -118],
  [58, -118],
  [82, -120],
  [92, -132],
  [92, -180],
  [30, -180],
  [30, -118]
];

// Generous ~b lobe (Right side near 180, -160 to 180)
const rawGenerousRightBorder: [number, number][] = [
  [132, 180],
  [180, 180],
  [180, 68],
  [150, 68],
  [138, 92],
  [140, 125],
  [130, 150],
  [132, 180]
];

const rawGenerousRightBottom: [number, number][] = [
  [150, -155],
  [180, -155],
  [180, -180],
  [150, -180],
  [150, -155]
];

// ---------------------------------------------------------------------------
// 2. ADDITIONAL ALLOWED REGIONS (a, b, l, p)
// ---------------------------------------------------------------------------

// Allowed b: Upper Left Beta sheet region
const rawAllowedB: [number, number][] = [
  [-180, 180],
  [-30, 180],
  [-22, 168],
  [-14, 150],
  [-10, 130],
  [-14, 105],
  [-26, 92],
  [-48, 86],
  [-74, 75],
  [-115, 72],
  [-150, 78],
  [-180, 85],
  [-180, 180]
];

// Allowed a: Lower Left Alpha-helix region
const rawAllowedA: [number, number][] = [
  [-180, 62],
  [-152, 60],
  [-120, 52],
  [-88, 38],
  [-58, 26],
  [-28, 14],
  [-8, -2],
  [-8, -48],
  [-16, -72],
  [-38, -92],
  [-72, -98],
  [-115, -94],
  [-145, -75],
  [-165, -50],
  [-180, -18],
  [-180, 62]
];

// Allowed b lower wrap-around:
const rawAllowedBLower: [number, number][] = [
  [-180, -118],
  [-148, -118],
  [-120, -128],
  [-88, -128],
  [-60, -148],
  [-38, -165],
  [-38, -180],
  [-180, -180],
  [-180, -118]
];

// Allowed l (Upper right):
const rawAllowedL: [number, number][] = [
  [32, 98],
  [58, 102],
  [78, 98],
  [88, 76],
  [88, 30],
  [78, 12],
  [72, -10],
  [48, -10],
  [42, 12],
  [48, 32],
  [35, 48],
  [32, 98]
];

// Allowed p (Lower right):
const rawAllowedP: [number, number][] = [
  [46, -140],
  [75, -140],
  [75, -180],
  [46, -180],
  [46, -140]
];

// Allowed b upper right corner:
const rawAllowedBTopRight: [number, number][] = [
  [145, 180],
  [180, 180],
  [180, 85],
  [156, 85],
  [156, 128],
  [145, 148],
  [138, 165],
  [145, 180]
];

// ---------------------------------------------------------------------------
// 3. CORE / MOST FAVOURED REGIONS (A, B, L)
// ---------------------------------------------------------------------------

// Core A: Alpha-helix core (Smooth, organic oval lobe in lower-left)
const rawCoreA: [number, number][] = [
  [-106, 26],
  [-92, 28],
  [-74, 18],
  [-52, 10],
  [-36, -5],
  [-32, -26],
  [-36, -45],
  [-45, -60],
  [-62, -68],
  [-80, -62],
  [-92, -48],
  [-102, -24],
  [-110, 2],
  [-114, 18],
  [-106, 26]
];

// Core B: Beta-sheet core (Smooth curved lobe in upper-left)
const rawCoreB: [number, number][] = [
  [-180, 180],
  [-44, 180],
  [-34, 162],
  [-24, 142],
  [-30, 125],
  [-50, 114],
  [-75, 108],
  [-98, 92],
  [-125, 92],
  [-148, 108],
  [-165, 126],
  [-180, 140],
  [-180, 180]
];

// Core L: Left-handed alpha-helix core (Upper Right smooth curved lobe)
const rawCoreL: [number, number][] = [
  [46, 52],
  [68, 52],
  [74, 40],
  [72, 26],
  [58, 24],
  [48, 32],
  [46, 52]
];

export const PROCHECK_REGIONS: ProcheckContour[] = [
  // =========================================================================
  // 1. GENEROUSLY ALLOWED ENVELOPES (Pale Yellow / Tan)
  // =========================================================================
  {
    code: "~a",
    label: "~a",
    category: "generous",
    labelPos: [-22, -10],
    points: smoothPolygon(rawGenerousLeft, true, 4)
  },
  {
    code: "~l",
    label: "~l",
    category: "generous",
    labelPos: [52, 110],
    points: smoothPolygon(rawGenerousL, true, 4)
  },
  {
    code: "~p",
    label: "~p",
    category: "generous",
    labelPos: [45, -135],
    points: smoothPolygon(rawGenerousP, true, 4)
  },
  {
    code: "~b",
    label: "~b",
    category: "generous",
    labelPos: [155, 148],
    points: smoothPolygon(rawGenerousRightBorder, true, 4)
  },
  {
    code: "~b",
    label: "~b",
    category: "generous",
    labelPos: [50, 174],
    points: smoothPolygon(rawGenerousTopRight, true, 2)
  },
  {
    code: "~b",
    label: "~b",
    category: "generous",
    labelPos: [165, -168],
    points: smoothPolygon(rawGenerousRightBottom, true, 2)
  },

  // =========================================================================
  // 2. ADDITIONAL ALLOWED REGIONS (Bright Yellow)
  // =========================================================================
  {
    code: "b",
    label: "b",
    category: "allowed",
    labelPos: [-158, 125],
    points: smoothPolygon(rawAllowedB, true, 4)
  },
  {
    code: "a",
    label: "a",
    category: "allowed",
    labelPos: [-145, 35],
    points: smoothPolygon(rawAllowedA, true, 4)
  },
  {
    code: "b",
    label: "b",
    category: "allowed",
    labelPos: [-155, -155],
    points: smoothPolygon(rawAllowedBLower, true, 4)
  },
  {
    code: "l",
    label: "l",
    category: "allowed",
    labelPos: [42, 80],
    points: smoothPolygon(rawAllowedL, true, 4)
  },
  {
    code: "p",
    label: "p",
    category: "allowed",
    labelPos: [56, -155],
    points: smoothPolygon(rawAllowedP, true, 4)
  },
  {
    code: "b",
    label: "b",
    category: "allowed",
    labelPos: [162, 160],
    points: smoothPolygon(rawAllowedBTopRight, true, 4)
  },

  // =========================================================================
  // 3. CORE / MOST FAVOURED REGIONS (Red)
  // =========================================================================
  {
    code: "A",
    label: "A",
    category: "core",
    labelPos: [-88, 12],
    points: smoothPolygon(rawCoreA, true, 4)
  },
  {
    code: "B",
    label: "B",
    category: "core",
    labelPos: [-150, 168],
    points: smoothPolygon(rawCoreB, true, 4)
  },
  {
    code: "L",
    label: "L",
    category: "core",
    labelPos: [58, 42],
    points: smoothPolygon(rawCoreL, true, 4)
  }
];

/**
 * Standard ray-casting test to determine if [phi, psi] is within any polygon
 */
export function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [px, py] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}
