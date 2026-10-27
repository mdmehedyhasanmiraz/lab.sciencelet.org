"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Download, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface HelicalWheelPlotProps {
  sequence: string;
}

// Chemical categories for standard 20 amino acids
type ResidueCategory = "hydrophobic" | "basic" | "acidic" | "polar" | "special";

const RESIDUE_PROPERTIES: Record<
  string,
  { label: string; name: string; category: ResidueCategory; color: string; textColor: string; borderColor: string }
> = {
  A: { label: "Ala", name: "Alanine", category: "hydrophobic", color: "#fef3c7", textColor: "#92400e", borderColor: "#f59e0b" },
  V: { label: "Val", name: "Valine", category: "hydrophobic", color: "#fef3c7", textColor: "#92400e", borderColor: "#f59e0b" },
  I: { label: "Ile", name: "Isoleucine", category: "hydrophobic", color: "#fef3c7", textColor: "#92400e", borderColor: "#f59e0b" },
  L: { label: "Leu", name: "Leucine", category: "hydrophobic", color: "#fef3c7", textColor: "#92400e", borderColor: "#f59e0b" },
  M: { label: "Met", name: "Methionine", category: "hydrophobic", color: "#fef3c7", textColor: "#92400e", borderColor: "#f59e0b" },
  F: { label: "Phe", name: "Phenylalanine", category: "hydrophobic", color: "#fed7aa", textColor: "#9a3412", borderColor: "#ea580c" },
  W: { label: "Trp", name: "Tryptophan", category: "hydrophobic", color: "#fed7aa", textColor: "#9a3412", borderColor: "#ea580c" },
  Y: { label: "Tyr", name: "Tyrosine", category: "polar", color: "#e0f2fe", textColor: "#0369a1", borderColor: "#38bdf8" },

  K: { label: "Lys", name: "Lysine", category: "basic", color: "#dbeafe", textColor: "#1d4ed8", borderColor: "#3b82f6" },
  R: { label: "Arg", name: "Arginine", category: "basic", color: "#dbeafe", textColor: "#1d4ed8", borderColor: "#3b82f6" },
  H: { label: "His", name: "Histidine", category: "basic", color: "#e0e7ff", textColor: "#4338ca", borderColor: "#6366f1" },

  D: { label: "Asp", name: "Aspartic Acid", category: "acidic", color: "#fee2e2", textColor: "#b91c1c", borderColor: "#ef4444" },
  E: { label: "Glu", name: "Glutamic Acid", category: "acidic", color: "#fee2e2", textColor: "#b91c1c", borderColor: "#ef4444" },

  S: { label: "Ser", name: "Serine", category: "polar", color: "#ccfbf1", textColor: "#0f766e", borderColor: "#14b8a6" },
  T: { label: "Thr", name: "Threonine", category: "polar", color: "#ccfbf1", textColor: "#0f766e", borderColor: "#14b8a6" },
  N: { label: "Asn", name: "Asparagine", category: "polar", color: "#ccfbf1", textColor: "#0f766e", borderColor: "#14b8a6" },
  Q: { label: "Gln", name: "Glutamine", category: "polar", color: "#ccfbf1", textColor: "#0f766e", borderColor: "#14b8a6" },

  G: { label: "Gly", name: "Glycine", category: "special", color: "#f1f5f9", textColor: "#475569", borderColor: "#94a3b8" },
  P: { label: "Pro", name: "Proline", category: "special", color: "#f1f5f9", textColor: "#475569", borderColor: "#94a3b8" },
  C: { label: "Cys", name: "Cysteine", category: "special", color: "#fef9c3", textColor: "#854d0e", borderColor: "#eab308" },
};

