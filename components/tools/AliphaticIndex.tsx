import React from "react";

interface AliphaticIndexProps {
  aminoAcidCount: Record<string, number>;
  sequenceLength: number;
}

const AliphaticIndex: React.FC<AliphaticIndexProps> = ({
  aminoAcidCount,
  sequenceLength,
}) => {
  // Calculate aliphatic index
  const A = aminoAcidCount["A"] || 0;
  const V = aminoAcidCount["V"] || 0;
  const I = aminoAcidCount["I"] || 0;
  const L = aminoAcidCount["L"] || 0;

  const ai =
    sequenceLength > 0
      ? ((A + 2.9 * V + 3.9 * (I + L)) / sequenceLength) * 100
      : 0;

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition" />
      <div className="relative p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50">
        <div className="text-sm font-semibold text-emerald-900 mb-2">Aliphatic Index (Ikai)</div>
        <div className="text-3xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">{ai.toFixed(2)}</div>
        <div className="text-xs text-emerald-700 mt-1">
          Thermostability indicator • A, V, I, L content
        </div>
      </div>
    </div>
  );
};

export default AliphaticIndex;
