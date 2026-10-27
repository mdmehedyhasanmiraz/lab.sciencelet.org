import DataTable from "@/components/ui/DataTable";
import type { ProteinProperties } from "@/lib/utils/calculateProperties";

type Props = {
  properties: ProteinProperties;
};

export default function PhysicochemicalSummary({ properties }: Props) {
  const halfLife = properties.estimatedHalfLife
    ? `Mammalian: ${properties.estimatedHalfLife.mammalian}; Yeast: ${properties.estimatedHalfLife.yeast}; E. coli: ${
        properties.estimatedHalfLife.ecoli ?? "—"
      }`
    : "—";

  const rows = [
    {
      label: "Molecular weight (average)",
      value: `${properties.molecularWeight} g/mol`,
      reference: { text: "Compositional analysis", url: "https://en.wikipedia.org/wiki/Molecular_mass" },
    },
    {
      label: "Molecular formula",
      value: properties.molecularFormula,
      reference: undefined,
    },
    {
      label: "Isoelectric point (theoretical pI)",
      value: properties.pI,
      reference: { text: "Bjellqvist et al. (1993)", url: "https://pubmed.ncbi.nlm.nih.gov/8563639/" },
    },
    {
      label: "Net charge (pH 7.4)",
      value: properties.netChargePH74,
      reference: { text: "Henderson-Hasselbalch", url: "https://en.wikipedia.org/wiki/Henderson%E2%80%93Hasselbalch_equation" },
    },
    {
      label: "Charge density (pH 7.4)",
      value: properties.chargeDensityPH74,
      reference: { text: "Calculated metric", url: "https://en.wikipedia.org/wiki/Protein_charge" },
    },
    {
      label: "GRAVY",
      value: properties.gravy.toFixed(5),
      reference: { text: "Kyte & Doolittle (1982)", url: "https://pubmed.ncbi.nlm.nih.gov/7108955/" },
    },
    {
      label: "Aromaticity (F+W+Y fraction)",
      value: properties.aromaticity,
      reference: { text: "Compositional analysis", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2685197/" },
    },
    {
      label: "Hydrophobic residue fraction",
      value: properties.hydrophobicResidueFraction,
      reference: { text: "Kyte & Doolittle (1982)", url: "https://pubmed.ncbi.nlm.nih.gov/7108955/" },
    },
    {
      label: "Aliphatic index (thermostability)",
      value: properties.aliphaticIndex,
      reference: { text: "Ikai (1980)", url: "https://pubmed.ncbi.nlm.nih.gov/7462208/" },
    },
    {
      label: "Boman index (binding potential)",
      value: `${properties.bomanIndex} kcal/mol`,
      reference: { text: "Boman (2003)", url: "https://pubmed.ncbi.nlm.nih.gov/12908861/" },
    },
    {
      label: "Partial specific volume (v̄)",
      value: `${properties.partialSpecificVolume} cm³/g`,
      reference: { text: "Cohn & Edsall (1943)", url: "https://en.wikipedia.org/wiki/Partial_specific_volume" },
    },
    {
      label: "Bound hydration water",
      value: `${properties.boundWaterPerGram} g H₂O / g protein`,
      reference: { text: "Kuntz & Kauzmann (1974)", url: "https://pubmed.ncbi.nlm.nih.gov/4612389/" },
    },
    {
      label: "Sequence complexity (Shannon entropy)",
      value: `${properties.sequenceComplexity} bits`,
      reference: { text: "Wootton & Federhen (1993)", url: "https://pubmed.ncbi.nlm.nih.gov/8344288/" },
    },
    {
      label: "Hydrophobic moment (α-helix, max window)",
      value: properties.hydrophobicMomentHelixMax,
      reference: { text: "Eisenberg et al. (1984)", url: "https://pubmed.ncbi.nlm.nih.gov/6582470/" },
    },
    {
      label: "Hydropathy window mean (max)",
      value: properties.hydropathyWindowMeanMax,
      reference: { text: "Kyte & Doolittle (1982)", url: "https://pubmed.ncbi.nlm.nih.gov/7108955/" },
    },
    {
      label: "Extinction coefficient ε280 (reduced Cys)",
      value: `${properties.extinctionCoefficientReduced} M⁻¹cm⁻¹`,
      reference: { text: "Gill & von Hippel (1989)", url: "https://pubmed.ncbi.nlm.nih.gov/2610349/" },
    },
    {
      label: "Extinction coefficient ε280 (cystines)",
      value: `${properties.extinctionCoefficientCystine} M⁻¹cm⁻¹`,
      reference: { text: "Pace et al. (1995)", url: "https://pubmed.ncbi.nlm.nih.gov/8563639/" },
    },
    {
      label: "A280 (1 mg/mL, 1 cm; reduced)",
      value: properties.absorbance1mgmlReduced,
      reference: { text: "Gill & von Hippel (1989)", url: "https://pubmed.ncbi.nlm.nih.gov/2610349/" },
    },
    {
      label: "A280 (1 mg/mL, 1 cm; cystines)",
      value: properties.absorbance1mgmlCystine,
      reference: { text: "Pace et al. (1995)", url: "https://pubmed.ncbi.nlm.nih.gov/8563639/" },
    },
    {
      label: "Instability index",
      value: `${properties.instabilityIndex} (${properties.instabilityClass})`,
      reference: { text: "Guruprasad et al. (1990)", url: "https://pubmed.ncbi.nlm.nih.gov/2075190/" },
    },
    {
      label: "Estimated half-life (N-end rule)",
      value: halfLife,
      reference: { text: "Bachmair et al. (1986)", url: "https://pubmed.ncbi.nlm.nih.gov/3018930/" },
    },
    {
      label: "Solubility (heuristic)",
      value: `${properties.solubility} (score: ${properties.solubilityHeuristicScore})`,
      reference: undefined,
    },
    {
      label: "Aggregation risk (heuristic)",
      value: `${properties.aggregationRiskHeuristic} (score: ${properties.aggregationRiskScore})`,
      reference: undefined,
    },
  ];

  return (
    <div className="w-full">
      <DataTable rows={rows} />
    </div>
  );
}
