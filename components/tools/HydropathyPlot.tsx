"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Download, Check, Sliders, ChevronDown } from "lucide-react";
import { computeHydropathyProfile } from "@/lib/utils/calculateProperties";

interface HydropathyPlotProps {
  sequence: string;
}

export default function HydropathyPlot({ sequence }: HydropathyPlotProps) {
  const [windowSize, setWindowSize] = useState<number>(9);
  const [hoveredPoint, setHoveredPoint] = useState<{
    position: number;
    residue: string;
    score: number;
  } | null>(null);
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

  // Recompute profile when window size or sequence changes
  const profile = useMemo(() => {
    return computeHydropathyProfile(sequence, windowSize);
  }, [sequence, windowSize]);

  if (!profile || profile.length === 0) return null;

  // Hydropathy scale bounds (Kyte-Doolittle theoretical extremes are -4.5 to +4.5)
  const minY = -4.5;
  const maxY = 4.5;

  const width = 850;
  const height = 390;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 60; // extra headroom for top legend box
  const paddingBottom = 50;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const posX = (idx: number) =>
    paddingLeft + (idx / Math.max(1, profile.length - 1)) * plotWidth;
  const posY = (score: number) =>
    paddingTop + ((maxY - score) / (maxY - minY)) * plotHeight;

  const zeroY = posY(0);
  const tmThresholdY = posY(1.6); // Transmembrane threshold (+1.6)

  // Construct SVG path
  const pathD = profile.reduce((acc, pt, idx) => {
    const x = posX(idx);
    const y = posY(pt.score);
    return idx === 0 ? `M ${x.toFixed(1)},${y.toFixed(1)}` : `${acc} L ${x.toFixed(1)},${y.toFixed(1)}`;
  }, "");

  // Area under curve above zero (hydrophobic)
  const areaHydrophobic = `M ${posX(0)},${zeroY} ${profile
    .map((pt, idx) => `L ${posX(idx).toFixed(1)},${Math.min(posY(pt.score), zeroY).toFixed(1)}`)
    .join(" ")} L ${posX(profile.length - 1)},${zeroY} Z`;

  // Area under curve below zero (hydrophilic)
  const areaHydrophilic = `M ${posX(0)},${zeroY} ${profile
    .map((pt, idx) => `L ${posX(idx).toFixed(1)},${Math.max(posY(pt.score), zeroY).toFixed(1)}`)
    .join(" ")} L ${posX(profile.length - 1)},${zeroY} Z`;

  const yTicks = [-4, -2, 0, 2, 4];

  // X ticks intervals
  const totalLength = profile.length;
  const tickStep = totalLength > 500 ? 100 : totalLength > 200 ? 50 : totalLength > 50 ? 20 : 10;
  const xTicks: number[] = [];
  for (let pos = 1; pos <= totalLength; pos += tickStep) {
    xTicks.push(pos);
  }
  if (!xTicks.includes(totalLength) && totalLength - xTicks[xTicks.length - 1] > tickStep / 2) {
    xTicks.push(totalLength);
  }

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
    link.download = `hydropathy-plot-window-${windowSize}.svg`;
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
      const scale = 2; // 2x high-resolution crisp export
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
        link.download = `hydropathy-plot-${transparent ? "transparent" : "white"}-window-${windowSize}.png`;
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
    <div className="w-full bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-800" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Kyte-Doolittle Hydropathy Profile
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Residue-by-residue hydropathy index (peaks &gt; 1.6 indicate potential transmembrane or hydrophobic core segments)
          </p>
        </div>

        {/* Controls: Window Size Selector & Export */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">Window:</span>
            {[7, 9, 13, 19, 21].map((w) => (
              <button
                key={w}
                onClick={() => setWindowSize(w)}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  windowSize === w
                    ? "bg-teal-800 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          {/* Download Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-950 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-800" />
              <span>Export Plot</span>
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

      {/* SVG Canvas */}
      <div className="relative mt-4 w-full overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[400px] font-sans"
        >
          {/* Top Legend Bar (White background, exported with image) */}
          <g id="hydropathy-legend">
            <rect
              x={paddingLeft}
              y={10}
              width={plotWidth}
              height={36}
              rx={6}
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1"
            />

            {/* Item 1: Hydropathy Curve */}
            <line
              x1={paddingLeft + 16}
              y1={28}
              x2={paddingLeft + 36}
              y2={28}
              stroke="#0f766e"
              strokeWidth="2.5"
            />
            <text
              x={paddingLeft + 42}
              y={32}
              fill="#334155"
              fontSize="11"
              fontWeight="500"
            >
              Hydropathy Curve (Window: {windowSize})
            </text>

            {/* Item 2: Hydrophobic (> 0) */}
            <rect
              x={paddingLeft + 235}
              y={22}
              width={14}
              height={12}
              rx={2}
              fill="#ccfbf1"
              stroke="#5eead4"
              strokeWidth="1"
            />
            <text
              x={paddingLeft + 255}
              y={32}
              fill="#334155"
              fontSize="11"
              fontWeight="500"
            >
              Hydrophobic (&gt; 0)
            </text>

            {/* Item 3: Hydrophilic (< 0) */}
            <rect
              x={paddingLeft + 395}
              y={22}
              width={14}
              height={12}
              rx={2}
              fill="#e0f2fe"
              stroke="#7dd3fc"
              strokeWidth="1"
            />
            <text
              x={paddingLeft + 415}
              y={32}
              fill="#334155"
              fontSize="11"
              fontWeight="500"
            >
              Hydrophilic (&lt; 0)
            </text>

            {/* Item 4: TM Threshold */}
            <line
              x1={paddingLeft + 540}
              y1={28}
              x2={paddingLeft + 562}
              y2={28}
              stroke="#ea580c"
              strokeWidth="1.8"
              strokeDasharray="4 3"
            />
            <text
              x={paddingLeft + 568}
              y={32}
              fill="#c2410c"
              fontSize="11"
              fontWeight="500"
            >
              Putative TM Core (&gt; 1.6)
            </text>
          </g>

          {/* Hydrophobic region fill (> 0) */}
          <path d={areaHydrophobic} fill="#ccfbf1" opacity="0.45" />

          {/* Hydrophilic region fill (< 0) */}
          <path d={areaHydrophilic} fill="#e0f2fe" opacity="0.45" />

          {/* Transmembrane threshold (+1.6) */}
          <line
            x1={paddingLeft}
            y1={tmThresholdY}
            x2={width - paddingRight}
            y2={tmThresholdY}
            stroke="#ea580c"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <text
            x={width - paddingRight - 4}
            y={tmThresholdY - 4}
            textAnchor="end"
            fill="#c2410c"
            fontSize="9"
            fontWeight="600"
          >
            TM Region Threshold (&gt; 1.6)
          </text>

          {/* Neutral line (0.0) */}
          <line
            x1={paddingLeft}
            y1={zeroY}
            x2={width - paddingRight}
            y2={zeroY}
            stroke="#94a3b8"
            strokeWidth="1.2"
          />

          {/* Y ticks & grid */}
          {yTicks.map((val) => {
            const y = posY(val);
            return (
              <g key={`y-${val}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* X ticks */}
          {xTicks.map((pos) => {
            const x = posX(pos - 1);
            return (
              <g key={`x-${pos}`}>
                <line
                  x1={x}
                  y1={height - paddingBottom}
                  x2={x}
                  y2={height - paddingBottom + 5}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - paddingBottom + 18}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                >
                  {pos}
                </text>
              </g>
            );
          })}

          {/* Axis Titles */}
          <text
            x={width / 2}
            y={height - 12}
            textAnchor="middle"
            fill="#334155"
            fontSize="12"
            fontWeight="600"
          >
            Residue Position (1 to {profile.length})
          </text>
          <text
            x={-height / 2}
            y={16}
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#334155"
            fontSize="12"
            fontWeight="600"
          >
            Hydropathy Score
          </text>

          {/* Hydropathy line */}
          <path
            d={pathD}
            fill="none"
            stroke="#0f766e"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover indicator line & dot */}
          {hoveredPoint && (
            <g>
              <line
                x1={posX(hoveredPoint.position - 1)}
                y1={paddingTop}
                x2={posX(hoveredPoint.position - 1)}
                y2={height - paddingBottom}
                stroke="#0f766e"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={posX(hoveredPoint.position - 1)}
                cy={posY(hoveredPoint.score)}
                r="5"
                fill="#0f766e"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Invisible hover capture rects */}
          {profile.map((pt, idx) => {
            const stepW = plotWidth / profile.length;
            const x = posX(idx) - stepW / 2;
            return (
              <rect
                key={idx}
                x={x}
                y={paddingTop}
                width={stepW}
                height={plotHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>

        {/* Floating tooltip */}
        {hoveredPoint && (
          <div
            className="absolute top-2 pointer-events-none bg-slate-900/90 text-white text-xs px-2.5 py-1.5 rounded shadow-lg flex items-center gap-3 backdrop-blur-sm"
            style={{
              left: `${Math.min(
                Math.max(
                  (posX(hoveredPoint.position - 1) / width) * 100,
                  10
                ),
                85
              )}%`,
            }}
          >
            <span>
              Residue:{" "}
              <strong className="text-teal-300 font-mono">
                {hoveredPoint.residue}
                {hoveredPoint.position}
              </strong>
            </span>
            <span>
              Score:{" "}
              <strong className="font-mono text-white">
                {hoveredPoint.score > 0 ? `+${hoveredPoint.score}` : hoveredPoint.score}
              </strong>
            </span>
            <span className="text-[10px] text-slate-300">
              {hoveredPoint.score > 0 ? "Hydrophobic" : "Hydrophilic"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
