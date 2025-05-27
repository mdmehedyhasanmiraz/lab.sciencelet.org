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
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Aliphatic Index</h2>
      <p className="text-3xl font-bold text-emerald-600">{ai.toFixed(2)}</p>
      <p className="text-sm text-gray-500 mt-1">
        Indicates thermostability; higher values imply greater stability.
      </p>
    </div>
  );
};

export default AliphaticIndex;
