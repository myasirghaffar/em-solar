import { ConsultationForm } from "./ConsultationForm";

export function CTASection() {
  return (
    <section id="consultation" className="py-20 bg-gradient-to-r from-[#FF7A00] to-[#ff9429] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center scroll-reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Go Solar?</h2>
          <p className="text-xl mb-8 opacity-90">Get a free consultation and find the best solar solution for your home or business</p>
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
}
