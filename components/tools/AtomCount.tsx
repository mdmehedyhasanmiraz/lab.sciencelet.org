interface AtomCountProps {
  atomCount: Record<string, number>;
}

export default function AtomCount({ atomCount }: AtomCountProps) {
  return (
    <p><strong>Atom Count:</strong> {JSON.stringify(atomCount)}</p>
  );
}
