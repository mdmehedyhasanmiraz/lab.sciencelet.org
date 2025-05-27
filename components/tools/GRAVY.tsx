interface GravyProps {
  gravy: number;
}

export default function GRAVY({ gravy }: GravyProps) {
  return (
    <p><strong>GRAVY:</strong> {gravy.toFixed(5)}</p>
  );
}
