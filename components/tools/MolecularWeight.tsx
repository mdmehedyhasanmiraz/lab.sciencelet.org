// components/MolecularWeight.tsx
interface MolecularWeightProps {
  weight: number;
}

export default function MolecularWeight({ weight }: MolecularWeightProps) {
  return (
    <p><strong>Molecular Weight:</strong> {weight.toFixed(2)} g/mol</p>
  );
}
