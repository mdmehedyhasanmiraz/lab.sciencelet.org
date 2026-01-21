"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface InputAreaProps {
  onSubmit: (sequence: string) => void;
}

export default function InputArea({ onSubmit }: InputAreaProps) {
  const [sequence, setSequence] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSequence = sequence.toUpperCase().replace(/[^A-Z]/g, "");
    onSubmit(cleanSequence);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <label htmlFor="sequence" className="block text-base font-semibold text-gray-900">
          Protein/peptide sequence
        </label>
        <span className="text-xs text-gray-500">Canonical amino acids only (ACDEFGHIKLMNPQRSTVWY)</span>
      </div>

      <textarea
        id="sequence"
        value={sequence}
        onChange={(e) => setSequence(e.target.value)}
        rows={8}
        className="w-full p-4 border border-gray-200 rounded-xl shadow-sm font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        placeholder="Paste FASTA or raw sequence…"
        required
      />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">
          Tip: non-canonical letters are ignored for calculations.
        </p>
        <Button type="submit" variant="default" className="sm:w-auto w-full bg-green-600 hover:bg-green-700">
          Analyze
        </Button>
      </div>
    </form>
  );
}
