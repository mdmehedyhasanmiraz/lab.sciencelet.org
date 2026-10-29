"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  RotateCcw,
  FileText,
  FlaskConical,
  Binary,
  AlertCircle,
  Loader2,
  Upload,
  CheckCircle2
} from "lucide-react";

const EXAMPLE_PROTEINS = [
  {
    name: "Human Insulin Precursor",
    tag: "FASTA",
    desc: "110 AA",
    seq: `>sp|P01308|INS_HUMAN Insulin precursor - Homo sapiens (Human)
MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAED
LQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN`
  },
  {
    name: "Ubiquitin",
    tag: "FASTA",
    desc: "76 AA",
    seq: `>sp|P0CG48|UBC_HUMAN Polyubiquitin-C - Homo sapiens (Human)
MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQRLIFAGKQLEDGRTLSDYN
IQKESTLHLVLRLRGG`
  },
  {
    name: "Beta-Endorphin",
    tag: "FASTA",
    desc: "31 AA",
    seq: `>sp|P01189|BEND_HUMAN Beta-endorphin (POMC 237-267)
YGGFMTSEKSQTPLVTLFKNAIIKNAYKKGE`
  }
];

export default function ProtIndexInputPage() {
  const [sequence, setSequence] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const parseFasta = (input: string): { isValidFasta: boolean; header: string; cleanSequence: string; errorMsg?: string } => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { isValidFasta: false, header: "", cleanSequence: "", errorMsg: "Please enter a FASTA formatted protein sequence." };
    }

    if (!trimmed.startsWith(">")) {
      return {
        isValidFasta: false,
        header: "",
        cleanSequence: "",
        errorMsg: "Input must start with a FASTA header line beginning with '>'"
      };
    }

    const lines = trimmed.split(/\r?\n/);
    const headerLine = lines[0].trim();
    const headerTitle = headerLine.substring(1).trim();

    if (!headerTitle) {
      return {
        isValidFasta: false,
        header: "",
        cleanSequence: "",
        errorMsg: "FASTA header description cannot be empty after '>'"
      };
    }

    const sequenceLines = lines.slice(1);
    if (sequenceLines.length === 0) {
      return {
        isValidFasta: false,
        header: "",
        cleanSequence: "",
        errorMsg: "No sequence data detected beneath the FASTA header."
      };
    }

    const rawResidues = sequenceLines.join("").replace(/\s+/g, "").toUpperCase();

    const invalidChars = rawResidues.replace(/[ACDEFGHIKLMNPQRSTVWYBZUX]/g, "");
    if (invalidChars.length > 0) {
      const uniqueInvalids = Array.from(new Set(invalidChars.split(""))).join(", ");
      return {
        isValidFasta: false,
        header: headerTitle,
        cleanSequence: "",
        errorMsg: `Sequence contains invalid non-amino-acid characters: ${uniqueInvalids}.`
      };
    }

    if (rawResidues.length < 2) {
      return {
        isValidFasta: false,
        header: headerTitle,
        cleanSequence: "",
        errorMsg: "FASTA sequence must contain at least 2 amino acid residues."
      };
    }

    if (rawResidues.length > 10000) {
      return {
        isValidFasta: false,
        header: headerTitle,
        cleanSequence: "",
        errorMsg: "Sequence exceeds maximum allowed length of 10,000 residues."
      };
    }

    return {
      isValidFasta: true,
      header: headerTitle,
      cleanSequence: rawResidues
    };
  };

  const parsed = parseFasta(sequence);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const result = parseFasta(sequence);

    if (!result.isValidFasta) {
      setError(result.errorMsg || "Invalid FASTA format.");
      return;
    }

    setIsLoading(true);
    router.push(`/protindex/results?sequence=${encodeURIComponent(result.cleanSequence)}`);
  };

  const handleClear = () => {
    setSequence("");
    setError("");
    setUploadedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const loadExample = (seq: string) => {
    setSequence(seq);
    setError("");
    setUploadedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension
    const validExtensions = [".fasta", ".fa", ".txt", ".seq"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExt) && !file.type.includes("text")) {
      setError("Please upload a .fasta, .fa, or .txt plain text file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSequence(content);
        setUploadedFileName(file.name);
        setError("");
      }
    };
    reader.onerror = () => {
      setError("Failed to read the uploaded file.");
    };
    reader.readAsText(file);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 pb-16">
      {/* Flat Teal Header */}
      <div className="bg-teal-900 text-white py-10 border-b border-teal-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-left">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            ProtIndex
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl">
            Physicochemical properties analysis of protein and peptide sequences.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-5 relative z-20">
        {/* Main Input Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-md shadow-sm p-6 sm:p-8 border border-slate-200"
        >
          {/* Header of Form with concise FASTA badge directly beside the label */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <label htmlFor="sequence-input" className="text-base sm:text-lg font-bold text-slate-900">
                Protein Sequence
              </label>

              {/* Concise FASTA requirement badge beside label */}
              <span className="text-xs px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                Requires FASTA format (<code className="font-mono font-bold">&gt;header</code> on line 1)
              </span>
            </div>

            {/* Status Indicator & Clear button */}
            <div className="flex items-center gap-2">
              {sequence.trim().length > 0 && (
                parsed.isValidFasta ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                    Valid FASTA ({parsed.cleanSequence.length} aa)
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Header missing
                  </span>
                )
              )}

              {sequence && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Clear sequence"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sequence Textarea */}
          <div className="relative">
            <textarea
              id="sequence-input"
              value={sequence}
              onChange={(e) => {
                setSequence(e.target.value);
                setError("");
              }}
              rows={9}
              className={`w-full px-4 py-3 border rounded-md shadow-sm font-mono text-xs sm:text-sm outline-none transition-colors leading-relaxed placeholder:text-slate-400 text-slate-800 ${error
                  ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                  : "border-slate-300 bg-slate-50/50 focus:border-teal-700"
                }`}
              placeholder={`>sp|P01308|INS_HUMAN Insulin precursor - Homo sapiens (Human)
MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAED
LQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN`}
              required
            />
          </div>

          {/* Upload Sequence File Option */}
          <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                id="fasta-file-upload"
                accept=".fasta,.fa,.txt,.seq"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 hover:border-teal-300 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-teal-700" />
                <span>Upload .fasta or .txt file</span>
              </button>

              {uploadedFileName && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  <CheckCircle2 className="w-3 h-3 text-teal-600" />
                  <span className="truncate max-w-[200px]">{uploadedFileName}</span>
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400">
              Plain text or FASTA format up to 5 MB
            </span>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mt-3 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Flat Actions */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-medium rounded-md transition-colors text-sm ${isLoading ? "opacity-90 cursor-wait" : "cursor-pointer"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-200" />
                  <span>Processing Sequence...</span>
                </>
              ) : (
                <>
                  <FlaskConical className="w-4 h-4" />
                  <span>Run Analysis</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => loadExample(EXAMPLE_PROTEINS[0].seq)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-md transition-colors border border-slate-300 text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Load Insulin Example</span>
            </button>
          </div>

          {/* Example FASTA presets */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2.5">
              <Binary className="w-4 h-4 text-teal-800" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Preset Reference FASTA Sequences
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {EXAMPLE_PROTEINS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadExample(item.seq)}
                  className="p-2.5 text-left rounded-md bg-slate-50 hover:bg-teal-50/60 border border-slate-200 hover:border-teal-400 transition-colors cursor-pointer group/preset"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-800 group-hover/preset:text-teal-900">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 font-mono">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
