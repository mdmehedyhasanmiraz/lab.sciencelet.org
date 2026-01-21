'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="bg-white rounded-xl shadow-lg shadow-slate-900/5 border border-slate-200/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-slate-900">{title}</span>
        <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`transition-all overflow-hidden ${
          isOpen ? 'max-h-[2000px] px-6 py-4 border-t border-slate-100' : 'max-h-0'
        }`}
      >
        {children}
      </div>
    </section>
  );
}
