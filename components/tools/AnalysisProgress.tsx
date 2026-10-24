"use client";

import { useState, useEffect } from "react";
import { FlaskConical, CheckCircle2, Cpu } from "lucide-react";

interface LoadingProgressProps {
  onComplete: () => void;
  sequenceLength?: number;
}

const STEPS = [
  { label: "Parsing and validating FASTA residues", progress: 25 },
  { label: "Computing molecular weight and atomic composition", progress: 50 },
  { label: "Calculating theoretical pI and charge distribution", progress: 75 },
  { label: "Evaluating hydropathy, stability, and peer-reviewed indices", progress: 100 }
];

export default function AnalysisProgress({ onComplete, sequenceLength }: LoadingProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const stepDuration = 280; // Total loading ~ 1.2s - crisp and professional
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          const next = prev + 1;
          setProgress(STEPS[next].progress);
          return next;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 200);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-md border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Analyzing Protein Sequence
            </h2>
            <p className="text-xs text-slate-500">
              Sciencelet Lab Computational Engine {sequenceLength ? `(${sequenceLength} aa)` : ""}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5 font-mono">
            <span>Progress</span>
            <span className="text-teal-800">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
            <div 
              className="h-full bg-teal-800 transition-all duration-300 ease-out rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3 mb-6">
          {STEPS.map((step, idx) => {
            const isFinished = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="flex items-center gap-2.5 text-xs">
                {isFinished ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-teal-700 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className={isFinished ? "text-slate-500 line-through" : isCurrent ? "text-slate-900 font-semibold" : "text-slate-400"}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-teal-700 shrink-0" />
          <span>Bjellqvist, Guruprasad, and Kyte-Doolittle biophysical models</span>
        </div>
      </div>
    </div>
  );
}
