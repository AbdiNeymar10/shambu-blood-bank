import { 
  Hero,
  ImpactStats,
  BloodAvailability,
  WhyChooseUs,
  HowItWorks,
  BloodCompatibility,
  Testimonials,
  CampaignsPreview,
  BlogPreview,
  CtaBanner
} from "@/components/home";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <ImpactStats />
      <BloodAvailability />
      <WhyChooseUs />
      <HowItWorks />
      <BloodCompatibility />
      <Testimonials />
      <CampaignsPreview />
      <BlogPreview />
      <CtaBanner />
    </main>
  );
}
