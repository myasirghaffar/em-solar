import { Target, Sun } from "lucide-react";

export function MissionVisionSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2 md:items-stretch">
          <div className="flex h-full min-h-0 flex-col rounded-2xl bg-[#0B2A4A] p-8 text-white">
            <Target className="mb-4 h-12 w-12 shrink-0 text-[#FF7A00]" />
            <h3 className="mb-4 text-2xl font-bold">Our Mission</h3>
            <p className="leading-relaxed text-gray-300">
              To accelerate Pakistan's transition to clean energy by providing high-quality solar
              products at competitive prices, backed by expert consultation and reliable after-sales
              support.
            </p>
          </div>
          <div className="flex h-full min-h-0 flex-col rounded-2xl bg-[#FF7A00] p-8 text-white">
            <Sun className="mb-4 h-12 w-12 shrink-0 text-white" />
            <h3 className="mb-4 text-2xl font-bold">Our Vision</h3>
            <p className="leading-relaxed">
              To become Pakistan's most trusted and innovative solar energy platform, leading the way
              in renewable energy solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
