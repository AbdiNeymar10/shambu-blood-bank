import { EventList } from "@/components/campaigns";
import { PageHero } from "@/components/shared";

export const metadata = {
  title: "Campaigns & Events | Shambu Blood Bank",
  description: "Discover upcoming blood drives, awareness campaigns, and community events near you.",
};

export default function CampaignsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Upcoming Events"
        highlight="Events"
        description="Find a blood drive near you or join one of our community awareness campaigns. Every event brings us closer to a safer tomorrow."
      />
      <EventList />
    </div>
  );
}
