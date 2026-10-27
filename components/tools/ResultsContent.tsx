"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  Dna, 
  FlaskConical, 
  PieChart, 
  Atom, 
  Binary,
  LineChart
} from "lucide-react";
import { calculateProperties, type ProteinProperties } from "@/lib/utils/calculateProperties";
import PhysicochemicalSummary from "./PhysicochemicalSummary";
import AcidicBasicResidues from "./AcidicBasicResidues";
import AliphaticIndex from "./AliphaticIndex";
import AtomCount from "./AtomCount";
import AminoAcidComposition from "./AminoAcidComposition";
import PropertyRadar from "./PropertyRadar";
import ChargeCurvePlot from "./ChargeCurvePlot";
import HydropathyPlot from "./HydropathyPlot";
import HelicalWheelPlot from "./HelicalWheelPlot";
import FoldIndexPlot from "./FoldIndexPlot";
import CreditsSection from "@/components/home/CreditsSection";
import AnalysisProgress from "./AnalysisProgress";

type TabId = "physicochemical" | "plots" | "composition" | "atomic" | "aminoAcids";

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sequence = searchParams.get("sequence");
  
  const [properties, setProperties] = useState<ProteinProperties | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("physicochemical");

  useEffect(() => {
    if (sequence) {
      try {
        const result = calculateProperties(sequence);
        setProperties(result);
      } catch (err) {
        console.error("Calculation error", err);
      }
    }
  }, [sequence]);

  if (!sequence) {
    router.push("/protindex");
    return null;
  }

  // Show scientific progress sequence first
  if (isAnalyzing || !properties) {
    return (
      <AnalysisProgress 
        sequenceLength={sequence.length} 
        onComplete={() => setIsAnalyzing(false)} 
      />
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
        title: "ProtIndex Analysis Results",
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Results URL copied to clipboard!");
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "physicochemical", label: "Physicochemical Properties", icon: FlaskConical },
    { id: "plots", label: "Biophysical Plots", icon: LineChart },
    { id: "composition", label: "Composition & Residue Classes", icon: PieChart },
    { id: "atomic", label: "Atomic Composition", icon: Atom },
    { id: "aminoAcids", label: "Amino Acid Composition", icon: Binary },
  ];

  return (
    <main className="min-h-screen bg-white pb-20 w-full">
      {/* Flat Teal Header with Tool Name and Full Width Container */}
      <div className="bg-teal-900 text-white py-8 border-b border-teal-800 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-800 text-teal-200">
                Sequence Analysis
              </span>
              <span className="text-xs text-teal-200/80 font-mono">
                {properties.sequenceLength} aa
              </span>
            </div>
            {/* Replaced header with the actual tool name */}
            <h1 className="text-3xl font-bold tracking-tight text-white">
              ProtIndex
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => router.push("/protindex")}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-teal-800 hover:bg-teal-700 rounded transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>New Analysis</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-teal-950 bg-teal-100 hover:bg-white rounded transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-teal-800" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Width Content on Clean White Background (No nested cards) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 w-full">
        {/* Submitted Sequence Section - Borderless, open layout */}
        <div className="pb-6 border-b border-slate-200">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2.5">
              <Dna className="w-4 h-4 text-teal-800" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Submitted FASTA Sequence ({properties.sequenceLength} residues)
              </h2>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Sequence</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded max-h-36 overflow-y-auto">
            <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap break-all leading-relaxed">
              {sequence.match(/.{1,60}/g)?.join("\n")}
            </pre>
          </div>
        </div>

        {/* Horizontal Navigation Tabs (Flat, borderless bar) */}
        <div>
          <div className="flex border-b border-slate-200 space-x-1 sm:space-x-4 overflow-x-auto pb-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "border-teal-800 text-teal-900"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-800" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Table Display (Full Width, Cardless, Borderless Table presentation) */}
          <div className="pt-6 w-full">
            {activeTab === "physicochemical" && (
              <div className="w-full space-y-8">
                <PhysicochemicalSummary properties={properties} />
                <div className="pt-4 space-y-6">
                  <ChargeCurvePlot
                    chargeCurve={properties.chargeCurve}
                    pI={properties.pI}
                    netChargePH74={properties.netChargePH74}
                  />
                  <HydropathyPlot sequence={sequence} />
                  <FoldIndexPlot
                    foldIndexProfile={properties.foldIndexProfile}
                    meanScore={properties.foldIndexMean}
                    classification={properties.foldIndexClass}
                  />
                  <HelicalWheelPlot sequence={sequence} />
                </div>
              </div>
            )}

            {activeTab === "plots" && (
              <div className="w-full space-y-8">
                <ChargeCurvePlot
                  chargeCurve={properties.chargeCurve}
                  pI={properties.pI}
                  netChargePH74={properties.netChargePH74}
                />
                <HydropathyPlot sequence={sequence} />
                <FoldIndexPlot
                  foldIndexProfile={properties.foldIndexProfile}
                  meanScore={properties.foldIndexMean}
                  classification={properties.foldIndexClass}
                />
                <HelicalWheelPlot sequence={sequence} />
              </div>
            )}

            {activeTab === "composition" && (
              <div className="w-full space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Acidic & Basic Residues</h3>
                  <AcidicBasicResidues
                    acidicCount={properties.acidicCount}
                    basicCount={properties.basicCount}
                    acidicPercentage={properties.acidicPercentage}
                    basicPercentage={properties.basicPercentage}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Thermostability Index</h3>
                  <AliphaticIndex
                    aminoAcidCount={properties.aminoAcidCount}
                    sequenceLength={properties.sequenceLength}
                  />
                </div>
              </div>
            )}

            {activeTab === "atomic" && (
              <div className="w-full">
                <AtomCount atomCount={properties.atomCount} />
              </div>
            )}

            {activeTab === "aminoAcids" && (
              <div className="w-full">
                <AminoAcidComposition
                  aminoAcidCount={properties.aminoAcidCount}
                  total={properties.sequenceLength}
                />
              </div>
            )}
          </div>
        </div>

        {/* Visual Property Radar at the bottom */}
        <PropertyRadar properties={properties} />
      </div>

      <CreditsSection />
    </main>
  );
}
