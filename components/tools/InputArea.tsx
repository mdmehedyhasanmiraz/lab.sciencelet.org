"use client";

import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="mb-6">
      <label htmlFor="sequence" className="block text-lg font-semibold mb-2">
        Enter Protein Sequence:
      </label>
      <textarea
        id="sequence"
        value={sequence}
        onChange={(e) => setSequence(e.target.value)}
        rows={6}
        className="w-full p-3 border rounded-md shadow-sm font-mono"
        placeholder="e.g., MAVMAPRTLLLLLSGALALTQTWAGSH..."
        required
      />
      <button
        type="submit"
        className="mt-4 px-6 py-2 md:w-32 sm:w-full bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition cursor-pointer"
      >
        Analyze
      </button>
    </form>
  );
}
