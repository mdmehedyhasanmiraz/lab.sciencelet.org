'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dna, Menu, X } from 'lucide-react';

const navLinks = [
  { label: "Home", route: "/" },
  { label: "PepCheck", route: "/pepcheck"},
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:shadow-xl transition-shadow">
            <Dna className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
            Bioinformatics Tools
          </h1>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.route}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <ul className="py-4 px-4 space-y-2">
            {navLinks.map((item) => (
              <li key={item.route}>
                <Link 
                  href={item.route} 
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
