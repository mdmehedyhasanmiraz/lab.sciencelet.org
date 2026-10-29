import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProtIndex Results - Sequence Analytics & Properties Breakdown",
  description:
    "Comprehensive physicochemical breakdown, hydropathy plots, charge curves, helical wheel projections, and amino acid composition computed by ProtIndex.",
  keywords: [
    "ProtIndex Results",
    "Protein Analysis Report",
    "Hydropathy Plot",
    "Net Charge Curve",
    "Amino Acid Composition",
    "Helical Wheel",
    "Biophysical Profile",
    "Sciencelet Lab"
  ],
  alternates: {
    canonical: "/protindex/results",
  },
  openGraph: {
    title: "ProtIndex Results - Sequence Analytics & Properties Breakdown",
    description:
      "Interactive physicochemical analysis, hydropathy plots, charge curves, and helical wheel projections computed with ProtIndex.",
    url: "https://lab.sciencelet.org/protindex/results",
    siteName: "Sciencelet Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProtIndex Results - Sequence Analytics & Properties Breakdown",
    description:
      "Interactive physicochemical analysis, hydropathy plots, charge curves, and helical wheel projections computed with ProtIndex.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProtIndexResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

