import React from "react";
import { ExternalLink } from "lucide-react";

interface AliphaticIndexProps {
  aminoAcidCount: Record<string, number>;
  sequenceLength: number;
}

const AliphaticIndex: React.FC<AliphaticIndexProps> = ({
  aminoAcidCount,
  sequenceLength,
}) => {
  const A = aminoAcidCount["A"] || 0;
  const V = aminoAcidCount["V"] || 0;
  const I = aminoAcidCount["I"] || 0;
  const L = aminoAcidCount["L"] || 0;

  const ai =
    sequenceLength > 0
      ? ((A + 2.9 * V + 3.9 * (I + L)) / sequenceLength) * 100
      : 0;

  return (
    <div className="overflow-x-auto w-full pt-4">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-3 pr-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Index Parameter</th>
            <th className="py-3 px-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Score</th>
            <th className="py-3 pl-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Method & Reference</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr className="hover:bg-slate-50/70 transition-colors">
            <td className="py-3 pr-6 font-semibold text-slate-900 text-xs sm:text-sm">
              Aliphatic Index
            </td>
            <td className="py-3 px-6 text-slate-900 font-mono text-xs sm:text-sm font-semibold">
              {ai.toFixed(2)}
            </td>
            <td className="py-3 pl-6 text-xs text-slate-600">
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/7462208/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-teal-800 hover:text-teal-950 underline decoration-teal-300 font-medium"
              >
                <span>Ikai (1980)</span>
                <ExternalLink className="w-3 h-3 text-teal-600" />
              </a>
              <span className="text-slate-400 ml-1.5">• Relative volume occupied by Ala, Val, Ile, Leu</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AliphaticIndex;
