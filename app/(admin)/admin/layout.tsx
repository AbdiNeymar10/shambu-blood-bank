import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { requireAdmin } from "@/lib/rbac";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role check: user must be authenticated AND have the 'admin' role
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-secondary/20">
          {children}
        </main>
      </div>
    </div>
  );
}
