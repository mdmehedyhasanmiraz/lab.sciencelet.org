import React from 'react';
import Link from 'next/link';
import { ArrowRight, Dna, Activity, Zap, CheckCircle2, FileSpreadsheet } from 'lucide-react';

const ToolsSection = () => {
  return (
    <section id="tools" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-3">
            Laboratory Tooling
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Flagship Computational Tools
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Interactive, privacy-first bioinformatics utilities developed at Sciencelet Lab for researchers, educators, and students.
          </p>
        </div>

        {/* Featured Tool Card */}
        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-500" />
          
          <div className="relative bg-white rounded-2xl border border-teal-100 shadow-xl overflow-hidden grid lg:grid-cols-12 gap-0">
            {/* Left Info Panel */}
            <div className="p-8 sm:p-10 lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-teal-500 text-white shadow-md shadow-teal-500/30">
                    <Dna className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">Active Release v1.0</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      ProtChem
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">
                  A high-throughput sequence analytics engine designed to compute over 30 physicochemical and biophysical parameters directly from raw or FASTA peptide and protein sequences.
                </p>

                {/* Key Capabilities List */}
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {[
                    "Isoelectric Point (pI) & Net Charge",
                    "Hydropathy (GRAVY) & Hydrophobic Moment",
                    "Extinction Coefficients & Half-Life",
                    "Instability, Aliphatic & Aromaticity Indices",
                    "Predicted Solubility & Aggregation Risk",
                    "Validated Peer-Reviewed Literature Citations"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-slate-100">
                <Link
                  href="/protchem"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md shadow-teal-600/20 transition-all text-sm group/btn"
                >
                  <span>Launch ProtChem</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/protchem"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                  <span>Try Demo Sequence</span>
                </Link>
              </div>
            </div>

            {/* Right Preview Showcase */}
            <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 p-8 sm:p-10 lg:col-span-5 text-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-teal-800/40">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-teal-800/60 mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">Metrics Output Preview</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-800/60 text-teal-300 font-mono">FASTA/RAW</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800/40 flex justify-between items-center">
                    <span className="text-teal-300/80">Molecular Weight</span>
                    <span className="text-white font-bold">11,245.8 Da</span>
                  </div>
                  <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800/40 flex justify-between items-center">
                    <span className="text-teal-300/80">Theoretical pI</span>
                    <span className="text-emerald-400 font-bold">6.82 (Bjellqvist)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800/40 flex justify-between items-center">
                    <span className="text-teal-300/80">Instability Index</span>
                    <span className="text-teal-200 font-bold">28.4 (Stable)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800/40 flex justify-between items-center">
                    <span className="text-teal-300/80">GRAVY Score</span>
                    <span className="text-teal-200 font-bold">-0.324 (Hydrophilic)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-teal-800/60 flex items-center gap-2 text-xs text-teal-300/80">
                <Zap className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Runs securely in your browser with zero latency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
