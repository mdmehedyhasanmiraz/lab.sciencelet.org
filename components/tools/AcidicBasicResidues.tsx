interface AcidicBasicProps {
  acidicCount: number;
  basicCount: number;
  acidicPercentage: number;
  basicPercentage: number;
}

export default function AcidicBasicResidues({ acidicCount, basicCount, acidicPercentage, basicPercentage }: AcidicBasicProps) {
  return (
    <>
      <p><strong>Acidic Residues:</strong> {acidicCount} ({acidicPercentage.toFixed(2)}%)</p>
      <p><strong>Basic Residues:</strong> {basicCount} ({basicPercentage.toFixed(2)}%)</p>
    </>
  );
}
