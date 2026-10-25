"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  RotateCcw,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Download,
  Activity
} from "lucide-react";
import {
  parsePDBAndCalculateRamachandran
} from "@/lib/utils/pdbParser";

// Preset PDB Structure: Crambin (1CRN) - High-resolution benchmark protein
const CRAMBIN_1CRN_SAMPLE = `HEADER    PLANT SEED PROTEIN                      30-APR-81   1CRN              
TITLE     WATER STRUCTURE OF A HYDROPHOBIC PROTEIN AT ATOMIC            
TITLE    2 RESOLUTION. PENTANE-BASED PHASING AND REFINEMENT OF 0.54A    
TITLE    3 X-RAY STRUCTURE OF CRAMBIN                                    
COMPND    MOL_ID: 1;                                                    
COMPND   2 MOLECULE: CRAMBIN;                                           
COMPND   3 CHAIN: A;                                                    
SOURCE    MOL_ID: 1;                                                    
SOURCE   2 ORGANISM_SCIENTIFIC: ABYSSINIAN KALE;                        
SOURCE   3 ORGANISM_TAXID: 3719                                         
KEYWDS    PLANT SEED PROTEIN, HYDROPHOBIC, ATOMIC RESOLUTION            
EXPDTA    X-RAY DIFFRACTION                                             
AUTHOR    M.M.TEETER,W.A.HENDRICKSON                                    
REVDAT   1   06-OCT-81 1CRN    0                                        
ATOM      1  N   THR A   1      17.047  14.099   3.625  1.00 13.79           N  
ATOM      2  CA  THR A   1      16.967  12.784   4.338  1.00 10.80           C  
ATOM      3  C   THR A   1      15.685  12.755   5.133  1.00  9.19           C  
ATOM      4  O   THR A   1      15.268  13.825   5.594  1.00  9.85           O  
ATOM      5  CB  THR A   1      18.170  12.703   5.337  1.00 13.02           C  
ATOM      6  OG1 THR A   1      19.334  12.829   4.463  1.00 15.06           O  
ATOM      7  CG2 THR A   1      18.150  11.456   6.216  1.00 13.79           C  
ATOM      8  N   THR A   2      15.115  11.555   5.265  1.00  7.81           N  
ATOM      9  CA  THR A   2      13.856  11.469   6.066  1.00  8.28           C  
ATOM     10  C   THR A   2      14.164  10.785   7.379  1.00  8.28           C  
ATOM     11  O   THR A   2      14.993   9.862   7.443  1.00  8.49           O  
ATOM     12  CB  THR A   2      12.732  10.708   5.224  1.00  9.07           C  
ATOM     13  OG1 THR A   2      13.129  10.669   3.851  1.00 10.77           O  
ATOM     14  CG2 THR A   2      11.396  11.442   5.317  1.00 10.74           C  
ATOM     15  N   CYS A   3      13.488  11.241   8.417  1.00  8.13           N  
ATOM     16  CA  CYS A   3      13.660  10.707   9.790  1.00  7.87           C  
ATOM     17  C   CYS A   3      12.607   9.638  10.046  1.00  7.36           C  
ATOM     18  O   CYS A   3      11.751   9.413   9.186  1.00  7.32           O  
ATOM     19  CB  CYS A   3      13.567  11.838  10.820  1.00  8.26           C  
ATOM     20  SG  CYS A   3      14.887  13.064  10.590  1.00 10.14           S  
ATOM     21  N   CYS A   4      12.696   8.972  11.200  1.00  7.09           N  
ATOM     22  CA  CYS A   4      11.712   7.935  11.530  1.00  7.05           C  
ATOM     23  C   CYS A   4      10.370   8.591  11.860  1.00  7.06           C  
ATOM     24  O   CYS A   4      10.320   9.771  12.247  1.00  7.58           O  
ATOM     25  CB  CYS A   4      12.235   7.086  12.693  1.00  7.33           C  
ATOM     26  SG  CYS A   4      13.684   6.068  12.259  1.00  9.74           S  
ATOM     27  N   PRO A   5       9.271   7.839  11.710  1.00  6.99           N  
ATOM     28  CA  PRO A   5       7.935   8.351  12.023  1.00  7.35           C  
ATOM     29  C   PRO A   5       7.712   8.544  13.518  1.00  7.68           C  
ATOM     30  O   PRO A   5       8.349   7.848  14.307  1.00  8.27           O  
ATOM     31  CB  PRO A   5       7.042   7.250  11.442  1.00  7.91           C  
ATOM     32  CG  PRO A   5       7.788   6.002  11.666  1.00  7.98           C  
ATOM     33  CD  PRO A   5       9.141   6.467  11.264  1.00  7.12           C  
ATOM     34  N   SER A   6       6.804   9.479  13.882  1.00  7.92           N  
ATOM     35  CA  SER A   6       6.471   9.761  15.282  1.00  8.53           C  
ATOM     36  C   SER A   6       5.127   9.083  15.602  1.00  8.53           C  
ATOM     37  O   SER A   6       4.629   8.305  14.779  1.00  8.94           O  
ATOM     38  CB  SER A   6       6.398  11.266  15.539  1.00  9.16           C  
ATOM     39  OG  SER A   6       5.385  11.839  14.727  1.00 11.22           O  
ATOM     40  N   ILE A   7       4.545   9.387  16.764  1.00  8.49           N  
ATOM     41  CA  ILE A   7       3.243   8.814  17.159  1.00  8.51           C  
ATOM     42  C   ILE A   7       2.127   9.630  16.516  1.00  8.88           C  
ATOM     43  O   ILE A   7       2.316  10.822  16.275  1.00  9.40           O  
ATOM     44  CB  ILE A   7       3.176   8.783  18.694  1.00  8.75           C  
ATOM     45  CG1 ILE A   7       4.275   7.842  19.227  1.00  9.68           C  
ATOM     46  CG2 ILE A   7       1.802   8.304  19.160  1.00  9.66           C  
ATOM     47  CD1 ILE A   7       4.279   7.659  20.730  1.00 12.02           C  
ATOM     48  N   VAL A   8       0.965   9.011  16.262  1.00  9.12           N  
ATOM     49  CA  VAL A   8      -0.165   9.714  15.656  1.00  9.99           C  
ATOM     50  C   VAL A   8       0.309  10.428  14.398  1.00 10.22           C  
ATOM     51  O   VAL A   8       0.392   9.817  13.336  1.00 10.51           O  
ATOM     52  CB  VAL A   8      -1.373   8.775  15.352  1.00 10.57           C  
ATOM     53  CG1 VAL A   8      -2.544   9.584  14.786  1.00 11.45           C  
ATOM     54  CG2 VAL A   8      -1.805   8.058  16.634  1.00 11.53           C  
ATOM     55  N   ALA A   9       0.618  11.716  14.512  1.00 10.45           N  
ATOM     56  CA  ALA A   9       1.082  12.493  13.364  1.00 10.98           C  
ATOM     57  C   ALA A   9       0.038  13.518  12.981  1.00 11.72           C  
ATOM     58  O   ALA A   9      -0.569  14.167  13.829  1.00 12.07           O  
ATOM     59  CB  ALA A   9       2.378  13.238  13.722  1.00 10.74           C  
ATOM     60  N   ARG A  10      -0.187  13.670  11.687  1.00 12.63           N  
ATOM     61  CA  ARG A  10      -1.161  14.614  11.196  1.00 14.15           C  
ATOM     62  C   ARG A  10      -0.817  16.037  11.649  1.00 14.86           C  
ATOM     63  O   ARG A  10       0.264  16.290  12.181  1.00 15.00           O  
ATOM     64  CB  ARG A  10      -1.285  14.551   9.664  1.00 14.48           C  
ATOM     65  CG  ARG A  10      -1.745  13.208   9.103  1.00 15.82           C  
ATOM     66  CD  ARG A  10      -1.782  13.243   7.568  1.00 17.07           C  
ATOM     67  NE  ARG A  10      -2.458  12.074   7.026  1.00 18.99           N  
ATOM     68  CZ  ARG A  10      -3.766  11.905   6.839  1.00 20.37           C  
ATOM     69  NH1 ARG A  10      -4.577  12.836   7.145  1.00 21.68           N  
ATOM     70  NH2 ARG A  10      -4.275  10.793   6.347  1.00 20.60           N  
ATOM     71  N   SER A  11      -1.758  16.953  11.455  1.00 15.69           N  
ATOM     72  CA  SER A  11      -1.579  18.349  11.838  1.00 16.59           C  
ATOM     73  C   SER A  11      -1.464  19.245  10.604  1.00 16.71           C  
ATOM     74  O   SER A  11      -2.285  19.208   9.680  1.00 16.89           O  
ATOM     75  CB  SER A  11      -2.730  18.847  12.721  1.00 17.18           C  
ATOM     76  OG  SER A  11      -2.887  18.009  13.856  1.00 18.42           O  
ATOM     77  N   ASN A  12      -0.428  20.070  10.597  1.00 16.84           N  
ATOM     78  CA  ASN A  12      -0.198  20.970   9.470  1.00 17.04           C  
ATOM     79  C   ASN A  12       1.272  21.365   9.444  1.00 16.94           C  
ATOM     80  O   ASN A  12       2.025  21.054  10.364  1.00 17.02           O  
ATOM     81  CB  ASN A  12      -0.654  20.364   8.127  1.00 17.58           C  
ATOM     82  CG  ASN A  12      -0.413  21.326   6.980  1.00 18.23           C  
ATOM     83  OD1 ASN A  12       0.718  21.603   6.602  1.00 18.59           O  
ATOM     84  ND2 ASN A  12      -1.488  21.849   6.417  1.00 18.54           N  
ATOM     85  N   PHE A  13       1.674  22.046   8.375  1.00 16.63           N  
ATOM     86  CA  PHE A  13       3.048  22.503   8.215  1.00 16.19           C  
ATOM     87  C   PHE A  13       3.266  23.829   9.011  1.00 15.68           C  
ATOM     88  O   PHE A  13       4.417  24.238   9.183  1.00 16.03           O  
ATOM     89  CB  PHE A  13       3.385  22.716   6.732  1.00 16.27           C  
ATOM     90  CG  PHE A  13       4.839  23.018   6.467  1.00 16.22           C  
ATOM     91  CD1 PHE A  13       5.362  24.288   6.734  1.00 16.04           C  
ATOM     92  CD2 PHE A  13       5.696  22.039   5.949  1.00 16.32           C  
ATOM     93  CE1 PHE A  13       6.702  24.582   6.495  1.00 16.23           C  
ATOM     94  CE2 PHE A  13       7.040  22.324   5.705  1.00 16.48           C  
ATOM     95  CZ  PHE A  13       7.545  23.599   5.980  1.00 16.26           C  
ATOM     96  N   ASN A  14       2.169  24.478   9.479  1.00 15.02           N  
ATOM     97  CA  ASN A  14       2.222  25.759  10.230  1.00 14.36           C  
ATOM     98  C   ASN A  14       2.285  25.568  11.751  1.00 13.91           C  
ATOM     99  O   ASN A  14       3.125  26.195  12.404  1.00 14.07           O  
TER     100      ASN A  14                                                      
END
`;

