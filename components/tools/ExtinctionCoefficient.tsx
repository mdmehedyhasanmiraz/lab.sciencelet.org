interface ExtinctionProps {
  reduced: number;
  cystine: number;
  absorbance1mgmlReduced: number;
  absorbance1mgmlCystine: number;
}

export default function ExtinctionCoefficient({
  reduced,
  cystine,
  absorbance1mgmlReduced,
  absorbance1mgmlCystine,
}: ExtinctionProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Extinction Coefficient (280 nm)</h2>
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <strong>ε280 (reduced Cys):</strong> {reduced} M<sup>-1</sup>cm<sup>-1</sup>
        </p>
        <p>
          <strong>ε280 (cystines):</strong> {cystine} M<sup>-1</sup>cm<sup>-1</sup>
        </p>
        <p>
          <strong>A280 (1 mg/mL, 1 cm; reduced):</strong> {absorbance1mgmlReduced}
        </p>
        <p>
          <strong>A280 (1 mg/mL, 1 cm; cystines):</strong> {absorbance1mgmlCystine}
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Calculated from Tyr, Trp, and Cys content using Gill & von Hippel (1989) and Pace et al. (1995) methods.
      </p>
    </div>
  );
}
