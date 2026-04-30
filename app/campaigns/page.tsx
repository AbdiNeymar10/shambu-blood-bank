import { EventList } from "@/components/campaigns";

export const metadata = {
  title: "Campaigns & Events | Shambu Blood Bank",
  description: "Discover upcoming blood drives, awareness campaigns, and community events near you.",
};

export default function CampaignsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
            Upcoming <span className="text-primary">Events</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find a blood drive near you or join one of our community awareness campaigns. Every event brings us closer to a safer tomorrow.
          </p>
        </div>
      </section>

      <EventList />
    </div>
  );
}
