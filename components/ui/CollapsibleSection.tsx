'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

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
    <section className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer flex justify-between items-center px-4 py-3 bg-green-100 hover:bg-green-200 transition-colors text-left"
        aria-expanded={isOpen}
      >
        <span className="text-md font-semibold text-gray-800">{title}</span>
        {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>

      <div
        className={`transition-all px-4 overflow-hidden text-sm text-gray-700 ${
          isOpen ? 'max-h-[2000px] py-4' : 'max-h-0 py-0'
        }`}
      >
        {children}
      </div>
    </section>
  );
}
