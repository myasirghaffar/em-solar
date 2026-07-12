interface SpecificationsTableProps {
  specs: Record<string, unknown>;
  /** Use `tab` when rendered inside product tabs (no section heading or outer spacing). */
  variant?: "standalone" | "tab";
}

export function SpecificationsTable({ specs, variant = "standalone" }: SpecificationsTableProps) {
  const entries = Object.entries(specs);
  const isTab = variant === "tab";

  if (entries.length === 0) {
    if (isTab) {
      return (
        <p className="text-gray-600">No specifications are listed for this product yet.</p>
      );
    }
    return null;
  }

  const list = (
    <dl className="max-w-2xl">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-1 gap-1 border-b border-gray-100 py-4 last:border-b-0 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-8 sm:py-5"
        >
          <dt className="text-sm font-medium text-gray-500">{key}</dt>
          <dd className="text-sm text-gray-800">{String(value)}</dd>
        </div>
      ))}
    </dl>
  );

  if (isTab) return list;

  return (
    <div className="mt-12 sm:mt-14">
      <h2 className="mb-6 text-2xl font-bold text-[#0B2A4A]">Specifications</h2>
      {list}
    </div>
  );
}
