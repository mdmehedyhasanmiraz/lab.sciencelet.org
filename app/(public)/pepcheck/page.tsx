"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Dna, ArrowRight } from "lucide-react";

export default function PepCheckInputPage() {
  const [sequence, setSequence] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSequence = sequence.toUpperCase().replace(/[^A-Z]/g, "");
    
    if (cleanSequence.length === 0) {
      setError("Please enter a valid protein sequence");
      return;
    }

    if (cleanSequence.length > 10000) {
      setError("Sequence too long (max 10,000 residues)");
      return;
    }

    // Navigate to results page with sequence
    router.push(`/pepcheck/results?sequence=${encodeURIComponent(cleanSequence)}`);
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Science-backed algorithms</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              PepCheck
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Comprehensive physicochemical analysis of protein and peptide sequences
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>30+ Parameters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Scientific References</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Peer-reviewed Methods</span>
              </div>
            </div>
          </div>

          {/* Input Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
            
            <form onSubmit={handleSubmit} className="relative bg-white rounded-2xl shadow-2xl shadow-slate-900/10 p-8 sm:p-10 border border-slate-200/50">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <Dna className="w-6 h-6" />
                </div>
                <div>
                  <label htmlFor="sequence" className="block text-lg font-semibold text-slate-900">
                    Enter Protein Sequence
                  </label>
                  <p className="text-sm text-slate-600 mt-1">
                    Paste FASTA format or raw amino acid sequence
                  </p>
                </div>
              </div>

              <textarea
                id="sequence"
                value={sequence}
                onChange={(e) => {
                  setSequence(e.target.value);
                  setError("");
                }}
                rows={10}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl shadow-sm font-mono text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50"
                placeholder={`>sp|P12345|Example_Protein
MAVMAPRTLLLLLSGALALTQTWAGSHSMRYFSTSVSRPGRGEPRFISVGYVDDTQFVR
FDSDAASPRGEPRAPWVEQEGPEYWDRETQSAKEVVKKDQGQGPEVWDRETQSAKEVVK`}
                required
              />

              {error && (
                <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="group flex-1 relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 overflow-hidden"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    Analyze Sequence
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSequence(`MAVMAPRTLLLLLSGALALTQTWAGSHSMRYFSTSVSRPGRGEPRFISVGYVDDTQFVRFDSDAASPRGEPRAPWVEQEGPEYWDRETQSAKEVVK`);
                    setError("");
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors border border-slate-200"
                >
                  Try Example
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Computed metrics:</strong> Molecular weight, pI, GRAVY, aliphatic index, 
                  instability index, extinction coefficients, N-end rule half-life, net charge, hydrophobic moment, 
                  aromaticity, aggregation & solubility heuristics, and more.
                </p>
              </div>
            </form>
          </div>

          {/* Feature Grid */}
          <div className="mt-16 grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Accurate Calculations",
                desc: "Uses Bjellqvist pKa sets, Guruprasad DIWV, and validated hydropathy scales",
                icon: "🔬"
              },
              {
                title: "Scientific References",
                desc: "Every metric links to primary literature (Kyte-Doolittle, Ikai, etc.)",
                icon: "📚"
              },
              {
                title: "Export & Share",
                desc: "Shareable result URLs for reproducible analysis",
                icon: "🔗"
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
