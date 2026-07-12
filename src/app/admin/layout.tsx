import AuthGate from "@/components/AuthGate";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate requireAdmin>
      <AdminLayout>{children}</AdminLayout>
    </AuthGate>
  );
}
