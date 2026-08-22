"use client";

import { useState, useEffect } from "react";
import { SearchFilter, InventoryDashboard } from "@/components/availability";
import { PageHero } from "@/components/shared";
import { Clock } from "lucide-react";
import { 
  getPublicAvailabilityData, 
  getInventoryHospitalOptions,
  type PublicBloodInventoryCard 
} from "@/lib/actions/inventory";

export default function AvailabilityPage() {
  const [hospitals, setHospitals] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedHospital, setSelectedHospital] = useState("all");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("all");
  const [items, setItems] = useState<PublicBloodInventoryCard[]>([]);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async (hospId?: string, bgFilter?: string) => {
    setIsLoading(true);
    const data = await getPublicAvailabilityData(hospId || selectedHospital, bgFilter || selectedBloodGroup);
    setItems(data.items);
    setLastUpdated(data.lastUpdated);
    setIsLoading(false);
  };

  useEffect(() => {
    async function init() {
      const hospOptions = await getInventoryHospitalOptions();
      setHospitals(hospOptions);
      loadData("all", "all");
    }
    init();
  }, []);

  const handleFilterSubmit = () => {
    loadData(selectedHospital, selectedBloodGroup);
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <PageHero
        title="Real-Time Inventory"
        description="Monitor our current blood supply levels. Critical shortages highlight urgent needs where your donation can make an immediate difference."
        variant="muted"
        align="left"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-full border border-border shadow-sm w-fit">
          <Clock className="w-4 h-4 text-primary" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </PageHero>

      <section className="section-padding">
        <div className="container px-4 md:px-6">
          <SearchFilter 
            hospitals={hospitals}
            selectedHospital={selectedHospital}
            selectedBloodGroup={selectedBloodGroup}
            onHospitalChange={setSelectedHospital}
            onBloodGroupChange={setSelectedBloodGroup}
            onFilterSubmit={handleFilterSubmit}
          />
          <InventoryDashboard items={items} isLoading={isLoading} />

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
