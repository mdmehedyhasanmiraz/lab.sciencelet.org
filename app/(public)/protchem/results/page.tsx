"use client"

import { Suspense } from "react";
import ResultsContent from "@/components/tools/ResultsContent";

export default function ProtChemResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-slate-600">Analyzing sequence...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

