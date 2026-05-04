import { DonorSidebar } from "@/components/donor/donor-sidebar";
import { DonorHeader } from "@/components/donor/donor-header";

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
