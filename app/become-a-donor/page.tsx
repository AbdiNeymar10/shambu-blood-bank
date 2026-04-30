import { Motivation, CtaSection } from "@/components/become-a-donor";
import { HowItWorks } from "@/components/home/how-it-works";

export const metadata = {
  title: "Become a Donor | Shambu Blood Bank",
  description: "Join our donor registry. Make a pledge to save lives and support your community.",
};

export default function BecomeDonorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
            Become a Registered <span className="text-primary">Donor</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Step up. Stand out. Save lives. Join our exclusive network of dedicated lifesavers.
          </p>
        </div>
      </section>

      <Motivation />
      <HowItWorks />
      <CtaSection />
    </div>
  );
}
