// components/SequenceLength.tsx
interface SequenceLengthProps {
  length: number;
}

export default function SequenceLength({ length }: SequenceLengthProps) {
  return (
    <p><strong>Sequence Length:</strong> {length}</p>
  );
}
