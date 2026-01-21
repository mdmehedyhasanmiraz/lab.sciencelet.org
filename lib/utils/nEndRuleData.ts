// N-end rule half-life data
// Based on: Bachmair, A., Finley, D. and Varshavsky, A. (1986)
// "In vivo half-life of a protein is a function of its amino-terminal residue"
// Science 234, 179-186. [PubMed: 3018930]
//
// Also references:
// - Varshavsky, A. (1997) "The N-end rule pathway of protein degradation"
//   Genes Cells 2, 13-28. [PubMed: 9112437]
// - Tobias, J.W. et al. (1991) "The N-end rule in bacteria"
//   Science 254, 1374-1377. [PubMed: 1962196]

export type HalfLifeData = {
  mammalian: string;
  yeast: string;
  ecoli: string | null;
};

// Keys are 1-letter N-terminal residues.
export const N_END_RULE_HALF_LIFE: Readonly<Record<string, HalfLifeData>> = {
  A: { mammalian: "4.4 hour", yeast: ">20 hour", ecoli: ">10 hour" },
  R: { mammalian: "1 hour", yeast: "2 min", ecoli: "2 min" },
  N: { mammalian: "1.4 hour", yeast: "3 min", ecoli: ">10 hour" },
  D: { mammalian: "1.1 hour", yeast: "3 min", ecoli: ">10 hour" },
  C: { mammalian: "1.2 hour", yeast: ">20 hour", ecoli: ">10 hour" },
  Q: { mammalian: "0.8 hour", yeast: "10 min", ecoli: ">10 hour" },
  E: { mammalian: "1 hour", yeast: "30 min", ecoli: ">10 hour" },
  G: { mammalian: "30 hour", yeast: ">20 hour", ecoli: ">10 hour" },
  H: { mammalian: "3.5 hour", yeast: "10 min", ecoli: ">10 hour" },
  I: { mammalian: "20 hour", yeast: "30 min", ecoli: ">10 hour" },
  L: { mammalian: "5.5 hour", yeast: "3 min", ecoli: "2 min" },
  K: { mammalian: "1.3 hour", yeast: "3 min", ecoli: "2 min" },
  M: { mammalian: "30 hour", yeast: ">20 hour", ecoli: ">10 hour" },
  F: { mammalian: "1.1 hour", yeast: "3 min", ecoli: "2 min" },
  P: { mammalian: ">20 hour", yeast: ">20 hour", ecoli: null },
  S: { mammalian: "1.9 hour", yeast: ">20 hour", ecoli: ">10 hour" },
  T: { mammalian: "7.2 hour", yeast: ">20 hour", ecoli: ">10 hour" },
  W: { mammalian: "2.8 hour", yeast: "3 min", ecoli: "2 min" },
  Y: { mammalian: "2.8 hour", yeast: "10 min", ecoli: "2 min" },
  V: { mammalian: "100 hour", yeast: ">20 hour", ecoli: ">10 hour" },
} as const;

export function getNEndRuleHalfLife(nTermResidue: string): HalfLifeData | null {
  const key = (nTermResidue || "").toUpperCase();
  return N_END_RULE_HALF_LIFE[key] ?? null;
}

