import { WhyChooseUs } from "../Home/features/WhyChooseUs";
import { HeroSection, OurStorySection, MissionVisionSection, CTASection } from "./features";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <OurStorySection />
      <MissionVisionSection />
      <WhyChooseUs />
      <CTASection />
    </div>
  );
}
