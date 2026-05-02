import { Motivation, CtaSection } from "@/components/become-a-donor";
import { HowItWorks } from "@/components/home/how-it-works";
import { PageHero } from "@/components/shared";

export const metadata = {
  title: "Become a Donor | Shambu Blood Bank",
  description: "Join our donor registry. Make a pledge to save lives and support your community.",
};

export default function BecomeDonorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Become a Registered Donor"
        highlight="Donor"
        description="Step up. Stand out. Save lives. Join our exclusive network of dedicated lifesavers."
      />
      <Motivation />
      <HowItWorks />
      <CtaSection />
    </div>
  );
}
