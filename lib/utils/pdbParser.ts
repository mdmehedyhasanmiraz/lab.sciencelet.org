import { PROCHECK_REGIONS, isPointInPolygon } from "./ramachandranContours";

export interface AtomCoord {
  x: number;
  y: number;
  z: number;
}

export interface ResidueBackbone {
  resSeq: number;
  resName: string;
  chainID: string;
  insertionCode: string;
  N?: AtomCoord;
  CA?: AtomCoord;
  C?: AtomCoord;
  O?: AtomCoord;
}

export type RamachandranRegion = "core" | "allowed" | "generous" | "outlier";

export interface RamachandranResidue {
  resSeq: number;
  resName: string;
  chainID: string;
  phi: number | null; // degrees [-180, 180]
  psi: number | null; // degrees [-180, 180]
  omega: number | null; // degrees [-180, 180]
  region: RamachandranRegion;
  isGlycine: boolean;
  isProline: boolean;
  isPreProline: boolean;
}

export interface StructureAssessment {
  title: string;
  numChains: number;
  chains: string[];
  totalResidues: number;
  analyzedResidues: number;
  residues: RamachandranResidue[];
  stats: {
    favoredCount: number;
    favoredPercent: number;
    allowedCount: number;
    allowedPercent: number;
    generousCount: number;
    generousPercent: number;
    outlierCount: number;
    outlierPercent: number;
    glycineCount: number;
    prolineCount: number;
  };
}

