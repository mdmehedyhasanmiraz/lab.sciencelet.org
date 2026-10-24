import React from 'react';
import { ExternalLink } from 'lucide-react';

type Row = {
  label: string;
  value: string | number | boolean | null | undefined;
  reference?: {
    text: string;
    url: string;
  };
};

type Props = {
  rows: Row[];
};

export default function DataTable({ rows }: Props) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-3 pr-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Property</th>
            <th className="py-3 px-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Value</th>
            <th className="py-3 pl-6 text-xs font-bold text-teal-950 uppercase tracking-wider">Reference / Method</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-slate-50/70 transition-colors"
            >
              <td className="py-3 pr-6 font-medium text-slate-800 text-xs sm:text-sm">{row.label}</td>
              <td className="py-3 px-6 text-slate-900 font-mono text-xs sm:text-sm font-semibold">
                {typeof row.value === 'boolean'
                  ? row.value
                    ? 'Yes'
                    : 'No'
                  : row.value ?? '—'}
              </td>
              <td className="py-3 pl-6 text-xs">
                {row.reference ? (
                  <a
                    href={row.reference.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-800 hover:text-teal-950 font-medium underline decoration-teal-300 hover:decoration-teal-600 transition-colors"
                  >
                    <span>{row.reference.text}</span>
                    <ExternalLink className="w-3 h-3 text-teal-600" />
                  </a>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
