import { DIWV } from "@/lib/utils/instabilityIndexData";
import { getNEndRuleHalfLife, HalfLifeData } from "@/lib/utils/nEndRuleData";

export interface ProteinProperties {
  sequenceLength: number;

  molecularWeight: number; // g/mol (average MW)
  molecularFormula: string; // e.g., "C₁₀H₁₅N₃O₂S₁"
  gravy: number;
  pI: number;

  // Composition
  aminoAcidCount: Record<string, number>;
  atomCount: Record<string, number>;

  // Charge-related (sequence-derived, pH-dependent)
  netChargePH74: number;
  chargeDensityPH74: number; // netChargePH74 / length
  chargeCurve: Array<{ pH: number; charge: number }>;

  // Other common descriptors
  aromaticity: number; // fraction of (F+W+Y)
  aliphaticIndex: number; // Ikai (1980) relative volume of aliphatic side chains
  hydrophobicResidueFraction: number;
  hydrophobicMomentHelixMax: number; // max windowed (alpha-helix, 100° per residue)
  hydropathyWindowMeanMax: number;

  // Primary sequence physicochemical profiles
  hydropathyProfile: Array<{ position: number; residue: string; score: number }>;
  chargeProfile: Array<{ position: number; residue: string; score: number }>;

  // Acid/base summary (simple counts)
  acidicCount: number;
  basicCount: number;
  acidicPercentage: number;
  basicPercentage: number;

  // Spectroscopic and stability metrics
  extinctionCoefficientReduced: number; // ε280 assuming reduced Cys (Gill & von Hippel 1989)
  extinctionCoefficientCystine: number; // ε280 assuming disulfides (Pace et al. 1995)
  absorbance1mgmlReduced: number; // A280 (1mg/mL, 1cm)
  absorbance1mgmlCystine: number; // A280 (1mg/mL, 1cm)
  instabilityIndex: number; // Guruprasad et al. 1990
  instabilityClass: "Stable" | "Unstable";
  estimatedHalfLife: HalfLifeData | null; // N-end rule (Bachmair et al. 1986)

  // Legacy label (will be upgraded in later todo)
  solubility: string;

  // Deterministic heuristics (explicitly not ML predictors)
  solubilityHeuristicScore: number;
  aggregationRiskHeuristic: "Low" | "Medium" | "High";
  aggregationRiskScore: number;
}

const WATER_MASS = 18.01528; // g/mol

// Amino acid "free" average masses and Kyte-Doolittle hydropathy values.
// MW of peptide is computed as: sum(free AA masses) - (L-1)*H2O.
const aminoAcidData: Record<
  string,
  {
    mw: number;
    hydropathy: number;
    atoms: Record<string, number>;
    type: "acidic" | "basic" | "neutral";
  }
> = {
  A: { mw: 89.09, hydropathy: 1.8, atoms: { C: 3, H: 7, N: 1, O: 2 }, type: "neutral" },
  R: { mw: 174.2, hydropathy: -4.5, atoms: { C: 6, H: 14, N: 4, O: 2 }, type: "basic" },
  N: { mw: 132.12, hydropathy: -3.5, atoms: { C: 4, H: 8, N: 2, O: 3 }, type: "neutral" },
  D: { mw: 133.1, hydropathy: -3.5, atoms: { C: 4, H: 7, N: 1, O: 4 }, type: "acidic" },
  C: { mw: 121.15, hydropathy: 2.5, atoms: { C: 3, H: 7, N: 1, O: 2, S: 1 }, type: "neutral" },
  Q: { mw: 146.15, hydropathy: -3.5, atoms: { C: 5, H: 10, N: 2, O: 3 }, type: "neutral" },
  E: { mw: 147.13, hydropathy: -3.5, atoms: { C: 5, H: 9, N: 1, O: 4 }, type: "acidic" },
  G: { mw: 75.07, hydropathy: -0.4, atoms: { C: 2, H: 5, N: 1, O: 2 }, type: "neutral" },
  H: { mw: 155.16, hydropathy: -3.2, atoms: { C: 6, H: 9, N: 3, O: 2 }, type: "basic" },
  I: { mw: 131.17, hydropathy: 4.5, atoms: { C: 6, H: 13, N: 1, O: 2 }, type: "neutral" },
  L: { mw: 131.17, hydropathy: 3.8, atoms: { C: 6, H: 13, N: 1, O: 2 }, type: "neutral" },
  K: { mw: 146.19, hydropathy: -3.9, atoms: { C: 6, H: 14, N: 2, O: 2 }, type: "basic" },
  M: { mw: 149.21, hydropathy: 1.9, atoms: { C: 5, H: 11, N: 1, O: 2, S: 1 }, type: "neutral" },
  F: { mw: 165.19, hydropathy: 2.8, atoms: { C: 9, H: 11, N: 1, O: 2 }, type: "neutral" },
  P: { mw: 115.13, hydropathy: -1.6, atoms: { C: 5, H: 9, N: 1, O: 2 }, type: "neutral" },
  S: { mw: 105.09, hydropathy: -0.8, atoms: { C: 3, H: 7, N: 1, O: 3 }, type: "neutral" },
  T: { mw: 119.12, hydropathy: -0.7, atoms: { C: 4, H: 9, N: 1, O: 3 }, type: "neutral" },
  W: { mw: 204.23, hydropathy: -0.9, atoms: { C: 11, H: 12, N: 2, O: 2 }, type: "neutral" },
  Y: { mw: 181.19, hydropathy: -1.3, atoms: { C: 9, H: 11, N: 1, O: 3 }, type: "neutral" },
  V: { mw: 117.15, hydropathy: 4.2, atoms: { C: 5, H: 11, N: 1, O: 2 }, type: "neutral" },
};

