import React from 'react';
import Link from 'next/link';
import { ArrowRight, Dna, FlaskConical, Sparkles, Activity, ShieldCheck, Database } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-teal-900 to-slate-900 text-white pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Decorative background grid and glowing orbs */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>Open Science & Computational Biology Lab</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Advancing Discovery with{" "}
            <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-100 bg-clip-text text-transparent">
              Sciencelet Lab
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-teal-100/80 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            We engineer high-performance computational tools, sequence analytics algorithms, and reproducible pipelines to decode the complexities of biological systems.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-14">
            <Link
              href="/protchem"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-400/35 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Dna className="w-5 h-5 text-slate-950" />
              Launch ProtChem Tool
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
            <a
              href="#research"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-teal-900/60 hover:bg-teal-800/80 border border-teal-500/30 text-teal-100 font-medium transition-all backdrop-blur-sm"
            >
              <FlaskConical className="w-5 h-5 text-teal-300" />
              Explore Research
            </a>
          </div>

          {/* Highlights / Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-teal-800/60 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-teal-900/30 border border-teal-700/30 backdrop-blur-sm text-left">
              <div className="flex items-center gap-2 text-teal-300 mb-1">
                <Activity className="w-4 h-4 text-teal-400" />
                <span className="text-2xl font-bold text-white">30+</span>
              </div>
              <p className="text-xs text-teal-200/80 font-medium">Physicochemical Indices</p>
            </div>

            <div className="p-4 rounded-xl bg-teal-900/30 border border-teal-700/30 backdrop-blur-sm text-left">
              <div className="flex items-center gap-2 text-teal-300 mb-1">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span className="text-2xl font-bold text-white">100%</span>
              </div>
              <p className="text-xs text-teal-200/80 font-medium">Peer-Reviewed Models</p>
            </div>

            <div className="p-4 rounded-xl bg-teal-900/30 border border-teal-700/30 backdrop-blur-sm text-left">
              <div className="flex items-center gap-2 text-teal-300 mb-1">
                <Database className="w-4 h-4 text-teal-400" />
                <span className="text-2xl font-bold text-white">Instant</span>
              </div>
              <p className="text-xs text-teal-200/80 font-medium">Client-Side Analytics</p>
            </div>

            <div className="p-4 rounded-xl bg-teal-900/30 border border-teal-700/30 backdrop-blur-sm text-left">
              <div className="flex items-center gap-2 text-teal-300 mb-1">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-2xl font-bold text-white">Open</span>
              </div>
              <p className="text-xs text-teal-200/80 font-medium">CC BY-NC 4.0 Accessible</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
