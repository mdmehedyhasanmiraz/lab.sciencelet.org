interface AtomCountProps {
  atomCount: Record<string, number>;
}

export default function AtomCount({ atomCount }: AtomCountProps) {
  const entries = Object.entries(atomCount).sort(([a], [b]) => a.localeCompare(b));
  
  return (
    <div className="w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 pr-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Chemical Element</th>
              <th className="py-3 px-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Symbol</th>
              <th className="py-3 pl-6 text-xs font-bold text-teal-950 uppercase tracking-wider text-right">Atom Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map(([el, count]) => {
              const names: Record<string, string> = {
                C: "Carbon",
                H: "Hydrogen",
                N: "Nitrogen",
                O: "Oxygen",
                S: "Sulfur"
              };

              return (
                <tr key={el} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-6 text-xs sm:text-sm font-semibold text-slate-900">{names[el] || el}</td>
                  <td className="py-3 px-6 text-xs sm:text-sm text-slate-700 font-mono">{el}</td>
                  <td className="py-3 pl-6 text-xs sm:text-sm text-right text-slate-900 font-mono font-semibold">{count.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-500 italic">
        * Adjusted for peptide bond condensation (1 molecule of H₂O removed per peptide bond formed).
      </p>
    </div>
  );
}
