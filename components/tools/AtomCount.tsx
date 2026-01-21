interface AtomCountProps {
  atomCount: Record<string, number>;
}

export default function AtomCount({ atomCount }: AtomCountProps) {
  const entries = Object.entries(atomCount).sort(([a], [b]) => a.localeCompare(b));
  
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Element</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Count</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {entries.map(([el, count]) => (
              <tr key={el} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 text-sm font-semibold text-slate-900">{el}</td>
                <td className="px-6 py-3 text-sm text-right text-slate-700 font-mono">{count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 italic">
        Adjusted for peptide bond formation (H<sub>2</sub>O removed per bond)
      </p>
    </div>
  );
}
