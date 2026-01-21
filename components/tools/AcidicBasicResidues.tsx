interface AcidicBasicProps {
  acidicCount: number;
  basicCount: number;
  acidicPercentage: number;
  basicPercentage: number;
}

export default function AcidicBasicResidues({ acidicCount, basicCount, acidicPercentage, basicPercentage }: AcidicBasicProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="relative group/card">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl blur opacity-20 group-hover/card:opacity-30 transition" />
        <div className="relative p-5 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-200/50">
          <div className="text-sm font-semibold text-red-900 mb-2">Acidic Residues</div>
          <div className="text-3xl font-bold bg-gradient-to-br from-red-600 to-pink-600 bg-clip-text text-transparent">{acidicCount}</div>
          <div className="text-xs text-red-700 mt-1 font-medium">{acidicPercentage.toFixed(2)}% • D, E</div>
        </div>
      </div>

      <div className="relative group/card">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-20 group-hover/card:opacity-30 transition" />
        <div className="relative p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
          <div className="text-sm font-semibold text-blue-900 mb-2">Basic Residues</div>
          <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">{basicCount}</div>
          <div className="text-xs text-blue-700 mt-1 font-medium">{basicPercentage.toFixed(2)}% • K, R, H</div>
        </div>
      </div>
    </div>
  );
}
