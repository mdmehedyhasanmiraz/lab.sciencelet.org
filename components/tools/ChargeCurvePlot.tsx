"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, Check, ChevronDown } from "lucide-react";

interface ChargeCurvePlotProps {
  chargeCurve: Array<{ pH: number; charge: number }>;
  pI: number;
  netChargePH74: number;
}

export default function ChargeCurvePlot({
  chargeCurve,
  pI,
  netChargePH74,
}: ChargeCurvePlotProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ pH: number; charge: number } | null>(null);
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

  if (!chargeCurve || chargeCurve.length === 0) return null;

  // Plot bounds
  const charges = chargeCurve.map((d) => d.charge);
  const rawMin = Math.min(...charges, 0);
  const rawMax = Math.max(...charges, 0);
  const paddingCharge = Math.max(Math.abs(rawMax - rawMin) * 0.15, 2);
  const minCharge = Math.floor(rawMin - paddingCharge);
  const maxCharge = Math.ceil(rawMax + paddingCharge);

  const minPH = 2;
  const maxPH = 12;

  // Dimensions (top space for header legend)
  const width = 800;
  const height = 390;
  const paddingLeft = 65;
  const paddingRight = 40;
  const paddingTop = 60; // extra room above plot for clean legend
  const paddingBottom = 50;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const phToX = (pH: number) => paddingLeft + ((pH - minPH) / (maxPH - minPH)) * plotWidth;
  const chargeToY = (ch: number) =>
    paddingTop + ((maxCharge - ch) / (maxCharge - minCharge)) * plotHeight;

  // Path generator
  const points = chargeCurve.map((d) => `${phToX(d.pH).toFixed(1)},${chargeToY(d.charge).toFixed(1)}`);
  const pathD = `M ${points.join(" L ")}`;

  // Zero-line Y
  const zeroY = chargeToY(0);

  // Notable points
  const piX = phToX(pI);
  const ph74X = phToX(7.4);
  const ph74Y = chargeToY(netChargePH74);

  // Y-axis ticks
  const yTicks: number[] = [];
  const step = Math.max(1, Math.round((maxCharge - minCharge) / 6));
  for (let val = Math.ceil(minCharge / step) * step; val <= maxCharge; val += step) {
    yTicks.push(val);
  }

  // pH ticks
  const xTicks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
    link.download = `charge-ph-curve-pI-${pI.toFixed(2)}.svg`;
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
        link.download = `charge-ph-curve-${transparent ? "transparent" : "white"}-pI-${pI.toFixed(2)}.png`;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-800" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Net Charge vs. pH Titration Curve
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bjellqvist pKa model (Henderson-Hasselbalch equation) titration over pH 2.0 to 12.0
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Download Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-950 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-800" />
              <span>Export Chart</span>
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

      {/* Interactive SVG Plot */}
      <div className="relative mt-4 w-full overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[400px] font-sans"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="50%" stopColor="#115e59" />
              <stop offset="100%" stopColor="#134e4a" />
            </linearGradient>
          </defs>

          {/* Top Legend Bar (Clean borderless & transparent) */}
          <g id="chart-legend">
            {/* Legend Item 1: Curve */}
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
              Net Charge Curve
            </text>

            {/* Legend Item 2: Isoelectric Point (pI) */}
            <circle
              cx={paddingLeft + 185}
              cy={28}
              r={4.5}
              fill="#10b981"
              stroke="#065f46"
              strokeWidth="1.5"
            />
            <text
              x={paddingLeft + 196}
              y={32}
              fill="#334155"
              fontSize="11"
              fontWeight="500"
            >
              Isoelectric Point (pI = {pI.toFixed(2)})
            </text>

            {/* Legend Item 3: pH 7.4 Charge */}
            <circle
              cx={paddingLeft + 375}
              cy={28}
              r={4.5}
              fill="#0f766e"
              stroke="#134e4a"
              strokeWidth="1.5"
            />
            <text
              x={paddingLeft + 386}
              y={32}
              fill="#334155"
              fontSize="11"
              fontWeight="500"
            >
              Physiological Charge pH 7.4 ({netChargePH74 > 0 ? `+${netChargePH74}` : netChargePH74} e)
            </text>

            {/* Legend Item 4: Zero Neutral line */}
            <line
              x1={paddingLeft + 580}
              y1={28}
              x2={paddingLeft + 598}
              y2={28}
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text
              x={paddingLeft + 604}
              y={32}
              fill="#64748b"
              fontSize="11"
            >
              Neutral (0 e)
            </text>
          </g>

          {/* Neutral Charge reference line */}
          <line
            x1={paddingLeft}
            y1={zeroY}
            x2={width - paddingRight}
            y2={zeroY}
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={width - paddingRight + 6}
            y={zeroY + 3}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
          >
            0
          </text>

          {/* Grid lines: Y-axis */}
          {yTicks.map((val) => {
            const y = chargeToY(val);
            if (val === 0) return null;
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
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val > 0 ? `+${val}` : val}
                </text>
              </g>
            );
          })}

          {/* Grid lines: X-axis */}
          {xTicks.map((ph) => {
            const x = phToX(ph);
            return (
              <g key={`x-${ph}`}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={height - paddingBottom}
                  stroke="#f8fafc"
                  strokeWidth="1"
                />
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
                  fontSize="11"
                >
                  {ph}
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={width / 2}
            y={height - 12}
            textAnchor="middle"
            fill="#334155"
            fontSize="12"
            fontWeight="600"
          >
            pH
          </text>
          <text
            x={-height / 2}
            y={18}
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#334155"
            fontSize="12"
            fontWeight="600"
          >
            Theoretical Net Charge (e)
          </text>

          {/* The titration curve line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Marker: Isoelectric Point (pI) */}
          <line
            x1={piX}
            y1={paddingTop}
            x2={piX}
            y2={height - paddingBottom}
            stroke="#059669"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <circle
            cx={piX}
            cy={zeroY}
            r="6"
            fill="#10b981"
            stroke="#ffffff"
            strokeWidth="2"
            className="cursor-pointer"
          />
          <rect
            x={Math.min(piX + 6, width - paddingRight - 85)}
            y={zeroY - 26}
            width="75"
            height="20"
            rx="3"
            fill="#065f46"
          />
          <text
            x={Math.min(piX + 43, width - paddingRight - 47)}
            y={zeroY - 12}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontWeight="600"
            fontFamily="monospace"
          >
            pI = {pI.toFixed(2)}
          </text>

          {/* Marker: pH 7.4 */}
          <circle
            cx={ph74X}
            cy={ph74Y}
            r="5"
            fill="#0f766e"
            stroke="#ffffff"
            strokeWidth="2"
          />

          {/* Interactive hover points */}
          {chargeCurve.map((pt, idx) => {
            const x = phToX(pt.pH);
            const y = chargeToY(pt.charge);
            const isHovered = hoveredPoint?.pH === pt.pH;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 3}
                  fill={isHovered ? "#0f766e" : "#115e59"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* Active Hover Tooltip inside SVG */}
          {hoveredPoint && (
            <g
              transform={`translate(${Math.min(
                Math.max(phToX(hoveredPoint.pH) - 50, paddingLeft),
                width - paddingRight - 100
              )}, ${Math.max(chargeToY(hoveredPoint.charge) - 45, 10)})`}
            >
              <rect
                width="105"
                height="36"
                rx="4"
                fill="#0f172a"
                opacity="0.92"
              />
              <text x="8" y="15" fill="#94a3b8" fontSize="10">
                pH: <tspan fill="#ffffff" fontWeight="600">{hoveredPoint.pH.toFixed(1)}</tspan>
              </text>
              <text x="8" y="28" fill="#94a3b8" fontSize="10">
                Charge: <tspan fill="#38bdf8" fontWeight="600" fontFamily="monospace">
                  {hoveredPoint.charge > 0 ? `+${hoveredPoint.charge.toFixed(2)}` : hoveredPoint.charge.toFixed(2)}
                </tspan>
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-100">
        <div>
          <span className="text-slate-500 block">Acidic Elution (pH &lt; pI)</span>
          <span className="font-semibold text-slate-800">Cation Exchange (CEX)</span>
        </div>
        <div>
          <span className="text-slate-500 block">Basic Elution (pH &gt; pI)</span>
          <span className="font-semibold text-slate-800">Anion Exchange (AEX)</span>
        </div>
        <div>
          <span className="text-slate-500 block">Physiological Charge (pH 7.4)</span>
          <span className="font-semibold font-mono text-teal-900">
            {netChargePH74 > 0 ? `+${netChargePH74}` : netChargePH74} e
          </span>
        </div>
      </div>
    </div>
  );
}
