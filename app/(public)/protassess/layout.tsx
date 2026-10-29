import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProtAssess - Protein Structure Assessment & Ramachandran Plot Analysis",
  description:
    "ProtAssess is a structural assessment and stereochemistry validation suite that parses PDB coordinate files to compute backbone dihedral torsion angles (phi, psi, omega) and generate publication-grade Ramachandran plots in real time.",
  keywords: [
    "ProtAssess",
    "Ramachandran Plot Generator",
    "Protein Structure Assessment",
    "PDB Parser",
    "Stereochemical Quality Validation",
    "Dihedral Angles Calculator",
    "Phi Psi Angles",
    "Structural Biology Tools",
    "Sciencelet Lab"
  ],
  alternates: {
    canonical: "/protassess",
  },
  openGraph: {
    title: "ProtAssess - Protein Structure Assessment & Ramachandran Plot Analysis",
    description:
      "Interactive PDB structure validation and publication-ready Ramachandran plot generator. Calculates backbone dihedral angles (phi, psi, omega) entirely client-side.",
    url: "https://lab.sciencelet.org/protassess",
    siteName: "Sciencelet Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProtAssess - Protein Structure Assessment & Ramachandran Plot Analysis",
    description:
      "Interactive PDB structure validation and publication-ready Ramachandran plot generator with PROCHECK classification.",
  },
};

export default function ProtAssessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

