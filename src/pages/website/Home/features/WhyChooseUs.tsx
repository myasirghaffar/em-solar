import { Zap, Shield, Award, Truck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "High Efficiency",
    description: "Premium solar products with up to 22% efficiency",
  },
  {
    icon: Shield,
    title: "Certified Equipment",
    description: "All products are certified and warranty-backed",
  },
  {
    icon: Award,
    title: "Warranty Support",
    description: "Comprehensive warranty on all products",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick delivery across Pakistan",
  },
];

export function WhyChooseUs() {
  return (
    <section id="about" className="py-40 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">
            Why Choose EnergyMart?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the best solar solutions
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="scroll-reveal text-center">
                <div className="w-20 h-20 bg-[#FF7A00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-10 h-10 text-[#FF7A00]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0B2A4A] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
