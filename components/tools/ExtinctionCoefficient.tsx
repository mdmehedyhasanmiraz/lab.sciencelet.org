interface ExtinctionProps {
  extinction: number;
}

export default function ExtinctionCoefficient({ extinction }: ExtinctionProps) {
  return (
    <p><strong>Extinction Coefficient:</strong> {extinction} M<sup>-1</sup>cm<sup>-1</sup></p>
  );
}