// Bjellqvist pKa sets for isoelectric point calculation
// Based on: Bjellqvist et al. (1993) "The focusing positions of polypeptides in immobilized
// pH gradients can be predicted from their amino acid sequences" Electrophoresis 14, 1023-1031
// and Bjellqvist et al. (1994) Electrophoresis 15, 529-539
const positive_pKs: Readonly<Record<string, number>> = { Nterm: 7.5, K: 10.0, R: 12.0, H: 5.98 };
const negative_pKs: Readonly<Record<string, number>> = { Cterm: 3.55, D: 4.05, E: 4.45, C: 9.0, Y: 10.0 };
const pKcterminal: Readonly<Record<string, number>> = { D: 4.55, E: 4.75 };
const pKnterminal: Readonly<Record<string, number>> = { A: 7.59, M: 7.0, S: 6.93, P: 8.36, T: 6.82, V: 7.44, E: 7.7 };

function chargeAtPH(sequence: string, aaCounts: Record<string, number>, pH: number): number {
  if (!sequence) return 0;
  const nterm = sequence[0];
  const cterm = sequence[sequence.length - 1];

  const pos = { ...positive_pKs };
  const neg = { ...negative_pKs };
  if (pKnterminal[nterm]) pos.Nterm = pKnterminal[nterm];
  if (pKcterminal[cterm]) neg.Cterm = pKcterminal[cterm];

  const chargedCounts: Record<string, number> = {
    K: aaCounts.K || 0,
    R: aaCounts.R || 0,
    H: aaCounts.H || 0,
    D: aaCounts.D || 0,
    E: aaCounts.E || 0,
    C: aaCounts.C || 0,
    Y: aaCounts.Y || 0,
    Nterm: 1,
    Cterm: 1,
  };

  let positiveCharge = 0;
  for (const [aa, pK] of Object.entries(pos)) {
    const partial = 1 / (10 ** (pH - pK) + 1);
    positiveCharge += (chargedCounts[aa] || 0) * partial;
  }

  let negativeCharge = 0;
  for (const [aa, pK] of Object.entries(neg)) {
    const partial = 1 / (10 ** (pK - pH) + 1);
    negativeCharge += (chargedCounts[aa] || 0) * partial;
  }

  return positiveCharge - negativeCharge;
}

function estimateIsoelectricPoint(sequence: string, aaCounts: Record<string, number>): number {
  if (!sequence) return 0;
  let min = 4.05;
  let max = 12.0;
  let mid = (min + max) / 2;

  // Bisection until stable within 1e-4 pH units (Biopython default).
  while (max - min > 0.0001) {
    const charge = chargeAtPH(sequence, aaCounts, mid);
    if (charge > 0) min = mid;
    else max = mid;
    mid = (min + max) / 2;
  }
  return mid;
}

function computeExtinctionCoefficients(aaCounts: Record<string, number>): {
  reduced: number;
  cystine: number;
} {
  const w = aaCounts.W || 0;
  const y = aaCounts.Y || 0;
  const c = aaCounts.C || 0;
  const reduced = w * 5500 + y * 1490;
  const cystine = reduced + Math.floor(c / 2) * 125;
  return { reduced, cystine };
}

function computeInstabilityIndex(sequence: string): number {
  if (sequence.length < 2) return 0;
  let score = 0;
  for (let i = 0; i < sequence.length - 1; i++) {
    const a = sequence[i];
    const b = sequence[i + 1];
    const row = DIWV[a];
    if (!row) continue;
    const v = row[b];
    if (typeof v !== "number") continue;
    score += v;
  }
  return (10 / sequence.length) * score;
}

