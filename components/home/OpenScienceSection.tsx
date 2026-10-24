import { BookOpenCheck, ExternalLink, ShieldAlert, HeartHandshake } from 'lucide-react';

const references = [
  { metric: "Isoelectric point (pI)", citation: "Bjellqvist et al. (1993)", link: "https://pubmed.ncbi.nlm.nih.gov/8563639/", source: "Electrophoresis 14, 1023-1031" },
  { metric: "Instability index", citation: "Guruprasad et al. (1990)", link: "https://pubmed.ncbi.nlm.nih.gov/2075190/", source: "Protein Engineering 4, 155-161" },
  { metric: "GRAVY & Hydropathy", citation: "Kyte & Doolittle (1982)", link: "https://pubmed.ncbi.nlm.nih.gov/7108955/", source: "J Mol Biol 157, 105-132" },
  { metric: "Aliphatic index", citation: "Ikai (1980)", link: "https://pubmed.ncbi.nlm.nih.gov/7462208/", source: "J Biochem 88, 1895-1898" },
  { metric: "Extinction coefficient", citation: "Pace et al. (1995)", link: "https://pubmed.ncbi.nlm.nih.gov/8563639/", source: "Protein Sci 11, 2411-2423" },
  { metric: "Hydrophobic moment", citation: "Eisenberg et al. (1984)", link: "https://pubmed.ncbi.nlm.nih.gov/6582470/", source: "J Mol Biol 179, 125-142" }
];

const OpenScienceSection = () => {
  return (
    <section className="py-16 bg-slate-100/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Scientific Foundation */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Scientific Literature & Rigorous Foundations
              </h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Sciencelet Lab computational engines implement validated algorithms directly derived from peer-reviewed publications:
            </p>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {references.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-teal-300 transition-colors">
                  <div className="text-xs font-semibold text-teal-800">{item.metric}</div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900 hover:underline mt-1"
                  >
                    <span>{item.citation}</span>
                    <ExternalLink className="w-3 h-3 text-teal-500" />
                  </a>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.source}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ethics, Disclaimer, Contact */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h4 className="text-base">Scientific Integrity & Disclaimer</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sciencelet Lab computational tools are created for academic, scientific research, and educational purposes. While models adhere to standard empirical algorithms, outcomes should complement experimental wet-lab verification.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-900 to-teal-950 rounded-2xl p-6 sm:p-7 text-white shadow-sm border border-teal-800">
              <div className="flex items-center gap-2 font-bold mb-2">
                <HeartHandshake className="w-4 h-4 text-teal-300" />
                <h4 className="text-base text-white">Join & Support Sciencelet Lab</h4>
              </div>
              <p className="text-xs text-teal-100/80 leading-relaxed mb-4">
                Sciencelet Lab is an open community-focused computational initiative. We welcome contributions, algorithm implementations, and academic collaborations.
              </p>
              <div className="text-xs text-teal-200">
                Primary contact: <a href="mailto:mehedy.1872@gmail.com" className="text-white underline font-semibold hover:text-teal-200">Md Mehedy Hasan Miraz</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenScienceSection;
