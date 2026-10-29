import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProtIndex - Protein Sequence & Physicochemical Properties Calculator",
  description:
    "ProtIndex is a high-throughput sequence analytics engine calculating 30+ physicochemical and biophysical parameters directly from raw or FASTA protein and peptide sequences. Compute isoelectric point (pI), molecular weight, GRAVY hydropathy, charge curves, and stability in real time.",
  keywords: [
    "ProtIndex",
    "Protein Sequence Analysis",
    "Physicochemical Properties Calculator",
    "Isoelectric Point Calculator",
    "Molecular Weight Calculator",
    "GRAVY Score",
    "Peptide Sequence Analysis",
    "Protein Stability Index",
    "Helical Wheel Projection",
    "Net Charge Curve",
    "Bioinformatics Tools",
    "Sciencelet Lab"
  ],
  alternates: {
    canonical: "/protindex",
  },
  openGraph: {
    title: "ProtIndex - Protein Sequence & Physicochemical Properties Calculator",
    description:
      "Compute 30+ physicochemical and biophysical parameters directly from raw or FASTA protein and peptide sequences. Real-time, privacy-preserving computational sequence analytics.",
    url: "https://lab.sciencelet.org/protindex",
    siteName: "Sciencelet Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProtIndex - Protein Sequence & Physicochemical Properties Calculator",
    description:
      "Compute 30+ physicochemical and biophysical parameters directly from raw or FASTA protein and peptide sequences in real time.",
  },
};

export default function ProtIndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

