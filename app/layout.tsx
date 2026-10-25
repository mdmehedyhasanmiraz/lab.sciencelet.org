import type { Metadata } from "next";
import { Geist_Mono, Funnel_Sans } from "next/font/google";
import "./globals.css";
import ogImage from './opengraph-image.png';

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sciencelet Lab | Computational Biology & Bioinformatics",
    template: "%s | Sciencelet Lab",
  },
  description: "Sciencelet Lab is a computational biology and bioinformatics research laboratory developing open-access analytical tools, algorithms, and biological sequence analytics.",
  metadataBase: new URL("https://lab.sciencelet.org"),
  keywords: [
    "Sciencelet Lab",
    "Sciencelet",
    "Bioinformatics Lab",
    "Computational Biology",
    "ProtIndex",
    "Protein Sequence Analysis",
    "Peptide Analysis",
    "Genomics",
    "Structural Biology",
    "Open Science"
  ],
  openGraph: {
    title: {
      default: "Sciencelet Lab | Computational Biology & Bioinformatics",
      template: "%s | Sciencelet Lab",
    },
    description: "Sciencelet Lab is a computational biology and bioinformatics research laboratory developing open-access analytical tools, algorithms, and biological sequence analytics.",
    url: "https://lab.sciencelet.org",
    siteName: 'Sciencelet Lab',
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ],
    type: "website",
  },
  twitter: {
    title: {
      default: "Sciencelet Lab | Computational Biology & Bioinformatics",
      template: "%s | Sciencelet Lab",
    },
    description: "Sciencelet Lab is a computational biology and bioinformatics research laboratory developing open-access analytical tools, algorithms, and biological sequence analytics.",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} ${funnelSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
