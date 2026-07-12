/** Simple status badge used on the storefront (e.g. order status). */
export function StatusPill({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
}) {
  const styles: Record<string, string> = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-rose-100 text-rose-600",
    info: "bg-blue-100 text-blue-600",
    purple: "bg-[#FF7A00]/12 text-[#FF7A00]",
  };

  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-3 text-xs font-bold ${styles[variant] || styles.default}`}
    >
      {label}
    </span>
  );
}
