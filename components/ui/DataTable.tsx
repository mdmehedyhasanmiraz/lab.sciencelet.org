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
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Property</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Reference</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <td className="px-6 py-3 font-semibold text-slate-900">{row.label}</td>
              <td className="px-6 py-3 text-slate-700 font-mono">
                {typeof row.value === 'boolean'
                  ? row.value
                    ? 'Yes'
                    : 'No'
                  : row.value ?? '—'}
              </td>
              <td className="px-6 py-3">
                {row.reference ? (
                  <a
                    href={row.reference.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium underline decoration-blue-200 hover:decoration-blue-400 transition-colors"
                  >
                    {row.reference.text}
                    <ExternalLink className="w-3 h-3" />
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
