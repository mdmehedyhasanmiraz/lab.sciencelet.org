"use client";

import React, { useState, useRef } from "react";
import { 
  RamachandranResidue, 
  RamachandranRegion 
} from "@/lib/utils/pdbParser";
import { PROCHECK_REGIONS } from "@/lib/utils/ramachandranContours";
import { Download, Check } from "lucide-react";

interface RamachandranPlotProps {
  residues: RamachandranResidue[];
  structureTitle?: string;
  chains: string[];
}

export default function RamachandranPlot({
  residues,
  chains
}: RamachandranPlotProps) {
  const [selectedChain, setSelectedChain] = useState<string>("ALL");
  const [filterType, setFilterType] = useState<"ALL" | "GENERAL" | "GLY" | "PRO">("ALL");
  const [hoveredResidue, setHoveredResidue] = useState<RamachandranResidue | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // SVG dimensions: Includes square plot area on the left and integrated legend on the right
  const svgWidth = 920;
  const svgHeight = 680;
  const padding = 65;
  const plotArea = svgHeight - padding * 2; // 550px square plot [padding .. padding + plotArea]

  // Coordinate transforms: Map [-180, 180] to [padding, padding + plotArea]
  const phiToX = (phi: number) => padding + ((phi + 180) / 360) * plotArea;
  const psiToY = (psi: number) => svgHeight - padding - ((psi + 180) / 360) * plotArea;

  const pointsToSVG = (pts: [number, number][]) =>
    pts.map(([phi, psi]) => `${phiToX(phi).toFixed(1)},${psiToY(psi).toFixed(1)}`).join(" ");

  // Filter residues
  const filteredResidues = residues.filter((r) => {
    if (selectedChain !== "ALL" && r.chainID !== selectedChain) return false;
    if (filterType === "GENERAL" && (r.isGlycine || r.isProline)) return false;
    if (filterType === "GLY" && !r.isGlycine) return false;
    if (filterType === "PRO" && !r.isProline) return false;
    return true;
  });

  // Export handlers
  const downloadSVG = () => {
    if (!svgRef.current) return;
    setDownloadingFormat("svg");

    const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svgElement.setAttribute("width", svgWidth.toString());
    svgElement.setAttribute("height", svgHeight.toString());

    // Remove interactive hover tooltip before export
    const tooltip = svgElement.querySelector("#interactive-floating-tooltip");
    if (tooltip) tooltip.remove();

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `ramachandran-plot-${Date.now()}.svg`;
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
    svgElement.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svgElement.setAttribute("width", svgWidth.toString());
    svgElement.setAttribute("height", svgHeight.toString());

    // Remove interactive hover tooltip before export
    const tooltip = svgElement.querySelector("#interactive-floating-tooltip");
    if (tooltip) tooltip.remove();

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const scale = 2; // 2x high-resolution crisp export (1840 x 1360 px)
      const canvas = document.createElement("canvas");
      canvas.width = svgWidth * scale;
      canvas.height = svgHeight * scale;
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
        link.download = `ramachandran-plot-${transparent ? "transparent" : "white"}-${Date.now()}.png`;
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

  // Helper for region description badge
  const getRegionText = (region: RamachandranRegion) => {
    if (region === "core") return "Favored Core";
    if (region === "allowed") return "Allowed Region";
    if (region === "generous") return "Generously Allowed";
    return "Disallowed Outlier";
  };

  return (
    <div className="w-full bg-white rounded-md border border-slate-200 p-6 sm:p-8">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Ramachandran Plot
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Main-chain dihedral angle distribution (φ – ψ) with integrated conformational legends and angular inspector.
          </p>
        </div>

        {/* Filter controls and Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {chains.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600">Chain:</span>
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 text-xs outline-none focus:border-teal-700 cursor-pointer"
              >
                <option value="ALL">All Chains ({chains.length})</option>
                {chains.map((c) => (
                  <option key={c} value={c}>
                    Chain {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Residue Class Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setFilterType("ALL")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterType === "ALL" ? "bg-white text-slate-900 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType("GENERAL")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterType === "GENERAL" ? "bg-white text-slate-900 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setFilterType("GLY")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterType === "GLY" ? "bg-white text-slate-900 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              Gly
            </button>
            <button
              type="button"
              onClick={() => setFilterType("PRO")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterType === "PRO" ? "bg-white text-slate-900 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              Pro
            </button>
          </div>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Plot</span>
            </button>

            {downloadMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-30 text-xs">
                <button
                  onClick={() => downloadPNG(false)}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium text-slate-800">PNG (White BG)</span>
                  {downloadingFormat === "png-white" && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
                <button
                  onClick={() => downloadPNG(true)}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer border-t border-slate-100"
                >
                  <span className="font-medium text-slate-800">PNG (Transparent)</span>
                  {downloadingFormat === "png-transparent" && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
                <button
                  onClick={downloadSVG}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer border-t border-slate-100"
                >
                  <span className="font-medium text-slate-800">Vector SVG</span>
                  {downloadingFormat === "svg" && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Plot Area with Integrated Legend Container */}
      <div className="mt-8 flex flex-col items-center justify-center">
        <div className="relative border border-slate-200 rounded-lg p-2 bg-slate-50/50 shadow-xs max-w-full overflow-x-auto">
          <svg
            ref={svgRef}
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="select-none max-w-full h-auto bg-white"
          >
            <defs>
              <clipPath id="plot-area-clip">
                <rect x={padding} y={padding} width={plotArea} height={plotArea} />
              </clipPath>
              {/* Drop shadow for floating card tooltip */}
              <filter id="tooltip-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Plot Area Box with 100% Mathematically Aligned Blue Contours */}
            <g clipPath="url(#plot-area-clip)">
              {/* White Background for Disallowed / Outlier space */}
              <rect
                x={padding}
                y={padding}
                width={plotArea}
                height={plotArea}
                fill="#ffffff"
              />

              {/* Tier 1: Generously Allowed Regions -> Light Soft Blue */}
              {PROCHECK_REGIONS.filter((c) => c.category === "generous").map((c, i) => (
                <polygon
                  key={`gen_${i}`}
                  points={pointsToSVG(c.points)}
                  fill="#dbeafe" // soft light blue (blue-100)
                  stroke="#bfdbfe" // blue-200
                  strokeWidth="0.8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}

              {/* Tier 2: Additional Allowed Regions -> Medium Sky Blue */}
              {PROCHECK_REGIONS.filter((c) => c.category === "allowed").map((c, i) => (
                <polygon
                  key={`allow_${i}`}
                  points={pointsToSVG(c.points)}
                  fill="#60a5fa" // medium sky blue (blue-400)
                  stroke="#3b82f6" // blue-500
                  strokeWidth="0.9"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}

              {/* Tier 3: Core / Most Favoured Regions -> Deep Cobalt Blue */}
              {PROCHECK_REGIONS.filter((c) => c.category === "core").map((c, i) => (
                <polygon
                  key={`core_${i}`}
                  points={pointsToSVG(c.points)}
                  fill="#1d4ed8" // deep cobalt blue (blue-700)
                  stroke="#1e40af" // blue-800
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}

              {/* Major Dotted Axes Lines (0 deg lines) */}
              <line
                x1={phiToX(0)}
                y1={padding}
                x2={phiToX(0)}
                y2={svgHeight - padding}
                stroke="#475569"
                strokeWidth="0.8"
                strokeDasharray="4 3"
                opacity={0.65}
              />
              <line
                x1={padding}
                y1={psiToY(0)}
                x2={padding + plotArea}
                y2={psiToY(0)}
                stroke="#475569"
                strokeWidth="0.8"
                strokeDasharray="4 3"
                opacity={0.65}
              />

              {/* Data Points (All Solid Black) */}
              {filteredResidues.map((res, i) => {
                if (res.phi === null || res.psi === null) return null;
                const cx = phiToX(res.phi);
                const cy = psiToY(res.psi);
                const isHovered =
                  hoveredResidue?.resSeq === res.resSeq &&
                  hoveredResidue?.chainID === res.chainID;

                // Glycine represented by triangles, General by circles
                if (res.isGlycine) {
                  const r = isHovered ? 6 : 3.5;
                  return (
                    <polygon
                      key={`${res.chainID}_${res.resSeq}_${i}`}
                      points={`${cx},${cy - r} ${cx + r},${cy + r} ${cx - r},${cy + r}`}
                      fill="#000000"
                      stroke={isHovered ? "#38bdf8" : "#ffffff"}
                      strokeWidth={isHovered ? 1.8 : 0.6}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredResidue(res)}
                      onMouseLeave={() => setHoveredResidue(null)}
                    />
                  );
                }

                return (
                  <circle
                    key={`${res.chainID}_${res.resSeq}_${i}`}
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 5.5 : 3.2}
                    fill="#000000"
                    stroke={isHovered ? "#38bdf8" : "#ffffff"}
                    strokeWidth={isHovered ? 1.8 : 0.6}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredResidue(res)}
                    onMouseLeave={() => setHoveredResidue(null)}
                  />
                );
              })}
            </g>

            {/* Plot Border */}
            <rect
              x={padding}
              y={padding}
              width={plotArea}
              height={plotArea}
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
            />

            {/* Axis Ticks & Numbers (-180 to 180 in 45 deg intervals) */}
            {[-180, -135, -90, -45, 0, 45, 90, 135, 180].map((deg) => (
              <React.Fragment key={deg}>
                {/* Bottom X-axis ticks (Phi) */}
                <line
                  x1={phiToX(deg)}
                  y1={svgHeight - padding}
                  x2={phiToX(deg)}
                  y2={svgHeight - padding + (deg % 90 === 0 ? 7 : 4)}
                  stroke="#000000"
                  strokeWidth="1.2"
                />
                {deg % 45 === 0 && (
                  <text
                    x={phiToX(deg)}
                    y={svgHeight - padding + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fontWeight="500"
                    fill="#334155"
                  >
                    {deg}
                  </text>
                )}

                {/* Left Y-axis ticks (Psi) */}
                <line
                  x1={padding}
                  y1={psiToY(deg)}
                  x2={padding - (deg % 90 === 0 ? 7 : 4)}
                  y2={psiToY(deg)}
                  stroke="#000000"
                  strokeWidth="1.2"
                />
                {deg % 45 === 0 && (
                  <text
                    x={padding - 10}
                    y={psiToY(deg) + 4}
                    textAnchor="end"
                    fontSize="12"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fontWeight="500"
                    fill="#334155"
                  >
                    {deg}
                  </text>
                )}

                {/* Top X-axis ticks */}
                <line
                  x1={phiToX(deg)}
                  y1={padding}
                  x2={phiToX(deg)}
                  y2={padding - (deg % 90 === 0 ? 7 : 4)}
                  stroke="#000000"
                  strokeWidth="1"
                />

                {/* Right border ticks */}
                <line
                  x1={padding + plotArea}
                  y1={psiToY(deg)}
                  x2={padding + plotArea + (deg % 90 === 0 ? 7 : 4)}
                  y2={psiToY(deg)}
                  stroke="#000000"
                  strokeWidth="1"
                />
              </React.Fragment>
            ))}

            {/* Greek Axis Titles: φ and ψ */}
            <text
              x={padding + plotArea / 2}
              y={svgHeight - 18}
              textAnchor="middle"
              fontSize="17"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontStyle="italic"
              fontWeight="600"
              fill="#1e293b"
            >
              φ (Phi)
            </text>

            <text
              x={22}
              y={padding + plotArea / 2}
              textAnchor="middle"
              fontSize="17"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontStyle="italic"
              fontWeight="600"
              fill="#1e293b"
            >
              ψ (Psi)
            </text>

            {/* =========================================================================
                INTEGRATED LEGEND (Visible inside SVG, exported on both PNG & SVG)
               ========================================================================= */}
            <g transform={`translate(${padding + plotArea + 28}, ${padding})`}>
              {/* Outer Legend Panel Box */}
              <rect
                x="0"
                y="0"
                width="240"
                height={plotArea}
                rx="6"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="1"
              />

              {/* Panel Header */}
              <text
                x="16"
                y="28"
                fontSize="13"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
                fill="#0f172a"
              >
                Conformational Regions
              </text>

              {/* Subtitle */}
              <text
                x="16"
                y="46"
                fontSize="11"
                fontFamily="system-ui, -apple-system, sans-serif"
                fill="#64748b"
              >
                Ramachandran energy zones
              </text>

              <line x1="16" y1="58" x2="224" y2="58" stroke="#e2e8f0" strokeWidth="1" />

              {/* Item 1: Highly Favored */}
              <g transform="translate(16, 74)">
                <rect x="0" y="0" width="16" height="16" rx="2" fill="#1d4ed8" stroke="#1e40af" strokeWidth="0.8" />
                <text x="26" y="12" fontSize="11.5" fontWeight="600" fontFamily="system-ui, sans-serif" fill="#1e293b">
                  Highly Favored
                </text>
                <text x="26" y="26" fontSize="10" fontFamily="system-ui, sans-serif" fill="#64748b">
                  Core energy minima
                </text>
              </g>

              {/* Item 2: Allowed Region */}
              <g transform="translate(16, 120)">
                <rect x="0" y="0" width="16" height="16" rx="2" fill="#60a5fa" stroke="#3b82f6" strokeWidth="0.8" />
                <text x="26" y="12" fontSize="11.5" fontWeight="600" fontFamily="system-ui, sans-serif" fill="#1e293b">
                  Allowed Region
                </text>
                <text x="26" y="26" fontSize="10" fontFamily="system-ui, sans-serif" fill="#64748b">
                  Conformationally valid
                </text>
              </g>

              {/* Item 3: Generously Allowed */}
              <g transform="translate(16, 166)">
                <rect x="0" y="0" width="16" height="16" rx="2" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="0.8" />
                <text x="26" y="12" fontSize="11.5" fontWeight="600" fontFamily="system-ui, sans-serif" fill="#1e293b">
                  Generously Allowed
                </text>
                <text x="26" y="26" fontSize="10" fontFamily="system-ui, sans-serif" fill="#64748b">
                  Steric boundary zone
                </text>
              </g>

              {/* Item 4: Disallowed Outlier */}
              <g transform="translate(16, 212)">
                <rect x="0" y="0" width="16" height="16" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                <text x="26" y="12" fontSize="11.5" fontWeight="600" fontFamily="system-ui, sans-serif" fill="#e11d48">
                  Disallowed Outlier
                </text>
                <text x="26" y="26" fontSize="10" fontFamily="system-ui, sans-serif" fill="#64748b">
                  Unfavorable steric clash
                </text>
              </g>

              <line x1="16" y1="256" x2="224" y2="256" stroke="#e2e8f0" strokeWidth="1" />

              {/* Markers Section Header */}
              <text
                x="16"
                y="278"
                fontSize="12"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
                fill="#0f172a"
              >
                Residue Symbols
              </text>

              {/* General Residue Marker */}
              <g transform="translate(16, 298)">
                <circle cx="8" cy="8" r="4.5" fill="#000000" stroke="#ffffff" strokeWidth="0.8" />
                <text x="26" y="12" fontSize="11.5" fontFamily="system-ui, sans-serif" fill="#334155">
                  General Residues (●)
                </text>
              </g>

              {/* Glycine Marker */}
              <g transform="translate(16, 332)">
                <polygon points="8,3 13,13 3,13" fill="#000000" stroke="#ffffff" strokeWidth="0.8" />
                <text x="26" y="12" fontSize="11.5" fontFamily="system-ui, sans-serif" fill="#334155">
                  Glycine (▲)
                </text>
              </g>

              <line x1="16" y1="365" x2="224" y2="365" stroke="#e2e8f0" strokeWidth="1" />

              {/* Stereochemical Quality Information Card inside exported image */}
              <g transform="translate(14, 380)">
                <rect x="0" y="0" width="212" height="150" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <text x="12" y="20" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif" fill="#0f766e">
                  Quality Thresholds
                </text>
                <text x="12" y="38" fontSize="10" fontFamily="system-ui, sans-serif" fill="#475569">
                  Well-refined protein models
                </text>
                <text x="12" y="52" fontSize="10" fontFamily="system-ui, sans-serif" fill="#475569">
                  typically exhibit:
                </text>

                <text x="12" y="76" fontSize="10.5" fontWeight="600" fontFamily="system-ui, sans-serif" fill="#0f172a">
                  • Favored: &gt;90.0%
                </text>
                <text x="12" y="94" fontSize="10.5" fontWeight="600" fontFamily="system-ui, sans-serif" fill="#0f172a">
                  • Allowed: &gt;98.0%
                </text>
                <text x="12" y="112" fontSize="10.5" fontWeight="600" fontFamily="system-ui, sans-serif" fill="#e11d48">
                  • Outliers: &lt;1.5%
                </text>
                <text x="12" y="134" fontSize="9.5" fontFamily="system-ui, sans-serif" fill="#64748b">
                  Plotted residues: {filteredResidues.length}
                </text>
              </g>
            </g>

            {/* =========================================================================
                FLOATING CARD TOOLTIP (Appears directly over hovered residue marker)
               ========================================================================= */}
            {hoveredResidue && hoveredResidue.phi !== null && hoveredResidue.psi !== null && (() => {
              const ptX = phiToX(hoveredResidue.phi);
              const ptY = psiToY(hoveredResidue.psi);
              
              const cardWidth = 175;
              const cardHeight = 88;
              
              // Place tooltip card to the right or left of point to prevent clipping
              let cardX = ptX + 12;
              if (cardX + cardWidth > padding + plotArea) {
                cardX = ptX - cardWidth - 12;
              }
              
              let cardY = ptY - cardHeight / 2;
              if (cardY < padding + 8) cardY = padding + 8;
              if (cardY + cardHeight > svgHeight - padding - 8) cardY = svgHeight - padding - cardHeight - 8;

              return (
                <g id="interactive-floating-tooltip" className="pointer-events-none transition-all duration-100">
                  {/* Target crosshair / indicator ring around point */}
                  <circle cx={ptX} cy={ptY} r="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                  
                  {/* Floating Card Box */}
                  <rect
                    x={cardX}
                    y={cardY}
                    width={cardWidth}
                    height={cardHeight}
                    rx="6"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    filter="url(#tooltip-shadow)"
                  />

                  {/* Header: Residue Name, Sequence and Chain */}
                  <text
                    x={cardX + 10}
                    y={cardY + 18}
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="monospace, system-ui, sans-serif"
                    fill="#ffffff"
                  >
                    {hoveredResidue.resName} {hoveredResidue.resSeq}
                  </text>
                  
                  <text
                    x={cardX + cardWidth - 10}
                    y={cardY + 18}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="system-ui, sans-serif"
                    fill="#38bdf8"
                  >
                    Chain {hoveredResidue.chainID}
                  </text>

                  <line
                    x1={cardX + 10}
                    y1={cardY + 26}
                    x2={cardX + cardWidth - 10}
                    y2={cardY + 26}
                    stroke="#334155"
                    strokeWidth="0.8"
                  />

                  {/* Angular Torsion Info: PHI (φ) and PSI (ψ) */}
                  <text
                    x={cardX + 10}
                    y={cardY + 44}
                    fontSize="11"
                    fontFamily="system-ui, sans-serif"
                    fill="#94a3b8"
                  >
                    φ (phi): <tspan fontWeight="700" fill="#f8fafc" fontFamily="monospace">{hoveredResidue.phi.toFixed(1)}°</tspan>
                  </text>
                  
                  <text
                    x={cardX + 10}
                    y={cardY + 60}
                    fontSize="11"
                    fontFamily="system-ui, sans-serif"
                    fill="#94a3b8"
                  >
                    ψ (psi): <tspan fontWeight="700" fill="#f8fafc" fontFamily="monospace">{hoveredResidue.psi.toFixed(1)}°</tspan>
                  </text>

                  {/* Conformational Region Tag */}
                  <text
                    x={cardX + 10}
                    y={cardY + 76}
                    fontSize="9.5"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                    fill={hoveredResidue.region === "outlier" ? "#f43f5e" : "#2dd4bf"}
                  >
                    {getRegionText(hoveredResidue.region)}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Footer info below plot */}
        <div className="mt-3 flex items-center justify-between w-full max-w-[920px] text-xs text-slate-500 font-sans px-1">
          <span>Showing {filteredResidues.length} of {residues.length} plotted residues</span>
          <span className="font-mono">Hover any residue point on the plot to view exact (φ, ψ) angles</span>
        </div>
      </div>
    </div>
  );
}
