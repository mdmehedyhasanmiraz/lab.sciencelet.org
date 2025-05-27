import React from 'react';

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
    <div className="overflow-x-auto border border-gray-200 rounded-md">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs font-semibold">
          <tr>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Value</th>
            <th className="px-4 py-3">Reference</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-100"
            >
              <td className="px-4 py-3 font-medium text-gray-800">{row.label}</td>
              <td className="px-4 py-3 text-gray-700">
                {typeof row.value === 'boolean'
                  ? row.value
                    ? 'Yes'
                    : 'No'
                  : row.value ?? '—'}
              </td>
              <td className="px-4 py-3 text-blue-600">
                {row.reference ? (
                  <a
                    href={row.reference.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-800"
                  >
                    {row.reference.text}
                  </a>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
