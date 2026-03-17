interface SpecificationsTableProps {
  specs: Record<string, unknown>;
}

export function SpecificationsTable({ specs }: SpecificationsTableProps) {
  if (Object.keys(specs).length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[#0B2A4A] mb-6">Specifications</h2>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <tbody>
            {Object.entries(specs).map(([key, value]) => (
              <tr key={key} className="border-t">
                <td className="px-6 py-4 font-medium text-gray-700 bg-gray-50">{key}</td>
                <td className="px-6 py-4 text-gray-600">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
