"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Download, ChevronDown, Check } from "lucide-react";
import type { ProteinProperties } from "@/lib/utils/calculateProperties";

interface PropertyRadarProps {
  properties: ProteinProperties;
}

interface MetricAxis {
  key: string;
  label: string;
  displayValue: string;
  normalized: number; // 0.0 to 1.0 (relative to benchmark ranges)
  rawRange: string;
  description: string;
}

export default function PropertyRadar({ properties }: PropertyRadarProps) {
  const [hoveredAxis, setHoveredAxis] = useState<MetricAxis | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDownloadMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute normalized scores between 0 and 1 for 10 key biophysical axes
  const axes: MetricAxis[] = useMemo(() => {
    // 1. Isoelectric Point (pI): Range 3 to 12
    const piNorm = Math.min(Math.max((properties.pI - 3) / 9, 0.05), 0.98);

    // 2. GRAVY Hydropathy: Range -2.0 (hydrophilic) to +2.0 (hydrophobic)
    const gravyNorm = Math.min(Math.max((properties.gravy + 2.0) / 4.0, 0.05), 0.98);

    // 3. Hydrophobic Residue Fraction: Range 20% to 65%
    const hydroFrac = properties.hydrophobicResidueFraction ?? 0;
    const hydroNorm = Math.min(Math.max((hydroFrac - 0.20) / 0.45, 0.05), 0.98);

    // 4. Amphipathic Hydrophobic Moment (α-helix max window): Eisenberg et al. 1984, Range 0.1 to 0.7
    const hMoment = properties.hydrophobicMomentHelixMax ?? 0;
    const hMomentNorm = Math.min(Math.max((hMoment - 0.10) / 0.60, 0.05), 0.98);

    // 5. Aliphatic Index (thermostability): Range 30 to 130
    const A = properties.aminoAcidCount["A"] || 0;
    const V = properties.aminoAcidCount["V"] || 0;
    const I = properties.aminoAcidCount["I"] || 0;
    const L = properties.aminoAcidCount["L"] || 0;
    const ai = properties.sequenceLength > 0
      ? ((A + 2.9 * V + 3.9 * (I + L)) / properties.sequenceLength) * 100
      : 0;
    const aiNorm = Math.min(Math.max((ai - 30) / 100, 0.05), 0.98);

    // 6. Aromaticity Fraction (F+W+Y): Range 0% to 20%
    const aromaticNorm = Math.min(Math.max((properties.aromaticity) / 0.20, 0.05), 0.98);

    // 7. Absorptivity Intensity (ε280 / kDa): Range 0 to 2.2 /kDa
    const mwKDa = properties.molecularWeight > 0 ? properties.molecularWeight / 1000 : 1;
    const extPerKDa = (properties.extinctionCoefficientCystine || properties.extinctionCoefficientReduced || 0) / (mwKDa * 1000);
    const extNorm = Math.min(Math.max(extPerKDa / 2.2, 0.05), 0.98);

    // 8. Net Physiological Charge Density (|charge| / length): Range 0 to 0.12 / aa
    const chargeDensity = Math.abs(properties.chargeDensityPH74);
    const chargeNorm = Math.min(Math.max(chargeDensity / 0.12, 0.05), 0.98);

    // 9. Basic Residue Fraction (K+R+H): Range 5% to 25%
    const basicPct = properties.basicPercentage ?? 0;
    const basicNorm = Math.min(Math.max((basicPct - 5) / 20, 0.05), 0.98);

    // 10. Instability Index: Guruprasad et al. 1990, Range 10 to 70 (<=40 is stable)
    const instabNorm = Math.min(Math.max((properties.instabilityIndex - 10) / 60, 0.05), 0.98);

    return [
      {
        key: "pi",
        label: "Isoelectric Point",
        displayValue: properties.pI.toFixed(2),
        normalized: piNorm,
        rawRange: "3.0 – 12.0",
        description: "Theoretical pI calculated using Bjellqvist pKa sets"
      },
      {
        key: "gravy",
        label: "Hydropathy (GRAVY)",
        displayValue: properties.gravy.toFixed(3),
        normalized: gravyNorm,
        rawRange: "-2.0 – +2.0",
        description: "Grand average of hydropathy via Kyte-Doolittle scale"
      },
      {
        key: "hydrophobic",
        label: "Hydrophobic Residues",
        displayValue: `${(hydroFrac * 100).toFixed(1)}%`,
        normalized: hydroNorm,
        rawRange: "20% – 65%",
        description: "Aliphatic and aromatic core residue content"
      },
      {
        key: "moment",
        label: "Hydrophobic Moment",
        displayValue: `${hMoment.toFixed(3)} μH`,
        normalized: hMomentNorm,
        rawRange: "0.10 – 0.70 μH",
        description: "Amphipathic helix moment window maximum (Eisenberg 1984)"
      },
      {
        key: "aliphatic",
        label: "Aliphatic Index",
        displayValue: ai.toFixed(1),
        normalized: aiNorm,
        rawRange: "30 – 130",
        description: "Relative volume of aliphatic side chains (thermostability indicator)"
      },
      {
        key: "aromatic",
        label: "Aromaticity",
        displayValue: `${(properties.aromaticity * 100).toFixed(1)}%`,
        normalized: aromaticNorm,
        rawRange: "0% – 20%",
        description: "Relative frequency of Phe (F), Trp (W), and Tyr (Y)"
      },
      {
        key: "extinction",
        label: "Absorptivity ε280",
        displayValue: `${extPerKDa.toFixed(2)} /kDa`,
        normalized: extNorm,
        rawRange: "0 – 2.2 /kDa",
        description: "Molar extinction coefficient per kDa (Pace et al. 1995)"
      },
      {
        key: "charge",
        label: "Charge Density",
        displayValue: `${properties.netChargePH74.toFixed(1)} (pH 7.4)`,
        normalized: chargeNorm,
        rawRange: "0 – 0.12 / aa",
        description: "Net physiological surface charge relative to length"
      },
      {
        key: "basic",
        label: "Basic Residues",
        displayValue: `${basicPct.toFixed(1)}%`,
        normalized: basicNorm,
        rawRange: "5% – 25%",
        description: "Molar percentage of Lys (K), Arg (R), and His (H)"
      },
      {
        key: "instability",
        label: "Instability Index",
        displayValue: `${properties.instabilityIndex.toFixed(1)} (${properties.instabilityClass})`,
        normalized: instabNorm,
        rawRange: "10 – 70",
        description: "Guruprasad dipeptide instability index (<40 is stable)"
      }
    ];
  }, [properties]);

  /**
   * Geometry with generous margins to prevent text clipping on SVG/PNG download:
   * viewBox: 0 0 680 680
   * center: (340, 340)
   * radius: 180 (leaves 160px margin on all sides for multi-line labels)
   */
  const size = 680;
  const center = size / 2;
  const radius = 180;
  const labelDistance = radius + 34; // 214px from center
  const levels = [0.25, 0.5, 0.75, 1.0];
  const numAxes = axes.length;

  const getCoordinates = (index: number, rVal: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    return {
      x: center + rVal * Math.cos(angle),
      y: center + rVal * Math.sin(angle)
    };
  };

  // Polygon points
  const polygonPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, radius * axis.normalized);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // Export handlers with exact full SVG viewBox
  const downloadSVG = () => {
    if (!svgRef.current) return;
    setDownloadingFormat("svg");

    const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svgElement.setAttribute("width", size.toString());
    svgElement.setAttribute("height", size.toString());

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `protchem-radar-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadingFormat(null);
      setDownloadMenuOpen(false);
    }, 400);
  };

  const downloadPNG = (transparent: boolean) => {
    if (!svgRef.current) return;
    setDownloadingFormat(transparent ? "png-transparent" : "png-white");

    const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svgElement.setAttribute("width", size.toString());
    svgElement.setAttribute("height", size.toString());

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const scale = 2; // 2x high-resolution crisp export (1360 x 1360 px)
      const canvas = document.createElement("canvas");
      canvas.width = size * scale;
      canvas.height = size * scale;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        if (!transparent) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `protchem-radar-${transparent ? "transparent" : "white"}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      URL.revokeObjectURL(url);
      setDownloadingFormat(null);
      setDownloadMenuOpen(false);
    };

    image.src = url;
  };

  return (
    <div className="pt-10 pb-8 border-t border-slate-200 w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Biophysical Property Radar
          </h3>
          <p className="text-xs text-slate-500">
            Multivariate 10-axis biophysical profile mapped against globular protein distributions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hoveredAxis ? (
            <div className="text-xs text-slate-700 bg-orange-50/80 border border-orange-200 px-3 py-1.5 rounded font-medium">
              <span className="font-bold text-orange-950">{hoveredAxis.label}: </span>
              <span className="font-mono text-orange-900 font-bold">{hoveredAxis.displayValue}</span>
              <span className="text-orange-700/70 ml-1.5 font-normal">({hoveredAxis.rawRange})</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic hidden sm:block">
              Hover axis node for details
            </div>
          )}

          {/* Download Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-orange-600" />
              <span>Download Radar</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {downloadMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-md border border-slate-200 shadow-lg py-1.5 z-30 text-xs">
                <button
                  onClick={() => downloadPNG(false)}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3.5 py-2 hover:bg-orange-50 hover:text-orange-900 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium">PNG Image (Solid White)</span>
                  {downloadingFormat === "png-white" && <Check className="w-3.5 h-3.5 text-orange-600" />}
                </button>

                <button
                  onClick={() => downloadPNG(true)}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3.5 py-2 hover:bg-orange-50 hover:text-orange-900 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium">PNG (Transparent)</span>
                  {downloadingFormat === "png-transparent" && <Check className="w-3.5 h-3.5 text-orange-600" />}
                </button>

                <button
                  onClick={downloadSVG}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3.5 py-2 hover:bg-orange-50 hover:text-orange-900 transition-colors flex items-center justify-between cursor-pointer border-t border-slate-100"
                >
                  <span className="font-medium">Vector Image (SVG)</span>
                  {downloadingFormat === "svg" && <Check className="w-3.5 h-3.5 text-orange-600" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Centered Radar SVG with unclipped margins */}
      <div className="w-full flex justify-center items-center py-4">
        <div className="relative shrink-0 flex items-center justify-center max-w-full">
          <svg 
            ref={svgRef}
            width={size} 
            height={size} 
            viewBox={`0 0 ${size} ${size}`} 
            className="overflow-visible max-w-full h-auto select-none font-sans"
          >
            {/* Concentric Web Rings */}
            {levels.map((level, lvlIdx) => {
              const ringPoints = axes
                .map((_, i) => {
                  const { x, y } = getCoordinates(i, radius * level);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(" ");

              return (
                <polygon
                  key={lvlIdx}
                  points={ringPoints}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={lvlIdx < 3 ? "2 2" : undefined}
                />
              );
            })}

            {/* Axis Lines */}
            {axes.map((_, i) => {
              const { x, y } = getCoordinates(i, radius);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              );
            })}

            {/* Shaded Data Polygon in Vibrant Orange */}
            <polygon
              points={polygonPoints}
              fill="rgba(249, 115, 22, 0.28)" // Orange-500 fill with ~28% opacity
              stroke="#ea580c" // Orange-600 outline
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Data Points and Axis Labels */}
            {axes.map((axis, i) => {
              const { x: ptX, y: ptY } = getCoordinates(i, radius * axis.normalized);
              const { x: lblX, y: lblY } = getCoordinates(i, labelDistance);
              const isHovered = hoveredAxis?.key === axis.key;

              // Text anchor calculation based on angle to keep text balanced and readable
              const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
              const cos = Math.cos(angle);
              let textAnchor = "middle";
              if (cos > 0.3) textAnchor = "start";
              else if (cos < -0.3) textAnchor = "end";

              return (
                <g 
                  key={axis.key}
                  onMouseEnter={() => setHoveredAxis(axis)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  className="cursor-pointer group"
                >
                  {/* Outer Invisible Hit Area */}
                  <circle cx={ptX} cy={ptY} r={14} fill="transparent" />

                  {/* Marker Dot (Orange) */}
                  <circle
                    cx={ptX}
                    cy={ptY}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? "#c2410c" : "#ea580c"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />

                  {/* Axis Label */}
                  <text
                    x={lblX}
                    y={lblY - 3}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    className={`text-[11px] font-semibold transition-colors ${
                      isHovered ? "fill-orange-950 font-bold" : "fill-slate-800"
                    }`}
                  >
                    {axis.label}
                  </text>
                  <text
                    x={lblX}
                    y={lblY + 11}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    className={`text-[10px] font-mono ${
                      isHovered ? "fill-orange-800 font-bold" : "fill-slate-500"
                    }`}
                  >
                    {axis.displayValue}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
