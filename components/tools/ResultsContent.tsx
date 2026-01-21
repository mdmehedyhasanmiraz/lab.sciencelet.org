"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Copy, Check, Share2, Dna } from "lucide-react";
import { calculateProperties, type ProteinProperties } from "@/lib/utils/calculateProperties";
import PhysicochemicalSummary from "./PhysicochemicalSummary";
import AcidicBasicResidues from "./AcidicBasicResidues";
import AliphaticIndex from "./AliphaticIndex";
import AtomCount from "./AtomCount";
import AminoAcidComposition from "./AminoAcidComposition";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import CreditsSection from "@/components/home/CreditsSection";

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sequence = searchParams.get("sequence");
  
  const [properties, setProperties] = useState<ProteinProperties | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sequence) {
      const result = calculateProperties(sequence);
      setProperties(result);
    }
  }, [sequence]);

  if (!sequence) {
    router.push("/pepcheck");
    return null;
  }

  if (!properties) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-slate-600">Computing properties...</p>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sequence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "PepCheck Analysis Results",
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Results URL copied to clipboard!");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push("/pepcheck")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200 hover:bg-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200 hover:bg-white transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Sequence Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition" />
          
          <div className="relative bg-white rounded-xl shadow-xl shadow-slate-900/5 border border-slate-200/50 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                    <Dna className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Submitted Sequence</h2>
                    <p className="text-sm text-slate-600">{properties.sequenceLength} residues</p>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50">
              <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap break-all leading-relaxed">
                {sequence.match(/.{1,60}/g)?.join("\n")}
              </pre>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            <PhysicochemicalSummary properties={properties} />

            <CollapsibleSection title="📊 Composition & Residue Classes" defaultOpen>
              <div className="space-y-4">
                <AcidicBasicResidues
                  acidicCount={properties.acidicCount}
                  basicCount={properties.basicCount}
                  acidicPercentage={properties.acidicPercentage}
                  basicPercentage={properties.basicPercentage}
                />
                <AliphaticIndex
                  aminoAcidCount={properties.aminoAcidCount}
                  sequenceLength={properties.sequenceLength}
                />
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="⚛️ Atomic Composition" defaultOpen={false}>
              <AtomCount atomCount={properties.atomCount} />
            </CollapsibleSection>

            <CollapsibleSection title="🧬 Amino Acid Composition" defaultOpen={false}>
              <AminoAcidComposition
                aminoAcidCount={properties.aminoAcidCount}
                total={properties.sequenceLength}
              />
            </CollapsibleSection>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg shadow-slate-900/5 border border-slate-200/50 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                {[
                  { label: "Length", value: `${properties.sequenceLength} aa` },
                  { label: "Molecular Weight", value: `${properties.molecularWeight.toFixed(2)} Da` },
                  { label: "Theoretical pI", value: properties.pI.toFixed(2) },
                  { label: "Net Charge (pH 7.4)", value: properties.netChargePH74.toFixed(2) },
                  { label: "GRAVY", value: properties.gravy.toFixed(5) },
                  { label: "Instability Index", value: properties.instabilityIndex.toFixed(2) },
                  { label: "Aromaticity", value: `${(parseFloat(properties.aromaticity.toString()) * 100).toFixed(2)}%` }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-600">{stat.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-2">Analysis Status</h3>
              <p className="text-sm opacity-90 mb-3">
                {properties.instabilityIndex > 40 ? "Unstable" : "Stable"} • {properties.solubility}
              </p>
              <div className="text-xs opacity-75">
                Based on Guruprasad instability index and multi-factor solubility heuristic
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreditsSection />
    </main>
  );
}

