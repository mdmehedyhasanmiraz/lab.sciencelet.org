interface AminoAcidCompositionProps {
  aminoAcidCount: Record<string, number>;
  total: number;
}

const AA_NAMES: Record<string, string> = {
  A: "Alanine",
  R: "Arginine",
  N: "Asparagine",
  D: "Aspartate",
  C: "Cysteine",
  E: "Glutamate",
  Q: "Glutamine",
  G: "Glycine",
  H: "Histidine",
  I: "Isoleucine",
  L: "Leucine",
  K: "Lysine",
  M: "Methionine",
  F: "Phenylalanine",
  P: "Proline",
  S: "Serine",
  T: "Threonine",
  W: "Tryptophan",
  Y: "Tyrosine",
  V: "Valine"
};

export default function AminoAcidComposition({ aminoAcidCount, total }: AminoAcidCompositionProps) {
  const rows = Object.entries(aminoAcidCount)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([aa, count]) => ({
      aa,
      name: AA_NAMES[aa] || aa,
      count,
      pct: total > 0 ? (count / total) * 100 : 0,
    }));

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-3 pr-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Residue (Code)</th>
            <th className="py-3 px-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Amino Acid Name</th>
            <th className="py-3 px-6 text-xs font-bold text-teal-950 uppercase tracking-wider text-center">Count</th>
            <th className="py-3 pl-6 text-xs font-bold text-teal-950 uppercase tracking-wider text-right">Molar Percentage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.aa} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3 pr-6 text-xs sm:text-sm font-semibold text-slate-900 font-mono">{r.aa}</td>
              <td className="py-3 px-6 text-xs sm:text-sm text-slate-700">{r.name}</td>
              <td className="py-3 px-6 text-xs sm:text-sm text-center text-slate-900 font-mono font-medium">{r.count}</td>
              <td className="py-3 pl-6 text-xs sm:text-sm text-right text-slate-900 font-mono font-semibold">{r.pct.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
