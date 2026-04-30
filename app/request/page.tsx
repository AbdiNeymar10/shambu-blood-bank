import { UrgentRequest, BloodRequestForm } from "@/components/request";

export const metadata = {
  title: "Request Blood | Shambu Blood Bank",
  description: "Submit a request for blood for a patient in need. We provide 24/7 emergency support and standard hospital requests.",
};

export default function RequestPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Request Blood
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are here to support patients and hospitals in times of need. Follow the instructions below to submit your request securely.
          </p>
        </div>
      </section>

      <UrgentRequest />
      <BloodRequestForm />
    </div>
  );
}
