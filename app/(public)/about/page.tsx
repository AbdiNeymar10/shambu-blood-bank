import { CompanyStory, ImpactTimeline, TeamSection, TrustBadges } from "@/components/about";
import { CtaBanner } from "@/components/home/cta-banner";

export const metadata = {
  title: "About Us | Shambu Blood Bank",
  description: "Learn about our mission, history, and the dedicated team working to ensure a safe and steady blood supply.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Dedicated to <span className="text-primary">Saving Lives</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the story behind Shambu Blood Bank, our core values, and the people who make it all possible.
          </p>
        </div>
      </section>

      <CompanyStory />
      <TrustBadges />
      <ImpactTimeline />
      <TeamSection />
      <CtaBanner />
    </div>
  );
}
