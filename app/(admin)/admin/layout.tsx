import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/rbac";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role check: user must be authenticated AND have the 'admin' role
  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}
