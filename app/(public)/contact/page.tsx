import { ContactInfo, ContactForm, MapPlaceholder } from "@/components/contact";
import { PageHero } from "@/components/shared";

export const metadata = {
  title: "Contact Us | Shambu Blood Bank",
  description: "Get in touch with Shambu Blood Bank. We are available 24/7 for emergency requests.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Contact Us"
        highlight="Us"
        description="Whether you're looking to donate, request blood, or just have a question, our team is ready to assist you."
      />

      <section className="section-padding">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

      <MapPlaceholder />
    </div>
  );
}
