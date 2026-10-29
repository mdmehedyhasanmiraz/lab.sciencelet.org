import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProtAssess Results - Ramachandran Plot & Stereochemical Validation",
  description:
    "Interactive Ramachandran plot and stereochemical validation results computed by ProtAssess. Analyze favored, allowed, and outlier backbone dihedral torsion angles for protein PDB structures.",
  keywords: [
    "ProtAssess Results",
    "Ramachandran Plot Results",
    "PDB Structure Quality",
    "Stereochemical Assessment",
    "Dihedral Torsion Angles",
    "PROCHECK Regions",
    "Sciencelet Lab"
  ],
  alternates: {
    canonical: "/protassess/results",
  },
  openGraph: {
    title: "ProtAssess Results - Ramachandran Plot & Stereochemical Validation",
    description:
      "Interactive Ramachandran plot and stereochemical validation results computed by ProtAssess.",
    url: "https://lab.sciencelet.org/protassess/results",
    siteName: "Sciencelet Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProtAssess Results - Ramachandran Plot & Stereochemical Validation",
    description:
      "Interactive Ramachandran plot and stereochemical validation results computed by ProtAssess.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProtAssessResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

