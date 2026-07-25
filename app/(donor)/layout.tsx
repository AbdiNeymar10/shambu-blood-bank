import { DonorSidebar } from "@/components/donor/donor-sidebar";
import { DonorHeader } from "@/components/donor/donor-header";
import { requireDonor } from "@/lib/rbac";

export default async function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role check: user must be authenticated AND have the 'donor' role
  await requireDonor();

  return (
    <div className="flex min-h-screen bg-background">
      <DonorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DonorHeader />
        <main className="flex-1 overflow-auto p-6 bg-secondary/10">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
