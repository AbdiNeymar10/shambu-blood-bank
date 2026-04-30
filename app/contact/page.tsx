import { ContactInfo, ContactForm, MapPlaceholder } from "@/components/contact";

export const metadata = {
  title: "Contact Us | Shambu Blood Bank",
  description: "Get in touch with Shambu Blood Bank. We are available 24/7 for emergency requests.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Whether you're looking to donate, request blood, or just have a question, our team is ready to assist you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

      <MapPlaceholder />
    </div>
  );
}