function computeAromaticity(aaCounts: Record<string, number>, length: number): number {
  if (length === 0) return 0;
  const f = aaCounts.F || 0;
  const w = aaCounts.W || 0;
  const y = aaCounts.Y || 0;
  return (f + w + y) / length;
}

function computeHydrophobicResidueFraction(aaCounts: Record<string, number>, length: number): number {
  if (length === 0) return 0;
  const hydrophobic = ["A", "V", "I", "L", "M", "F", "W", "Y", "C"];
  const count = hydrophobic.reduce((acc, aa) => acc + (aaCounts[aa] || 0), 0);
  return count / length;
}

function computeHydrophobicMomentHelixMax(sequence: string, windowSize = 11): number {
  // Eisenberg-style hydrophobic moment computation using a fixed angular periodicity
  // (alpha-helix ~100° per residue). Uses Kyte-Doolittle hydropathy values here.
  if (sequence.length === 0) return 0;
  const angle = (100 * Math.PI) / 180;
  const w = Math.max(3, Math.min(windowSize, sequence.length));
  let maxMoment = 0;
  for (let start = 0; start <= sequence.length - w; start++) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < w; i++) {
      const aa = sequence[start + i];
      const h = aminoAcidData[aa]?.hydropathy ?? 0;
      const theta = i * angle;
      x += h * Math.cos(theta);
      y += h * Math.sin(theta);
    }
    const moment = Math.sqrt(x * x + y * y) / w;
    if (moment > maxMoment) maxMoment = moment;
  }
  return maxMoment;
}

function computeHydropathyWindowMeanMax(sequence: string, windowSize = 9): number {
  if (sequence.length === 0) return 0;
  const w = Math.max(1, Math.min(windowSize, sequence.length));
  let maxMean = -Infinity;
  for (let start = 0; start <= sequence.length - w; start++) {
    let sum = 0;
    for (let i = 0; i < w; i++) {
      const aa = sequence[start + i];
      sum += aminoAcidData[aa]?.hydropathy ?? 0;
    }
    const mean = sum / w;
    if (mean > maxMean) maxMean = mean;
  }
  return maxMean === -Infinity ? 0 : maxMean;
}

// Kyte-Doolittle sliding window profile
export function computeHydropathyProfile(sequence: string, windowSize = 9): Array<{ position: number; residue: string; score: number }> {
  if (!sequence || sequence.length === 0) return [];
  const w = Math.max(1, Math.min(windowSize, sequence.length));
  const half = Math.floor(w / 2);
  const result: Array<{ position: number; residue: string; score: number }> = [];

  for (let i = 0; i < sequence.length; i++) {
    const start = Math.max(0, i - half);
    const end = Math.min(sequence.length, i + half + 1);
    let sum = 0;
    let count = 0;
    for (let j = start; j < end; j++) {
      const aa = sequence[j];
      if (aminoAcidData[aa]) {
        sum += aminoAcidData[aa].hydropathy;
        count++;
      }
    }
    const score = count > 0 ? sum / count : 0;
    result.push({
      position: i + 1,
      residue: sequence[i],
      score: parseFloat(score.toFixed(3)),
    });
  }
  return result;
}

// Local charge sliding window profile (window = 7)
export function computeChargeProfile(sequence: string, windowSize = 7): Array<{ position: number; residue: string; score: number }> {
  if (!sequence || sequence.length === 0) return [];
  const half = Math.floor(windowSize / 2);
  const result: Array<{ position: number; residue: string; score: number }> = [];

  for (let i = 0; i < sequence.length; i++) {
    const start = Math.max(0, i - half);
    const end = Math.min(sequence.length, i + half + 1);
    let charge = 0;
    for (let j = start; j < end; j++) {
      const aa = sequence[j];
      if (aa === 'K' || aa === 'R') charge += 1;
      else if (aa === 'H') charge += 0.1; // partial charge at pH 7.4
      else if (aa === 'D' || aa === 'E') charge -= 1;
    }
    result.push({
      position: i + 1,
      residue: sequence[i],
      score: parseFloat(charge.toFixed(2)),
    });
  }
  return result;
}

