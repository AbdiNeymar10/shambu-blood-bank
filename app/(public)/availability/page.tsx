import { SearchFilter, InventoryDashboard } from "@/components/availability";
import { PageHero } from "@/components/shared";
import { Clock } from "lucide-react";

export const metadata = {
  title: "Blood Availability | Shambu Blood Bank",
  description: "Check real-time blood inventory levels across our centers. See where your donation is needed most.",
};

export default function AvailabilityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <PageHero
        title="Real-Time Inventory"
        description="Monitor our current blood supply levels. Critical shortages highlight urgent needs where your donation can make an immediate difference."
        variant="muted"
        align="left"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-full border border-border shadow-sm w-fit">
          <Clock className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </PageHero>

      <section className="section-padding">
        <div className="container px-4 md:px-6">
          <SearchFilter />
          <InventoryDashboard />

          <div className="mt-16 bg-card border border-border p-8 rounded-2xl text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">Don&apos;t know your blood type?</h3>
            <p className="text-muted-foreground mb-6">
              That&apos;s perfectly fine! Most first-time donors don&apos;t know their type. We&apos;ll test it during your donation and let you know.
            </p>
            <a href="/donate" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Schedule a Donation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
