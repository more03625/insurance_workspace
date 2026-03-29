import LoadingSpinner from './LoadingSpinner';

export default function DataTable({ columns, data, loading, emptyMessage = 'No records found.', onRowClick }) {
  if (loading) return <LoadingSpinner />;

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Card layout on small screens */}
      <div className="divide-y divide-gray-100 sm:hidden">
        {data.map((row, idx) => (
          <div
            key={row.id || idx}
            onClick={() => onRowClick?.(row)}
            className={`space-y-1 px-4 py-3 ${onRowClick ? 'cursor-pointer active:bg-indigo-50' : ''}`}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between gap-2">
                <span className="flex-shrink-0 text-xs font-medium text-gray-500">{col.label}</span>
                <span className="text-right text-sm text-gray-900">
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Table layout on sm+ screens */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-indigo-50' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
