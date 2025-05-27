export default function CreditsSection() {
    return (
      <section className="bg-green-50 text-green-900 px-6 py-12 mt-16 border-t border-green-200">
        <div className="max-w-5xl mx-auto space-y-12 text-sm md:text-base leading-relaxed">
          {/* Disclaimer */}
          <div>
            <h2 className="text-lg font-bold text-green-800 mb-2">Disclaimer</h2>
            <p>
              PepCheck is a computational tool for analyzing protein and peptide sequences using biochemical and biophysical properties.
              It is designed solely for educational and research purposes. The results provided are based on standard empirical formulas and should not be used as a substitute for wet-lab validation or expert biological interpretation.
            </p>
          </div>
  
          {/* Contact */}
          <div>
            <h2 className="text-lg font-bold text-green-800 mb-2">Contact</h2>
            <p>
              For technical support, feedback, or scientific questions regarding PepCheck, please contact
              <a href="mailto:tahsinrisat2001@gmail.com" className="text-green-600 ml-1">Md Tahsinul Haque Risat</a> or
              <a href="mailto:mehedy.1872@gmail.com" className="text-green-600 ml-1">Md Mehedy Hasan Miraz</a>.
              We welcome contributions, bug reports, and suggestions to improve the platform.
            </p>
          </div>
  
          {/* Funding */}
          <div>
            <h2 className="text-lg font-bold text-green-800 mb-2">Funding</h2>
            <p>
              PepCheck is a self-initiated and self-funded project by its contributors. It was developed as part of an effort to enhance accessible bioinformatics tools for protein sequence analysis.
              No external grants or institutional funding were received during its development.
            </p>
          </div>
  
          {/* Attribution */}
          <div>
            <h2 className="text-lg font-bold text-green-800 mb-2">Attribution</h2>
            <p>
              PepCheck incorporates knowledge and methods derived from publicly available biochemical data and bioinformatics principles. 
              Core concepts were adapted from well-established tools like
              <a href="https://web.expasy.org/protparam/" target="_blank" rel="noopener noreferrer" className="text-green-600 ml-1">ExPASy ProtParam</a>.
              Additional references include standard protein property indices, amino acid composition charts, and solubility predictors.
            </p>
          </div>
        </div>
      </section>
    );
  }
  