// Vector math utilities
function sub(a: AtomCoord, b: AtomCoord): AtomCoord {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a: AtomCoord, b: AtomCoord): AtomCoord {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function dot(a: AtomCoord, b: AtomCoord): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function norm(a: AtomCoord): number {
  return Math.sqrt(dot(a, a));
}

/**
 * Calculates dihedral angle in degrees between four atoms: p1 - p2 - p3 - p4
 * Returns value in range [-180, 180]
 */
export function calculateDihedral(
  p1: AtomCoord,
  p2: AtomCoord,
  p3: AtomCoord,
  p4: AtomCoord
): number {
  const b1 = sub(p2, p1);
  const b2 = sub(p3, p2);
  const b3 = sub(p4, p3);

  // Normal vectors to the two intersecting planes
  const n1 = cross(b1, b2);
  const n2 = cross(b2, b3);

  const b2Norm = norm(b2);
  if (b2Norm === 0) return 0;

  const b2Unit: AtomCoord = {
    x: b2.x / b2Norm,
    y: b2.y / b2Norm,
    z: b2.z / b2Norm
  };

  // IUPAC-IUB standard signed dihedral angle:
  // x = (n1 · n2)
  // y = (n1 × n2) · b2_unit
  const x = dot(n1, n2);
  const y = dot(cross(n1, n2), b2Unit);

  const angleRad = Math.atan2(y, x);
  return (angleRad * 180) / Math.PI;
}

/**
 * Standard PROCHECK / Lovell et al. 2003 Ramachandran region classifier
 */
export function classifyRamachandran(
  phi: number,
  psi: number,
  resName: string,
  isPrePro: boolean
): RamachandranRegion {
  const rName = resName.toUpperCase();

  // Glycine has flexible conformational space
  if (rName === "GLY") {
    if (
      (phi >= -180 && phi <= -30 && psi >= -180 && psi <= 180) ||
      (phi >= 30 && phi <= 180 && psi >= -180 && psi <= 180)
    ) {
      if (
        (phi >= -120 && phi <= -40 && psi >= -90 && psi <= 60) ||
        (phi >= 40 && phi <= 120 && psi >= -60 && psi <= 90) ||
        (phi >= -150 && phi <= -60 && psi >= 110 && psi <= 180) ||
        (phi >= 60 && phi <= 150 && psi >= -180 && psi <= -110)
      ) {
        return "core";
      }
      return "allowed";
    }
    return "outlier";
  }

  // Proline is restricted around phi ~ -65 deg
  if (rName === "PRO") {
    if (phi >= -90 && phi <= -40) {
      if (
        (psi >= -60 && psi <= 0) ||
        (psi >= 100 && psi <= 170)
      ) {
        return "core";
      }
      if (psi >= -80 && psi <= 180) {
        return "allowed";
      }
    }
    if (phi >= -120 && phi <= -30 && psi >= -100 && psi <= 180) {
      return "allowed";
    }
    return "outlier";
  }

  // Pre-proline general check
  if (isPrePro) {
    if (
      (phi >= -140 && phi <= -60 && psi >= 110 && psi <= 170) ||
      (phi >= -80 && phi <= -45 && psi >= -60 && psi <= -15)
    ) {
      return "core";
    }
    if (phi >= -160 && phi <= -40 && psi >= -80 && psi <= 180) {
      return "allowed";
    }
    return "outlier";
  }

  // General Case: Polygon-based classification against authentic PROCHECK contours
  const pt: [number, number] = [phi, psi];

  // 1. Check if inside any Core / Most Favoured polygon (A, B, L)
  for (const c of PROCHECK_REGIONS) {
    if (c.category === "core" && isPointInPolygon(pt, c.points)) {
      return "core";
    }
  }

  // 2. Check if inside any Additional Allowed polygon (a, b, l, p)
  for (const c of PROCHECK_REGIONS) {
    if (c.category === "allowed" && isPointInPolygon(pt, c.points)) {
      return "allowed";
    }
  }

  // 3. Check if inside any Generously Allowed polygon (~a, ~b, ~l, ~p)
  for (const c of PROCHECK_REGIONS) {
    if (c.category === "generous" && isPointInPolygon(pt, c.points)) {
      return "generous";
    }
  }

  return "outlier";
}

/**
 * Parses raw PDB text and extracts all backbone residues with dihedral coordinates
 */
export function parsePDBAndCalculateRamachandran(pdbText: string): StructureAssessment {
  const lines = pdbText.split(/\r?\n/);
  let title = "Uploaded Protein Structure";

  // Map of `${chainID}_${resSeq}_${insertionCode}` to residue data
  const residueMap = new Map<string, ResidueBackbone>();
  const residueOrder: string[] = [];
  const chainSet = new Set<string>();

  for (const line of lines) {
    if (line.startsWith("TITLE ")) {
      const lineTitle = line.substring(10).trim();
      if (lineTitle && title === "Uploaded Protein Structure") {
        title = lineTitle;
      }
    }

    if (line.startsWith("ATOM  ")) {
      const atomName = line.substring(12, 16).trim();
      if (!["N", "CA", "C", "O"].includes(atomName)) {
        continue;
      }

      const resName = line.substring(17, 20).trim();
      const chainID = line.substring(21, 22).trim() || "A";
      const resSeq = parseInt(line.substring(22, 26).trim(), 10);
      const insertionCode = line.substring(26, 27).trim();

      const x = parseFloat(line.substring(30, 38).trim());
      const y = parseFloat(line.substring(38, 46).trim());
      const z = parseFloat(line.substring(46, 54).trim());

      if (isNaN(x) || isNaN(y) || isNaN(z)) continue;

      const coord: AtomCoord = { x, y, z };
      const key = `${chainID}_${resSeq}_${insertionCode}`;

      chainSet.add(chainID);

      if (!residueMap.has(key)) {
        residueMap.set(key, {
          resSeq,
          resName,
          chainID,
          insertionCode
        });
        residueOrder.push(key);
      }

      const res = residueMap.get(key)!;
      if (atomName === "N") res.N = coord;
      else if (atomName === "CA") res.CA = coord;
      else if (atomName === "C") res.C = coord;
      else if (atomName === "O") res.O = coord;
    }
  }

  // Calculate phi (C_{i-1} - N_i - CA_i - C_i) and psi (N_i - CA_i - C_i - N_{i+1})
  const results: RamachandranResidue[] = [];
  let favoredCount = 0;
  let allowedCount = 0;
  let generousCount = 0;
  let outlierCount = 0;
  let glycineCount = 0;
  let prolineCount = 0;

  for (let i = 0; i < residueOrder.length; i++) {
    const key = residueOrder[i];
    const current = residueMap.get(key)!;

    const prev = i > 0 ? residueMap.get(residueOrder[i - 1]) : undefined;
    const next = i < residueOrder.length - 1 ? residueMap.get(residueOrder[i + 1]) : undefined;

    const isSameChainPrev = prev && prev.chainID === current.chainID && Math.abs(current.resSeq - prev.resSeq) <= 2;
    const isSameChainNext = next && next.chainID === current.chainID && Math.abs(next.resSeq - current.resSeq) <= 2;

    const isGly = current.resName.toUpperCase() === "GLY";
    const isPro = current.resName.toUpperCase() === "PRO";
    const isPrePro = Boolean(next && next.resName.toUpperCase() === "PRO" && isSameChainNext);

    if (isGly) glycineCount++;
    if (isPro) prolineCount++;

    let phi: number | null = null;
    let psi: number | null = null;
    let omega: number | null = null;

    // Phi requires C(i-1), N(i), CA(i), C(i)
    if (isSameChainPrev && prev?.C && current.N && current.CA && current.C) {
      phi = calculateDihedral(prev.C, current.N, current.CA, current.C);
    }

    // Psi requires N(i), CA(i), C(i), N(i+1)
    if (isSameChainNext && current.N && current.CA && current.C && next?.N) {
      psi = calculateDihedral(current.N, current.CA, current.C, next.N);
    }

    // Omega requires CA(i-1), C(i-1), N(i), CA(i)
    if (isSameChainPrev && prev?.CA && prev?.C && current.N && current.CA) {
      omega = calculateDihedral(prev.CA, prev.C, current.N, current.CA);
    }

    // Only residues with both valid phi and psi are plotted
    let region: RamachandranRegion = "outlier";
    if (phi !== null && psi !== null) {
      region = classifyRamachandran(phi, psi, current.resName, isPrePro);

      if (region === "core") favoredCount++;
      else if (region === "allowed") allowedCount++;
      else if (region === "generous") generousCount++;
      else outlierCount++;

      results.push({
        resSeq: current.resSeq,
        resName: current.resName,
        chainID: current.chainID,
        phi: parseFloat(phi.toFixed(2)),
        psi: parseFloat(psi.toFixed(2)),
        omega: omega !== null ? parseFloat(omega.toFixed(2)) : null,
        region,
        isGlycine: isGly,
        isProline: isPro,
        isPreProline: isPrePro
      });
    }
  }

  const analyzed = results.length;
  const favoredPercent = analyzed > 0 ? (favoredCount / analyzed) * 100 : 0;
  const allowedPercent = analyzed > 0 ? (allowedCount / analyzed) * 100 : 0;
  const generousPercent = analyzed > 0 ? (generousCount / analyzed) * 100 : 0;
  const outlierPercent = analyzed > 0 ? (outlierCount / analyzed) * 100 : 0;

  return {
    title,
    numChains: chainSet.size,
    chains: Array.from(chainSet),
    totalResidues: residueOrder.length,
    analyzedResidues: analyzed,
    residues: results,
    stats: {
      favoredCount,
      favoredPercent: parseFloat(favoredPercent.toFixed(2)),
      allowedCount,
      allowedPercent: parseFloat(allowedPercent.toFixed(2)),
      generousCount,
      generousPercent: parseFloat(generousPercent.toFixed(2)),
      outlierCount,
      outlierPercent: parseFloat(outlierPercent.toFixed(2)),
      glycineCount,
      prolineCount
    }
  };
}
