import { UrgentRequest, BloodRequestForm } from "@/components/request";
import { PageHero } from "@/components/shared";

export const metadata = {
  title: "Request Blood | Shambu Blood Bank",
  description: "Submit a request for blood for a patient in need. We provide 24/7 emergency support and standard hospital requests.",
};

export default function RequestPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Request Blood"
        description="We are here to support patients and hospitals in times of need. Follow the instructions below to submit your request securely."
      />
      <UrgentRequest />
      <BloodRequestForm />
    </div>
  );
}
