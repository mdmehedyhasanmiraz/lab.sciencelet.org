"use client"

import { useState } from "react";
import InputArea from "@/components/tools/InputArea";
import SequenceLength from "@/components/tools/SequenceLength";
import MolecularWeight from "@/components/tools/MolecularWeight";
import AcidicBasicResidues from "@/components/tools/AcidicBasicResidues";
import IsoelectricPoint from "@/components/tools/IsoelectricPoint";
import AliphaticIndex from "@/components/tools/AliphaticIndex";
import GravyIndex from "@/components/tools/GRAVY";
import Solubility from "@/components/tools/Solubility";
import ExtinctionCoefficient from "@/components/tools/ExtinctionCoefficient";
import AtomCount from "@/components/tools/AtomCount";
import AminoAcidComposition from "@/components/tools/AminoAcidComposition";
import { calculateProperties } from "@/lib/utils/calculateProperties";

export default function PepCheckPage() {
  const [properties, setProperties] = useState<any | null>(null);

  const handleSubmit = (seq: string) => {
    setSequence(seq);
    const result = calculateProperties(seq);
    setProperties(result);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">PepCheck: Protein Analysis Tool</h1>
      <InputArea onSubmit={handleSubmit} />

      {properties && (
        <div className="grid gap-6 mt-8">
          <SequenceLength length={properties.sequenceLength} />
          <MolecularWeight weight={properties.molecularWeight} />
          <AcidicBasicResidues 
            acidicCount={properties.acidicCount} 
            basicCount={properties.basicCount}
            acidicPercentage={properties.acidicPercentage}
            basicPercentage={properties.basicPercentage}
          />
          <IsoelectricPoint pI={properties.pI} />
          <AliphaticIndex aminoAcidCount={properties.aminoAcidCount} sequenceLength={properties.sequenceLength} />
          <GravyIndex gravy={properties.gravy} />
          <Solubility solubility={properties.solubility} />
          <ExtinctionCoefficient extinction={properties.extinctionCoefficient} />
          <AtomCount atomCount={properties.atomCount} />
          <AminoAcidComposition aminoAcidCount={properties.aminoAcidCount} total={properties.sequenceLength} />
        </div>
      )}
    </main>
  );
}
