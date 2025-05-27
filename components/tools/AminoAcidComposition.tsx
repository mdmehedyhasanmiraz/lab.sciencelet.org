interface AminoAcidCompositionProps {
  aminoAcidCount: Record<string, number>;
  total: number;
}

export default function AminoAcidComposition({ aminoAcidCount, total }: AminoAcidCompositionProps) {
  return (
    <>
      <p><strong>Amino Acid Composition:</strong></p>
      <table className="border-collapse text-center border-2 border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 border-b">Amino Acid</th>
            <th className="px-2 border-b">Count</th>
            <th className="px-2 border-b">Percentage (%)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(aminoAcidCount).map(([aa, count]) => (
            <tr key={aa}>
              <td className="px-2 border-b">{aa}</td>
              <td className="px-2 border-b">{count}</td>
              <td className="px-2 border-b">{((count / total) * 100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
