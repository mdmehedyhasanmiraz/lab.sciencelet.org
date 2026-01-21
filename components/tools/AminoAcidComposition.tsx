interface AminoAcidCompositionProps {
  aminoAcidCount: Record<string, number>;
  total: number;
}

export default function AminoAcidComposition({ aminoAcidCount, total }: AminoAcidCompositionProps) {
  const rows = Object.entries(aminoAcidCount)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([aa, count]) => ({
      aa,
      count,
      pct: total > 0 ? (count / total) * 100 : 0,
    }));

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">AA</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Count</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Percentage</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.aa} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-3 text-sm font-semibold text-slate-900">{r.aa}</td>
              <td className="px-6 py-3 text-sm text-center text-slate-700 font-mono">{r.count}</td>
              <td className="px-6 py-3 text-sm text-right text-slate-700 font-mono">{r.pct.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
