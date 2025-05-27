import React from "react";

interface IsoelectricPointProps {
  pI: number;
}

const IsoelectricPoint: React.FC<IsoelectricPointProps> = ({ pI }) => {
  let description = "";
  if (pI < 5.5) {
    description = "This protein is likely acidic.";
  } else if (pI > 8.5) {
    description = "This protein is likely basic.";
  } else {
    description = "This protein is near neutral.";
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Isoelectric Point (pI)</h2>
      <p className="text-3xl font-bold text-indigo-600">{pI}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default IsoelectricPoint;
