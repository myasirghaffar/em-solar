import { Zap, Shield, Award, Leaf } from "lucide-react";

const features = [
  { icon: Zap, title: "High Quality", description: "Premium products from top global brands" },
  { icon: Shield, title: "Certified Equipment", description: "All products certified and warranty-backed" },
  { icon: Award, title: "Expert Support", description: "Professional consultation and installation guidance" },
  { icon: Leaf, title: "Sustainable", description: "Contributing to a greener Pakistan" },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0B2A4A] mb-4">Why Choose EnergyMart.pk?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the best solar solutions with unmatched quality and service</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
            <div key={feature.title} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <Icon className="w-12 h-12 text-[#FF7A00] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#0B2A4A] mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
