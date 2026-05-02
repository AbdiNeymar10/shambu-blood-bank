import { WhyDonate, Eligibility, DonationFaq, RegistrationForm } from "@/components/donate";
import { PageHero } from "@/components/shared";

export const metadata = {
  title: "Donate Blood | Shambu Blood Bank",
  description: "Schedule your blood donation today. Learn about eligibility, the donation process, and why your contribution is critical.",
};

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Give the Gift of Life"
        highlight="Life"
        description="Your single donation can save up to three lives. Join our community of everyday heroes and make an impact today."
        variant="gradient"
      />
      <WhyDonate />
      <Eligibility />
      <RegistrationForm />
      <DonationFaq />
    </div>
  );
}
