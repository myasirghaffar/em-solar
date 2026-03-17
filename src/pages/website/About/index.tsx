import { HeroSection, OurStorySection, MissionVisionSection, WhyChooseUsSection, CTASection } from "./features";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <OurStorySection />
      <MissionVisionSection />
      <WhyChooseUsSection />
      <CTASection />
    </div>
  );
}
