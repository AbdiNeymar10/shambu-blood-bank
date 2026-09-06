import { DonorShell } from "@/components/donor/donor-shell";
import { requireDonor } from "@/lib/rbac";

export default async function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role check: user must be authenticated AND have the 'donor' role
  await requireDonor();

  return <DonorShell>{children}</DonorShell>;
}
