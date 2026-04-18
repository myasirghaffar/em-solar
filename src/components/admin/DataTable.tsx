import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  align?: "left" | "right" | "center";
  /** Extra classes on `<th>` */
  thClassName?: string;
  /** Extra classes on `<td>` */
  tdClassName?: string;
  cell: (row: T) => ReactNode;
};

export type DataTableProps<T> = {
  /** Section heading above the table (e.g. "Salespeople"). */
  title?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  /** Shown when `data.length === 0` and not loading. */
  emptyMessage?: string;
  loading?: boolean;
  /** Custom loading UI; default is a short text line. */
  loadingContent?: ReactNode;
  /** Wrapper for the scrollable table region. */
  className?: string;
};

function alignClass(align?: "left" | "right" | "center"): string {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

/**
 * Simple reusable admin table — column definitions + row renderer per cell.
 */
export default function DataTable<T>({
  title,
  columns,
  data,
  getRowKey,
  emptyMessage = "No rows to display.",
  loading = false,
  loadingContent,
  className = "",
}: DataTableProps<T>) {
  return (
    <div className={className}>
      {title ? <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2> : null}

      {loading ? (
        (loadingContent ?? <p className="text-slate-500">Loading…</p>)
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-slate-500">
                  {columns.map((col) => (
                    <th
                      key={col.id}
                      className={`py-2 pr-4 font-medium ${alignClass(col.align)} ${col.thClassName ?? ""}`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={getRowKey(row)} className="border-b border-gray-100">
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={`py-3 pr-4 ${alignClass(col.align)} ${col.tdClassName ?? ""}`}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.length === 0 ? (
            <p className="py-6 text-slate-500">{emptyMessage}</p>
          ) : null}
        </>
      )}
    </div>
  );
}
