import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ResearchSection from "@/components/home/ResearchSection";
import ToolsSection from "@/components/home/ToolsSection";
import OpenScienceSection from "@/components/home/OpenScienceSection";

export const metadata = {
  title: "Sciencelet Lab | Computational Biology & Bioinformatics",
  description: "Sciencelet Lab is a computational biology and bioinformatics research laboratory developing open-access analytical tools, algorithms, and biological sequence analytics.",
  keywords: [
    "Sciencelet Lab",
    "Sciencelet",
    "Bioinformatics Lab",
    "Computational Biology",
    "ProtChem",
    "Protein Sequence Analysis",
    "Genomics",
    "Structural Biology"
  ],
  metadataBase: new URL("https://lab.sciencelet.org"),
  alternates: {
    canonical: `/`,
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <HeroSection />
      <ToolsSection />
      <ResearchSection />
      <AboutSection />
      <OpenScienceSection />
    </div>
  );
}
