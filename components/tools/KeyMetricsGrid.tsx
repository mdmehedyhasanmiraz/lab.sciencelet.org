import type { ProteinProperties } from "@/lib/utils/calculateProperties";

type Metric = {
  label: string;
  value: string;
  hint?: string;
};

function MetricCard({ m }: { m: Metric }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium text-gray-500">{m.label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{m.value}</div>
      {m.hint ? <div className="mt-1 text-xs text-gray-500">{m.hint}</div> : null}
    </div>
  );
}

export default function KeyMetricsGrid({ properties }: { properties: ProteinProperties }) {
  const metrics: Metric[] = [
    { label: "Length", value: `${properties.sequenceLength} aa` },
    { label: "MW", value: `${properties.molecularWeight.toFixed(2)} g/mol` },
    { label: "pI", value: properties.pI.toFixed(2) },
    { label: "GRAVY", value: properties.gravy.toFixed(5), hint: "Kyte–Doolittle" },
    { label: "Net charge (pH 7.4)", value: properties.netChargePH74.toFixed(3) },
    { label: "Instability", value: properties.instabilityClass, hint: `II=${properties.instabilityIndex.toFixed(2)}` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.label} m={m} />
      ))}
    </div>
  );
}


