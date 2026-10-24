interface AcidicBasicProps {
  acidicCount: number;
  basicCount: number;
  acidicPercentage: number;
  basicPercentage: number;
}

export default function AcidicBasicResidues({ acidicCount, basicCount, acidicPercentage, basicPercentage }: AcidicBasicProps) {
  const rows = [
    {
      group: "Acidic Residues",
      aminoAcids: "Aspartate (D), Glutamate (E)",
      count: acidicCount,
      percentage: `${acidicPercentage.toFixed(2)}%`
    },
    {
      group: "Basic Residues",
      aminoAcids: "Lysine (K), Arginine (R), Histidine (H)",
      count: basicCount,
      percentage: `${basicPercentage.toFixed(2)}%`
    }
  ];

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-3 pr-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Residue Class</th>
            <th className="py-3 px-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Amino Acids</th>
            <th className="py-3 px-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Count</th>
            <th className="py-3 pl-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Molar Percentage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3 pr-6 font-semibold text-slate-900 text-xs sm:text-sm">{row.group}</td>
              <td className="py-3 px-6 text-slate-600 text-xs sm:text-sm">{row.aminoAcids}</td>
              <td className="py-3 px-6 text-slate-900 font-mono text-xs sm:text-sm font-semibold">{row.count}</td>
              <td className="py-3 pl-6 text-slate-800 font-mono text-xs sm:text-sm font-semibold">{row.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
