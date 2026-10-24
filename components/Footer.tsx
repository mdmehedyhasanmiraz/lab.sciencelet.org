import Link from 'next/link';
import Image from 'next/image';
import { Github, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-teal-950 text-teal-100 border-t border-teal-900/80">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              {/* White Sciencelet SVG Logo */}
              <div className="relative flex items-center">
                <Image
                  src="/logos/logo-sciencelet-w.svg"
                  alt="Sciencelet"
                  width={140}
                  height={26}
                  className="h-6 w-auto object-contain"
                />
              </div>

              {/* "Lab" to the right */}
              <span className="text-sm uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-teal-800 text-teal-50 ml-0.5">
                Lab
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-teal-200/80 max-w-md leading-relaxed">
              Open-access computational biology and bioinformatics research laboratory developing algorithmic solutions, protein sequence analysis tools, and genomic pipelines.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-3">Resources & Tools</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/protchem" className="hover:text-white transition-colors">
                  ProtChem Analyzer
                </Link>
              </li>
              <li>
                <a href="#research" className="hover:text-white transition-colors">
                  Research Areas
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Sciencelet Lab
                </a>
              </li>
            </ul>
          </div>

          {/* Open Science & Connect */}
          <div>
            <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-3">Community</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a 
                  href="https://github.com/mdmehedyhasanmiraz/lab.oimi.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-teal-400" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href="mailto:mehedy.1872@gmail.com"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  Contact Researchers
                </a>
              </li>
              <li>
                <a 
                  href="https://sciencelet.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-teal-400" />
                  Sciencelet Main Portal
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-teal-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-teal-300/80">
          <div>
            <p>
              &copy; {new Date().getFullYear()} <strong className="text-white">Sciencelet Lab</strong>. All rights reserved.
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p>
              Open source & research content licensed under{' '}
              <a 
                href="http://creativecommons.org/licenses/by-nc/4.0/" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-200 hover:text-white underline decoration-teal-500 hover:decoration-teal-300 transition-colors"
              >
                CC BY-NC 4.0
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
