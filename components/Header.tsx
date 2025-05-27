'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: "Home", route: "/" },
  { label: "PepCheck", route: "/pepcheck"},
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-3">
        {/* Logo */}
        {/* <div className="flex-shrink-0">
          <Link href="/">
            <Image src="/logos/logo-floramedix.svg" alt="Logo" width={180} height={50} />
          </Link>
        </div> */}
        <Link href="/"><h1 className="text-2xl font-bold">Bioinformatics Tools</h1></Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-1 relative">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative group"
            >
              
            <Link
              href={link.route}
              className="flex items-center gap-1 text-gray-800 hover:text-black transition font-semibold hover:bg-gray-100 border border-white hover:border-gray-100 px-4 py-2 rounded-md"
            >
              {link.label}
            </Link>

            </div>
          ))}
        </nav>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 hover:text-blue-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>


      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-lg">
          <ul className="space-y-4 py-4 px-6">
            {navLinks.map((item) => (
              <li key={item.route}>
                <Link href={item.route} className="block text-gray-800 hover:text-blue-600 transition font-medium">
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
