import { CompanyStory, ImpactTimeline, TeamSection, TrustBadges } from "@/components/about";
import { CtaBanner } from "@/components/home/cta-banner";
import { PageHero } from "@/components/shared";

export const metadata = {
  title: "About Us | Shambu Blood Bank",
  description: "Learn about our mission, history, and the dedicated team working to ensure a safe and steady blood supply.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Dedicated to Saving Lives"
        highlight="Saving Lives"
        description="Discover the story behind Shambu Blood Bank, our core values, and the people who make it all possible."
        variant="gradient"
      />
      <CompanyStory />
      <TrustBadges />
      <ImpactTimeline />
      <TeamSection />
      <CtaBanner />
    </div>
  );
}