export default function HelicalWheelPlot({ sequence }: HelicalWheelPlotProps) {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [hoveredResidue, setHoveredResidue] = useState<{
    aa: string;
    position: number;
    posInHelix: number;
    angle: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const windowLength = 18; // standard alpha-helical period (3.6 residues/turn * 5 turns = 18 residues)
  const maxStart = Math.max(0, sequence.length - windowLength);

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

  const activeSegment = useMemo(() => {
    const seg = sequence.slice(startIndex, startIndex + windowLength);
    return seg.split("").map((aa, idx) => ({
      aa,
      position: startIndex + idx + 1,
      posInHelix: idx + 1,
      angleDeg: (idx * 100) % 360, // 100° per residue in standard alpha-helix
    }));
  }, [sequence, startIndex]);

  // Dimensions
  const width = 800;
  const height = 560;
  const centerX = width / 2;
  const centerY = 310;
  const radius = 170;

  // Helical positions in 2D coordinates
  const nodes = useMemo(() => {
    return activeSegment.map((res) => {
      // 0 deg at top: -90 deg offset
      const rad = ((res.angleDeg - 90) * Math.PI) / 180;
      // Slight radial variation so earlier residues sit closer to outer rim and later inward
      const spiralR = radius - (res.posInHelix - 1) * 2.2;
      return {
        ...res,
        x: centerX + spiralR * Math.cos(rad),
        y: centerY + spiralR * Math.sin(rad),
      };
    });
  }, [activeSegment, centerX, centerY, radius]);

  // Sequential connecting backbone lines
  const backbonePath = useMemo(() => {
    if (nodes.length === 0) return "";
    return nodes.map((n, i) => `${i === 0 ? "M" : "L"} ${n.x.toFixed(1)},${n.y.toFixed(1)}`).join(" ");
  }, [nodes]);

  const downloadSVG = () => {
    if (!svgRef.current) return;
    setDownloadingFormat("svg");

    const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgElement.setAttribute("width", width.toString());
    svgElement.setAttribute("height", height.toString());

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `helical-wheel-pos-${startIndex + 1}-${startIndex + windowLength}.svg`;
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
    svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgElement.setAttribute("width", width.toString());
    svgElement.setAttribute("height", height.toString());

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const scale = 2; // high-resolution crisp 2x export
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
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
        link.download = `helical-wheel-${transparent ? "transparent" : "white"}-pos-${startIndex + 1}.png`;
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

  if (!sequence || sequence.length < 5) return null;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-800" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              α-Helical Wheel Projection (Amphipathicity)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Axial projection down an 18-residue α-helix (100° rotation per residue; Schiffer & Edmundson 1967)
          </p>
        </div>

        {/* Position Window Controls & Export Menu */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs">
            <button
              onClick={() => setStartIndex(Math.max(0, startIndex - 5))}
              disabled={startIndex === 0}
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
              title="Step back 5 residues"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-700" />
            </button>
            <span className="font-mono text-slate-700 font-semibold px-1">
              Residues {startIndex + 1}–{Math.min(startIndex + windowLength, sequence.length)}
            </span>
            <button
              onClick={() => setStartIndex(Math.min(maxStart, startIndex + 5))}
              disabled={startIndex >= maxStart}
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
              title="Step forward 5 residues"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
            </button>
          </div>

          {/* Download Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-950 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-800" />
              <span>Export Wheel</span>
              <ChevronDown className="w-3 h-3 text-teal-700" />
            </button>

            {downloadMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-md border border-slate-200 shadow-lg py-1.5 z-30 text-xs">
                <button
                  onClick={() => downloadPNG(false)}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3.5 py-2 hover:bg-teal-50 hover:text-teal-900 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium">PNG Image (Solid White)</span>
                  {downloadingFormat === "png-white" && <Check className="w-3.5 h-3.5 text-teal-700" />}
                </button>

                <button
                  onClick={() => downloadPNG(true)}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3.5 py-2 hover:bg-teal-50 hover:text-teal-900 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium">PNG (Transparent)</span>
                  {downloadingFormat === "png-transparent" && <Check className="w-3.5 h-3.5 text-teal-700" />}
                </button>

                <button
                  onClick={downloadSVG}
                  disabled={downloadingFormat !== null}
                  className="w-full text-left px-3.5 py-2 hover:bg-teal-50 hover:text-teal-900 transition-colors flex items-center justify-between cursor-pointer border-t border-slate-100"
                >
                  <span className="font-medium">Vector Image (SVG)</span>
                  {downloadingFormat === "svg" && <Check className="w-3.5 h-3.5 text-teal-700" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SVG Canvas with Top White Legend Bar */}
      <div className="relative mt-4 w-full overflow-x-auto flex justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[800px] h-auto font-sans"
        >
          {/* Top Legend Bar (Clean borderless & transparent) */}
          <g id="helical-wheel-legend">
            {/* Hydrophobic */}
            <circle cx={70} cy={28} r={6} fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
            <text x={82} y={32} fill="#334155" fontSize="11" fontWeight="500">
              Hydrophobic (A, V, L, I, M, F, W)
            </text>

            {/* Basic */}
            <circle cx={295} cy={28} r={6} fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
            <text x={307} y={32} fill="#334155" fontSize="11" fontWeight="500">
              Basic (K, R, H)
            </text>

            {/* Acidic */}
            <circle cx={425} cy={28} r={6} fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
            <text x={437} y={32} fill="#334155" fontSize="11" fontWeight="500">
              Acidic (D, E)
            </text>

            {/* Polar */}
            <circle cx={545} cy={28} r={6} fill="#ccfbf1" stroke="#14b8a6" strokeWidth="1.5" />
            <text x={557} y={32} fill="#334155" fontSize="11" fontWeight="500">
              Polar (S, T, N, Q, Y)
            </text>

            {/* Special */}
            <circle cx={690} cy={28} r={6} fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
            <text x={702} y={32} fill="#334155" fontSize="11" fontWeight="500">
              Special (G, P, C)
            </text>
          </g>

          {/* Concentric Reference Rings */}
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
          <circle cx={centerX} cy={centerY} r={radius * 0.65} fill="none" stroke="#f8fafc" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={centerX} cy={centerY} r={radius * 0.3} fill="none" stroke="#f8fafc" strokeWidth="1" strokeDasharray="3 3" />

          {/* Central N-terminus indicator */}
          <circle cx={centerX} cy={centerY} r={20} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text
            x={centerX}
            y={centerY + 4}
            textAnchor="middle"
            fill="#64748b"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            N-term
          </text>

          {/* Sequential Backbone Connecting Lines */}
          <path
            d={backbonePath}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />

          {/* Residue Nodes */}
          {nodes.map((node) => {
            const prop = RESIDUE_PROPERTIES[node.aa] || {
              label: node.aa,
              name: node.aa,
              category: "special",
              color: "#f1f5f9",
              textColor: "#334155",
              borderColor: "#94a3b8",
            };
            const isHovered = hoveredResidue?.position === node.position;

            return (
              <g
                key={`node-${node.position}`}
                className="cursor-pointer"
                onMouseEnter={() =>
                  setHoveredResidue({
                    aa: node.aa,
                    position: node.position,
                    posInHelix: node.posInHelix,
                    angle: node.angleDeg,
                  })
                }
                onMouseLeave={() => setHoveredResidue(null)}
              >
                {/* Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 20 : 17}
                  fill={prop.color}
                  stroke={isHovered ? "#0f766e" : prop.borderColor}
                  strokeWidth={isHovered ? 2.5 : 1.8}
                  className="transition-all duration-150"
                />

                {/* Residue Single-letter & 1-based index */}
                <text
                  x={node.x}
                  y={node.y - 1}
                  textAnchor="middle"
                  fill={prop.textColor}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.aa}
                </text>
                <text
                  x={node.x}
                  y={node.y + 10}
                  textAnchor="middle"
                  fill={prop.textColor}
                  fontSize="8"
                  opacity="0.85"
                  fontFamily="monospace"
                >
                  {node.posInHelix}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredResidue && (
          <div className="absolute top-14 pointer-events-none bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded shadow-lg flex items-center gap-3 backdrop-blur-sm">
            <span>
              Residue:{" "}
              <strong className="text-teal-300 font-mono">
                {RESIDUE_PROPERTIES[hoveredResidue.aa]?.name ?? hoveredResidue.aa} (
                {hoveredResidue.aa}
                {hoveredResidue.position})
              </strong>
            </span>
            <span>
              Helix Step: <strong className="text-white">#{hoveredResidue.posInHelix}</strong> (
              {hoveredResidue.angle}°)
            </span>
            <span className="text-[10px] uppercase font-semibold text-teal-200">
              {RESIDUE_PROPERTIES[hoveredResidue.aa]?.category ?? "Residue"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
