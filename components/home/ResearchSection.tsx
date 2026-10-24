import { Network, Microscope, Layers, Binary } from 'lucide-react';

const researchDomains = [
  {
    title: "Protein Analytics & Biophysics",
    description: "Developing robust computational routines to calculate stability, hydrophobicity patterns, isoelectric trends, and conformational propensity from primary sequences.",
    icon: Microscope,
    tag: "Sequence Informatics",
    points: ["Physicochemical profiling", "Secondary structure propensity", "Stability & turnover modeling"]
  },
  {
    title: "Structural Modeling & Docking",
    description: "Applying structural bioinformatics to predict macromolecular interfaces, binding affinities, and ligand interactions for therapeutic discovery.",
    icon: Layers,
    tag: "Structure & Folding",
    points: ["Protein-ligand interactions", "Active site characterization", "Binding free energy estimates"]
  },
  {
    title: "Genomics & Variant Calling",
    description: "Creating scalable pipelines to identify single nucleotide variants, indel dynamics, and transcriptomic shifts across diverse model organisms.",
    icon: Binary,
    tag: "Next-Gen Sequencing",
    points: ["High-throughput sequencing analysis", "Variant annotation", "Population genetics pipelines"]
  },
  {
    title: "Systems Biology & Pathways",
    description: "Synthesizing multi-omics layers into topological regulatory networks to model signaling cascades and identify key biological regulators.",
    icon: Network,
    tag: "Network Biology",
    points: ["Metabolic pathway analysis", "PPI network topology", "Multi-omics integration"]
  }
];

const ResearchSection = () => {
  return (
    <section id="research" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-3">
            Core Investigation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sciencelet Lab Research Areas
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Bridging fundamental biochemistry and modern computational power to address complex challenges in biological discovery.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {researchDomains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <div 
                key={index}
                className="group relative p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {domain.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                    {domain.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                    {domain.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <ul className="space-y-2">
                    {domain.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-center text-xs sm:text-sm text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2.5"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