function computeMolecularFormula(atomCount: Record<string, number>): string {
  const subscript = (n: number) => n.toString().split('').map(d => String.fromCharCode(8320 + parseInt(d))).join('');
  const elements = ['C', 'H', 'N', 'O', 'S'];
  const parts = elements
    .filter(el => (atomCount[el] || 0) > 0)
    .map(el => `${el}${subscript(atomCount[el])}`);
  return parts.join('') || '—';
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function computeSolubilityHeuristicLabel(args: {
  gravy: number;
  hydropathyWindowMeanMax: number;
  netChargePH74: number;
  pI: number;
}): { label: string; score: number } {
  // Higher score => less soluble (heuristic).
  const chargeAbs = Math.abs(args.netChargePH74);
  const deltaPI = Math.abs(args.pI - 7.4);

  let score = 0;
  // Hydrophobicity penalty (GRAVY)
  score += 2 * clamp((args.gravy + 0.5) / 1.5, 0, 1);
  // Local hydrophobic patch penalty
  score += args.hydropathyWindowMeanMax > 1.6 ? 1 : args.hydropathyWindowMeanMax > 1.0 ? 0.5 : 0;
  // Being close to pI often reduces solubility (charge ~0)
  score += deltaPI < 0.5 ? 1 : deltaPI < 1.0 ? 0.5 : 0;
  // More net charge tends to increase solubility
  score -= clamp(chargeAbs, 0, 4) / 4;

  const label =
    score <= 0.25
      ? "Very soluble (heuristic)"
      : score <= 0.9
      ? "Soluble (heuristic)"
      : score <= 1.8
      ? "Slightly soluble (heuristic)"
      : "Insoluble (heuristic)";

  return { label, score: parseFloat(score.toFixed(3)) };
}

function computeAggregationRiskHeuristic(args: {
  hydropathyWindowMeanMax: number;
  aromaticity: number;
  hydrophobicResidueFraction: number;
  netChargePH74: number;
  hydrophobicMomentHelixMax: number;
}): { level: "Low" | "Medium" | "High"; score: number } {
  // Higher score => higher aggregation risk (heuristic).
  const chargeAbs = Math.abs(args.netChargePH74);

  let score = 0;
  score += args.hydropathyWindowMeanMax > 1.8 ? 1.0 : args.hydropathyWindowMeanMax > 1.2 ? 0.5 : 0;
  score += args.hydrophobicResidueFraction > 0.5 ? 0.5 : args.hydrophobicResidueFraction > 0.4 ? 0.25 : 0;
  score += args.aromaticity > 0.15 ? 0.5 : args.aromaticity > 0.1 ? 0.25 : 0;
  score += args.hydrophobicMomentHelixMax > 0.45 ? 0.25 : 0;
  score += chargeAbs < 1 ? 0.5 : chargeAbs < 2 ? 0.25 : 0;

  const level: "Low" | "Medium" | "High" =
    score < 0.75 ? "Low" : score < 1.75 ? "Medium" : "High";
  return { level, score: parseFloat(score.toFixed(3)) };
}

export function calculateProperties(sequence: string): ProteinProperties {
  // Restrict to canonical 20 amino acids for physicochemical calculations.
  const cleanSeq = sequence.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, "");
  const length = cleanSeq.length;

  let totalHydropathy = 0;
  let totalFreeAaWeight = 0;
  let acidicCount = 0;
  let basicCount = 0;

  const aminoAcidCount: Record<string, number> = {};
  const atomCount: Record<string, number> = {};

  for (const aa of cleanSeq) {
    const data = aminoAcidData[aa];
    if (!data) continue;

    aminoAcidCount[aa] = (aminoAcidCount[aa] || 0) + 1;

    totalHydropathy += data.hydropathy;
    totalFreeAaWeight += data.mw;

    if (data.type === "acidic") acidicCount++;
    if (data.type === "basic") basicCount++;

    for (const atom in data.atoms) {
      atomCount[atom] = (atomCount[atom] || 0) + data.atoms[atom];
    }
  }

  // Adjust atom counts for peptide bond formation: subtract (L-1) H2O.
  if (length > 1) {
    atomCount.H = (atomCount.H || 0) - 2 * (length - 1);
    atomCount.O = (atomCount.O || 0) - 1 * (length - 1);
  }

  // Molecular weight: sum(free AA masses) - (L-1)*H2O (peptide bond condensation).
  const molecularWeight =
    length === 0 ? 0 : totalFreeAaWeight - (length - 1) * WATER_MASS;

  const gravy = length === 0 ? 0 : totalHydropathy / length;
  const acidicPercentage = length === 0 ? 0 : (acidicCount / length) * 100;
  const basicPercentage = length === 0 ? 0 : (basicCount / length) * 100;

  const pI = estimateIsoelectricPoint(cleanSeq, aminoAcidCount);
  const netChargePH74 = chargeAtPH(cleanSeq, aminoAcidCount, 7.4);
  const chargeDensityPH74 = length > 0 ? netChargePH74 / length : 0;

  const chargeCurve: Array<{ pH: number; charge: number }> = [];
  for (let pH = 2; pH <= 12.0001; pH += 0.5) {
    chargeCurve.push({ pH: parseFloat(pH.toFixed(1)), charge: parseFloat(chargeAtPH(cleanSeq, aminoAcidCount, pH).toFixed(3)) });
  }

  const aromaticity = computeAromaticity(aminoAcidCount, length);
  const hydrophobicResidueFraction = computeHydrophobicResidueFraction(aminoAcidCount, length);
  const hydrophobicMomentHelixMax = computeHydrophobicMomentHelixMax(cleanSeq, 11);
  const hydropathyWindowMeanMax = computeHydropathyWindowMeanMax(cleanSeq, 9);

  // Aliphatic Index: Ikai (1980)
  const A = aminoAcidCount["A"] || 0;
  const V = aminoAcidCount["V"] || 0;
  const I = aminoAcidCount["I"] || 0;
  const L = aminoAcidCount["L"] || 0;
  const aliphaticIndex = length > 0 ? ((A + 2.9 * V + 3.9 * (I + L)) / length) * 100 : 0;

  // Profiles
  const hydropathyProfile = computeHydropathyProfile(cleanSeq, 9);
  const chargeProfile = computeChargeProfile(cleanSeq, 7);

  const { reduced: extinctionCoefficientReduced, cystine: extinctionCoefficientCystine } =
    computeExtinctionCoefficients(aminoAcidCount);

  const absorbance1mgmlReduced =
    molecularWeight > 0 ? extinctionCoefficientReduced / molecularWeight : 0;
  const absorbance1mgmlCystine =
    molecularWeight > 0 ? extinctionCoefficientCystine / molecularWeight : 0;

  const instabilityIndex = computeInstabilityIndex(cleanSeq);
  const instabilityClass: "Stable" | "Unstable" = instabilityIndex < 40 ? "Stable" : "Unstable";

  const estimatedHalfLife = cleanSeq ? getNEndRuleHalfLife(cleanSeq[0]) : null;

  const solubilityHeuristic = computeSolubilityHeuristicLabel({
    gravy,
    hydropathyWindowMeanMax,
    netChargePH74,
    pI,
  });

  const aggregationHeuristic = computeAggregationRiskHeuristic({
    hydropathyWindowMeanMax,
    aromaticity,
    hydrophobicResidueFraction,
    netChargePH74,
    hydrophobicMomentHelixMax,
  });

  const molecularFormula = computeMolecularFormula(atomCount);

  return {
    sequenceLength: length,
    gravy: parseFloat(gravy.toFixed(5)),
    molecularWeight: parseFloat(molecularWeight.toFixed(2)),
    molecularFormula,
    aminoAcidCount,
    atomCount,
    netChargePH74: parseFloat(netChargePH74.toFixed(3)),
    chargeDensityPH74: parseFloat(chargeDensityPH74.toFixed(4)),
    chargeCurve,
    aromaticity: parseFloat(aromaticity.toFixed(4)),
    aliphaticIndex: parseFloat(aliphaticIndex.toFixed(2)),
    hydrophobicResidueFraction: parseFloat(hydrophobicResidueFraction.toFixed(4)),
    hydrophobicMomentHelixMax: parseFloat(hydrophobicMomentHelixMax.toFixed(4)),
    hydropathyWindowMeanMax: parseFloat(hydropathyWindowMeanMax.toFixed(3)),
    hydropathyProfile,
    chargeProfile,
    acidicCount,
    basicCount,
    acidicPercentage: parseFloat(acidicPercentage.toFixed(2)),
    basicPercentage: parseFloat(basicPercentage.toFixed(2)),
    pI: parseFloat(pI.toFixed(2)),
    solubility: solubilityHeuristic.label,
    solubilityHeuristicScore: solubilityHeuristic.score,
    aggregationRiskHeuristic: aggregationHeuristic.level,
    aggregationRiskScore: aggregationHeuristic.score,
    extinctionCoefficientReduced,
    extinctionCoefficientCystine,
    absorbance1mgmlReduced: parseFloat(absorbance1mgmlReduced.toFixed(4)),
    absorbance1mgmlCystine: parseFloat(absorbance1mgmlCystine.toFixed(4)),
    instabilityIndex: parseFloat(instabilityIndex.toFixed(2)),
    instabilityClass,
    estimatedHalfLife,
  };
}
