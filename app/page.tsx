import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import FeaturesSection from "@/components/features-section";
import PricingSection from "@/components/pricing-section";
import FinalCTASection from "@/components/final-cta-section";
import HostAgentRoiCalculator from "@/components/roi-calculator";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />

      {/* ROI Calculator */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <HostAgentRoiCalculator />
      </section>

      <PricingSection />
      <FinalCTASection />
    </div>
  );
}
