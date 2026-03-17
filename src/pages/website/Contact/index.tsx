import { HeroSection, ContactInfoSection, ContactFormSection, MapSection } from "./features";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <ContactInfoSection />
            <ContactFormSection />
          </div>
        </div>
      </section>
      <MapSection />
    </div>
  );
}
