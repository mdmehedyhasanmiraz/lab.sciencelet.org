'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: "Home", route: "/" },
  { label: "ProtChem", route: "/protchem" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Sciencelet SVG Logo */}
          <div className="relative flex items-center">
            <Image
              src="/logos/logo-sciencelet.svg"
              alt="Sciencelet"
              width={140}
              height={26}
              priority
              className="h-6 w-auto object-contain"
            />
          </div>

          {/* "Lab" to the right of Sciencelet logo */}
          <span className="text-sm uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-teal-800 text-teal-50 ml-0.5">
            Lab
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.route}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-800 hover:bg-teal-50 rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
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
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-800 hover:bg-teal-50 rounded-md transition-colors"
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
