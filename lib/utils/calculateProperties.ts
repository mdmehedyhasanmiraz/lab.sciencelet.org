export interface ProteinProperties {
  sequenceLength: number;
  gravy: number;
  molecularWeight: number;
  aminoAcidCount: Record<string, number>;
  atomCount: Record<string, number>;
  acidicCount: number;
  basicCount: number;
  acidicPercentage: number;
  basicPercentage: number;
  pI: number;
  solubility: string;
  extinctionCoefficient: number;
}

const aminoAcidData: Record<
  string,
  {
    mw: number;
    hydropathy: number;
    atoms: Record<string, number>;
    extinction: number;
    type: "acidic" | "basic" | "neutral";
  }
> = {
  A: { mw: 89.09, hydropathy: 1.8, atoms: { C: 3, H: 7, N: 1, O: 2 }, extinction: 0, type: "neutral" },
  R: { mw: 174.2, hydropathy: -4.5, atoms: { C: 6, H: 14, N: 4, O: 2 }, extinction: 0, type: "basic" },
  N: { mw: 132.12, hydropathy: -3.5, atoms: { C: 4, H: 8, N: 2, O: 3 }, extinction: 0, type: "neutral" },
  D: { mw: 133.1, hydropathy: -3.5, atoms: { C: 4, H: 7, N: 1, O: 4 }, extinction: 0, type: "acidic" },
  C: { mw: 121.15, hydropathy: 2.5, atoms: { C: 3, H: 7, N: 1, O: 2, S: 1 }, extinction: 125, type: "neutral" },
  Q: { mw: 146.15, hydropathy: -3.5, atoms: { C: 5, H: 10, N: 2, O: 3 }, extinction: 0, type: "neutral" },
  E: { mw: 147.13, hydropathy: -3.5, atoms: { C: 5, H: 9, N: 1, O: 4 }, extinction: 0, type: "acidic" },
  G: { mw: 75.07, hydropathy: -0.4, atoms: { C: 2, H: 5, N: 1, O: 2 }, extinction: 0, type: "neutral" },
  H: { mw: 155.16, hydropathy: -3.2, atoms: { C: 6, H: 9, N: 3, O: 2 }, extinction: 0, type: "basic" },
  I: { mw: 131.17, hydropathy: 4.5, atoms: { C: 6, H: 13, N: 1, O: 2 }, extinction: 0, type: "neutral" },
  L: { mw: 131.17, hydropathy: 3.8, atoms: { C: 6, H: 13, N: 1, O: 2 }, extinction: 0, type: "neutral" },
  K: { mw: 146.19, hydropathy: -3.9, atoms: { C: 6, H: 14, N: 2, O: 2 }, extinction: 0, type: "basic" },
  M: { mw: 149.21, hydropathy: 1.9, atoms: { C: 5, H: 11, N: 1, O: 2, S: 1 }, extinction: 0, type: "neutral" },
  F: { mw: 165.19, hydropathy: 2.8, atoms: { C: 9, H: 11, N: 1, O: 2 }, extinction: 0, type: "neutral" },
  P: { mw: 115.13, hydropathy: -1.6, atoms: { C: 5, H: 9, N: 1, O: 2 }, extinction: 0, type: "neutral" },
  S: { mw: 105.09, hydropathy: -0.8, atoms: { C: 3, H: 7, N: 1, O: 3 }, extinction: 0, type: "neutral" },
  T: { mw: 119.12, hydropathy: -0.7, atoms: { C: 4, H: 9, N: 1, O: 3 }, extinction: 0, type: "neutral" },
  W: { mw: 204.23, hydropathy: -0.9, atoms: { C: 11, H: 12, N: 2, O: 2 }, extinction: 5500, type: "neutral" },
  Y: { mw: 181.19, hydropathy: -1.3, atoms: { C: 9, H: 11, N: 1, O: 3 }, extinction: 1490, type: "neutral" },
  V: { mw: 117.15, hydropathy: 4.2, atoms: { C: 5, H: 11, N: 1, O: 2 }, extinction: 0, type: "neutral" },
};

export function calculateProperties(sequence: string): ProteinProperties {
  const cleanSeq = sequence.toUpperCase().replace(/[^A-Z]/g, "");
  const length = cleanSeq.length;

  let totalHydropathy = 0;
  let totalWeight = 0;
  let acidicCount = 0;
  let basicCount = 0;
  let extinctionCoefficient = 0;

  const aminoAcidCount: Record<string, number> = {};
  const atomCount: Record<string, number> = {};

  for (const aa of cleanSeq) {
    const data = aminoAcidData[aa];
    if (!data) continue;

    aminoAcidCount[aa] = (aminoAcidCount[aa] || 0) + 1;

    totalHydropathy += data.hydropathy;
    totalWeight += data.mw;
    extinctionCoefficient += data.extinction;

    if (data.type === "acidic") acidicCount++;
    if (data.type === "basic") basicCount++;

    for (const atom in data.atoms) {
      atomCount[atom] = (atomCount[atom] || 0) + data.atoms[atom];
    }
  }

  const gravy = totalHydropathy / length;
  const acidicPercentage = (acidicCount / length) * 100;
  const basicPercentage = (basicCount / length) * 100;

  // Simple isoelectric point (pI) estimation: crude approximation
  const pI = 7 + (basicCount - acidicCount) * 0.1;

  const solubility =
    gravy < -0.5
      ? "Very soluble"
      : gravy < 0
      ? "Soluble"
      : gravy < 0.5
      ? "Slightly soluble"
      : "Insoluble";

  return {
    sequenceLength: length,
    gravy: parseFloat(gravy.toFixed(3)),
    molecularWeight: parseFloat(totalWeight.toFixed(2)),
    aminoAcidCount,
    atomCount,
    acidicCount,
    basicCount,
    acidicPercentage: parseFloat(acidicPercentage.toFixed(2)),
    basicPercentage: parseFloat(basicPercentage.toFixed(2)),
    pI: parseFloat(pI.toFixed(2)),
    solubility,
    extinctionCoefficient,
  };
}
