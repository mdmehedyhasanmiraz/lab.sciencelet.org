interface SolubilityProps {
  solubility: string;
}

export default function Solubility({ solubility }: SolubilityProps) {
  return (
    <p><strong>Solubility:</strong> {solubility}</p>
  );
}
