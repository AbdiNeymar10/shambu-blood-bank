import { WhyDonate, Eligibility, DonationFaq, RegistrationForm } from "@/components/donate";

export const metadata = {
  title: "Donate Blood | Shambu Blood Bank",
  description: "Schedule your blood donation today. Learn about eligibility, the donation process, and why your contribution is critical.",
};

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-primary/10 to-background relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent-crimson/20 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply" />

        <div className="container px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Give the Gift of <span className="text-primary">Life</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your single donation can save up to three lives. Join our community of everyday heroes and make an impact today.
          </p>
        </div>
      </section>

      <WhyDonate />
      <Eligibility />
      <RegistrationForm />
      <DonationFaq />
    </div>
  );
}
