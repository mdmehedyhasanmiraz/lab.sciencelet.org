"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Share2, 
  Check, 
  AlertCircle
} from "lucide-react";
import { 
  parsePDBAndCalculateRamachandran, 
  StructureAssessment 
} from "@/lib/utils/pdbParser";
import RamachandranPlot from "@/components/tools/RamachandranPlot";

function ProtAssessResultsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pdbId = searchParams.get("id");

  const [assessment, setAssessment] = useState<StructureAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Check if PDB text was stored in sessionStorage
    const storedPdbText = typeof window !== "undefined" ? sessionStorage.getItem("protassess_pdb_content") : null;
    const storedPdbName = typeof window !== "undefined" ? sessionStorage.getItem("protassess_pdb_name") : null;

    if (storedPdbText) {
      try {
        const result = parsePDBAndCalculateRamachandran(storedPdbText);
        if (storedPdbName) {
          result.title = storedPdbName;
        }
        setAssessment(result);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to parse the submitted PDB coordinate structure.");
        setLoading(false);
      }
      return;
    }

    // 2. Or check if an RCSB PDB ID was provided in the query string
    if (pdbId && pdbId.length === 4) {
      fetch(`https://files.rcsb.org/download/${pdbId.toUpperCase()}.pdb`)
        .then((res) => {
          if (!res.ok) throw new Error(`PDB entry ${pdbId} not found on RCSB.`);
          return res.text();
        })
        .then((text) => {
          const result = parsePDBAndCalculateRamachandran(text);
          result.title = `${pdbId.toUpperCase()}.pdb (RCSB PDB)`;
          setAssessment(result);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to retrieve PDB structure.");
          setLoading(false);
        });
      return;
    }

    // No structure found, redirect to input page
    router.push("/protassess");
  }, [pdbId, router]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "ProtAssess Ramachandran Analysis",
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-teal-800 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">
          Calculating backbone dihedral torsion angles...
        </p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-md text-rose-900 text-sm mb-6 flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error || "No structural coordinates available for analysis."}</span>
        </div>
        <button
          onClick={() => router.push("/protassess")}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-medium rounded-md text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to ProtAssess Input</span>
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20 w-full">
      {/* Flat Teal Header */}
      <div className="bg-teal-900 text-white py-8 border-b border-teal-800 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-800 text-teal-200">
                Structure Stereochemistry
              </span>
              <span className="text-xs text-teal-200/80 font-mono">
                {assessment.analyzedResidues} residues
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              ProtAssess
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => router.push("/protassess")}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-teal-800 hover:bg-teal-700 rounded transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>New Structure</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-teal-950 bg-teal-100 hover:bg-white rounded transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-teal-800" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-teal-800" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Structure Validation Summary Card */}
        <div className="p-6 rounded-md border border-slate-200 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-teal-700 tracking-wider uppercase mb-0.5 block">
                Validation Report
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {assessment.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                {assessment.numChains} Chain{assessment.numChains > 1 ? "s" : ""} ({assessment.chains.join(", ")})
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono">
                {assessment.analyzedResidues} of {assessment.totalResidues} Residues Analyzed
              </span>
            </div>
          </div>

          {/* 4 Quality Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-md bg-blue-50/90 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] sm:text-xs font-bold text-blue-950">Highly Favoured</span>
                <span className="text-xs font-bold text-blue-800 font-mono">
                  {assessment.stats.favoredPercent}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-950 font-mono">
                {assessment.stats.favoredCount}
              </div>
              <p className="text-[10px] text-blue-800/80 mt-1 font-sans">
                Core energy minima
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-md bg-sky-50/70 border border-sky-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] sm:text-xs font-bold text-sky-950">Allowed Region</span>
                <span className="text-xs font-bold text-sky-800 font-mono">
                  {assessment.stats.allowedPercent}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-sky-950 font-mono">
                {assessment.stats.allowedCount}
              </div>
              <p className="text-[10px] text-sky-800/80 mt-1 font-sans">
                Conformationally valid
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-md bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] sm:text-xs font-bold text-slate-800">Generously Allowed</span>
                <span className="text-xs font-bold text-slate-600 font-mono">
                  {assessment.stats.generousPercent}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
                {assessment.stats.generousCount}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-sans">
                Boundary regions
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-md bg-rose-50/80 border border-rose-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] sm:text-xs font-bold text-rose-900">Disallowed Outliers</span>
                <span className="text-xs font-bold text-rose-700 font-mono">
                  {assessment.stats.outlierPercent}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-rose-950 font-mono">
                {assessment.stats.outlierCount}
              </div>
              <p className="text-[10px] text-rose-800/80 mt-1 font-sans">
                Severe steric clash zones
              </p>
            </div>
          </div>
        </div>

        {/* Polished Interactive Ramachandran Plot */}
        <RamachandranPlot
          residues={assessment.residues}
          structureTitle={assessment.title}
          chains={assessment.chains}
        />
      </div>
    </main>
  );
}

export default function ProtAssessResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-teal-800 border-t-transparent" />
          <p className="mt-4 text-xs font-medium text-slate-600">Loading structure assessment...</p>
        </div>
      </div>
    }>
      <ProtAssessResultsInner />
    </Suspense>
  );
}
