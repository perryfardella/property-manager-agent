"use client";

import { useState } from "react";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import FeaturesSection from "@/components/features-section";
import PricingSection from "@/components/pricing-section";
import FinalCTASection from "@/components/final-cta-section";
import HostAgentRoiCalculator from "@/components/roi-calculator";

export default function Home() {
  // Shared state for ROI calculator
  const [properties, setProperties] = useState(1);
  const [hoursPerMonth, setHoursPerMonth] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(50);

  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />

      {/* ROI Calculator */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <HostAgentRoiCalculator
          properties={properties}
          setProperties={setProperties}
          hoursPerMonth={hoursPerMonth}
          setHoursPerMonth={setHoursPerMonth}
          hourlyRate={hourlyRate}
          setHourlyRate={setHourlyRate}
        />
      </section>

      <PricingSection
        properties={properties}
        hoursPerMonth={hoursPerMonth}
        hourlyRate={hourlyRate}
      />
      <FinalCTASection />
    </div>
  );
}
