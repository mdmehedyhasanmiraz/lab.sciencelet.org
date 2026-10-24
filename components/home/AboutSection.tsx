import { Target, Lightbulb, Compass } from 'lucide-react';

const AboutSection = () => {
  const pillars = [
    {
      icon: Target,
      title: "Our Mission",
      description: "Sciencelet Lab is dedicated to advancing computational biology by creating accessible, reproducible, and verifiable analytical software for researchers worldwide."
    },
    {
      icon: Lightbulb,
      title: "Algorithmic Precision",
      description: "Every calculation in our tools faithfully mirrors peer-reviewed biophysical scales, citing established literature from Bjellqvist, Kyte-Doolittle, and Guruprasad."
    },
    {
      icon: Compass,
      title: "Open Discovery",
      description: "We strongly support open science. Our platforms are designed with transparency, open documentation, and permissive creative commons licensing."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 relative border-t border-teal-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-3">
            About The Lab
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Deciphering Complex Biology Through Computation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Sciencelet Lab bridges modern web engineering and molecular sciences, empowering researchers with instant computational insights into biomolecular structure and dynamics.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-8 border border-teal-100/80 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Lab Commitment Banner */}
        <div className="mt-16 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Commitment to Reproducible Science
              </h3>
              <p className="text-sm sm:text-base text-teal-100/80 leading-relaxed">
                We believe scientific software should be transparent, deterministic, and freely verifiable. From amino acid compositions to hydropathy indices, our methods are systematically documented.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <a
                href="mailto:mehedy.1872@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-all shadow-md"
              >
                Collaborate With Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