import { useRouter } from "next/navigation";

export default function ProtAssessPage() {
  const router = useRouter();
  const [pdbText, setPdbText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [pdbIdInput, setPdbIdInput] = useState("");
  const [isFetchingPdb, setIsFetchingPdb] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProcessPDB = (textToProcess: string, name?: string) => {
    if (!textToProcess.trim()) {
      setError("Please paste or upload a PDB structure file.");
      return;
    }

    if (!textToProcess.includes("ATOM  ")) {
      setError("Invalid PDB file: No ATOM records found. Please ensure the file contains coordinate lines.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const result = parsePDBAndCalculateRamachandran(textToProcess);

      if (result.analyzedResidues === 0) {
        setError("Could not compute backbone dihedral angles. Ensure continuous backbone atoms (N, CA, C) are present.");
        setIsLoading(false);
        return;
      }

      // Save to sessionStorage and navigate to /protassess/results
      if (typeof window !== "undefined") {
        sessionStorage.setItem("protassess_pdb_content", textToProcess);
        sessionStorage.setItem("protassess_pdb_name", name || uploadedFileName || result.title);
      }

      router.push("/protassess/results");
    } catch (err: unknown) {
      console.error(err);
      setError("An unexpected error occurred while parsing the PDB structure.");
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileExt = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();

    if (![".pdb", ".ent", ".txt"].includes(fileExt)) {
      setError("Please upload a .pdb, .ent, or .txt PDB coordinate file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPdbText(content);
        setUploadedFileName(fileName);
        setError("");
        handleProcessPDB(content, fileName);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the uploaded PDB file.");
    };
    reader.readAsText(file);
  };

  const fetchRCSBPdb = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = pdbIdInput.trim().toUpperCase();
    if (!id || id.length !== 4) {
      setError("Please enter a valid 4-character RCSB PDB ID (e.g. 1CRN).");
      return;
    }

    try {
      setIsFetchingPdb(true);
      setError("");
      const res = await fetch(`https://files.rcsb.org/download/${id}.pdb`);
      if (!res.ok) {
        throw new Error(`PDB entry ${id} not found on RCSB.`);
      }
      const text = await res.text();
      setPdbText(text);
      setUploadedFileName(`${id}.pdb (RCSB)`);
      handleProcessPDB(text, `${id}.pdb (RCSB PDB)`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to download PDB from RCSB.";
      setError(message);
    } finally {
      setIsFetchingPdb(false);
    }
  };

  const handleLoadSample = () => {
    setPdbText(CRAMBIN_1CRN_SAMPLE);
    setUploadedFileName("1CRN_sample.pdb (Crambin benchmark)");
    setError("");
    handleProcessPDB(CRAMBIN_1CRN_SAMPLE, "1CRN_sample.pdb (Crambin benchmark)");
  };

  const handleClear = () => {
    setPdbText("");
    setUploadedFileName(null);
    setError("");
    setPdbIdInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 pb-20">
      {/* Flat Teal Header matching ProtIndex */}
      <div className="bg-teal-900 text-white py-10 border-b border-teal-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-left">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            ProtAssess
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl">
            Evaluate protein structural quality, compute backbone dihedral torsion angles (φ, ψ, ω), and inspect Ramachandran distribution plots directly from uploaded PDB coordinates.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-5 relative z-20 space-y-8">
        {/* Input Form Card */}
        <div className="bg-white rounded-md shadow-sm p-6 sm:p-8 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                PDB Structure Input
              </h2>
              <p className="text-xs text-slate-500">
                Upload a structure file, fetch directly from RCSB PDB, or paste PDB coordinate records below.
              </p>
            </div>

            {pdbText && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Input</span>
              </button>
            )}
          </div>

          {/* Quick RCSB ID Fetcher Bar */}
          <form onSubmit={fetchRCSBPdb} className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 sm:max-w-xs">
              <input
                type="text"
                maxLength={4}
                value={pdbIdInput}
                onChange={(e) => setPdbIdInput(e.target.value)}
                placeholder="RCSB PDB ID (e.g. 1CRN)"
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-slate-300 rounded-md uppercase focus:border-teal-700 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isFetchingPdb || !pdbIdInput.trim()}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-medium rounded-md transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isFetchingPdb ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Fetch from RCSB</span>
                </>
              )}
            </button>

            <span className="text-xs text-slate-400 sm:mx-2 text-center sm:text-left">— or —</span>

            <button
              type="button"
              onClick={handleLoadSample}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-md border border-slate-200 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>Load 1CRN Benchmark</span>
            </button>
          </form>

          {/* Coordinate Text Area */}
          <div className="relative">
            <textarea
              value={pdbText}
              onChange={(e) => {
                setPdbText(e.target.value);
                setError("");
              }}
              rows={7}
              placeholder={`HEADER    PLANT SEED PROTEIN...
ATOM      1  N   THR A   1      17.047  14.099   3.625  1.00 13.79           N  
ATOM      2  CA  THR A   1      16.967  12.784   4.338  1.00 10.80           C  
ATOM      3  C   THR A   1      15.685  12.755   5.133  1.00  9.19           C  
ATOM      4  O   THR A   1      15.268  13.825   5.594  1.00  9.85           O  ...`}
              className={`w-full px-4 py-3 border rounded-md shadow-sm font-mono text-xs outline-none transition-colors leading-relaxed placeholder:text-slate-400 text-slate-800 ${error
                  ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                  : "border-slate-300 bg-slate-50/40 focus:border-teal-700"
                }`}
            />
          </div>

          {/* Upload Button area directly below textarea */}
          <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                id="pdb-file-upload"
                accept=".pdb,.ent,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 hover:border-teal-300 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-teal-700" />
                <span>Upload .pdb or .ent file</span>
              </button>

              {uploadedFileName && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  <CheckCircle2 className="w-3 h-3 text-teal-600" />
                  <span className="truncate max-w-[220px]">{uploadedFileName}</span>
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400">
              Supports multi-chain standard coordinate models
            </span>
          </div>

          {/* Error Message Banner */}
          {error && (
            <div className="mt-3 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-5">
            <button
              type="button"
              disabled={isLoading || !pdbText.trim()}
              onClick={() => handleProcessPDB(pdbText)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-medium rounded-md transition-colors text-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-200" />
                  <span>Computing Dihedral Torsions...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Analyze Ramachandran Conformations</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
