export default function CreditsSection() {
    return (
      <section className="bg-gray-50 text-gray-900 px-6 py-12 mt-16 border-t border-gray-200">
        <div className="max-w-5xl mx-auto space-y-12 text-sm md:text-base leading-relaxed">
          {/* Disclaimer */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Disclaimer</h2>
            <p>
              ProtIndex is a computational tool for analyzing protein and peptide sequences using biochemical and biophysical properties.
              It is designed solely for educational and research purposes. The results provided are based on standard empirical formulas and should not be used as a substitute for wet-lab validation or expert biological interpretation.
            </p>
          </div>
  
          {/* Contact */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Contact</h2>
            <p>
              For technical support, feedback, or scientific questions regarding ProtIndex, please contact{" "}
              <a href="mailto:tanbin.jahan.ferdousy@gmail.com" className="text-green-600">Tanbin Jahan Ferdousy</a>,{" "}
              <a href="mailto:mehedy.1872@gmail.com" className="text-green-600">Md Mehedy Hasan Miraz</a>, or{" "}
              <a href="mailto:tahsinul.haque2001@gmail.com" className="text-green-600">Md Tahsinul Haque Risat</a>. 
              We welcome contributions, bug reports, and suggestions to improve the platform.
            </p>
          </div>
  
          {/* Funding */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Funding</h2>
            <p>
              ProtIndex is a self-initiated and self-funded project by its contributors. It was developed as part of an effort to enhance accessible bioinformatics tools for protein sequence analysis.
              No external grants or institutional funding were received during its development.
            </p>
          </div>
  
          {/* Scientific References */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Scientific References</h2>
            <p>
              ProtIndex implements established algorithms and methods from peer-reviewed scientific literature:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                <strong>Isoelectric point (pI):</strong>{" "}
                <a href="https://pubmed.ncbi.nlm.nih.gov/8563639/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Bjellqvist et al. (1993)
                </a> - Electrophoresis 14, 1023-1031
              </li>
              <li>
                <strong>Instability index:</strong>{" "}
                <a href="https://pubmed.ncbi.nlm.nih.gov/2075190/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Guruprasad et al. (1990)
                </a> - Protein Engineering 4, 155-161
              </li>
              <li>
                <strong>Aliphatic index:</strong>{" "}
                <a href="https://pubmed.ncbi.nlm.nih.gov/7462208/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Ikai (1980)
                </a> - J Biochem 88, 1895-1898
              </li>
              <li>
                <strong>Extinction coefficient:</strong>{" "}
                <a href="https://pubmed.ncbi.nlm.nih.gov/2610349/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Gill & von Hippel (1989)
                </a> - Anal Biochem 182, 319-326; {" "}
                <a href="https://pubmed.ncbi.nlm.nih.gov/8563639/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Pace et al. (1995)
                </a> - Protein Sci 11, 2411-2423
              </li>
              <li>
                <strong>N-end rule half-life:</strong>{" "}
                <a href="https://pubmed.ncbi.nlm.nih.gov/3018930/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Bachmair et al. (1986)
                </a> - Science 234, 179-186; {" "}
                <a href="https://pubmed.ncbi.nlm.nih.gov/9112437/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Varshavsky (1997)
                </a> - Genes Cells 2, 13-28
              </li>
              <li>
                <strong>Hydrophobic moment:</strong>{" "}
                <a href="https://pubmed.ncbi.nlm.nih.gov/6582470/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Eisenberg et al. (1984)
                </a> - J Mol Biol 179, 125-142
              </li>
              <li>
                <strong>GRAVY (hydropathy):</strong>{" "}
                <a href="https://pubmed.ncbi.nlm.nih.gov/7108955/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Kyte & Doolittle (1982)
                </a> - J Mol Biol 157, 105-132
              </li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              <em>Note:</em> Solubility and aggregation risk values are deterministic heuristics based on compositional analysis 
              and should be treated as qualitative guidance rather than experimental measurements.
            </p>
          </div>
        </div>
      </section>
    );
  }
  