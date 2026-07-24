import { HeroSection } from "@/components/sections/hero";
import { PainPointsSection } from "@/components/sections/pain-points";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { AboutSection } from "@/components/sections/about-section";
import { CtaSection } from "@/components/sections/cta";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: siteConfig.name + " — " + siteConfig.tagline,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PainPointsSection />
      <TestimonialsSection />
      <AboutSection />
      <CtaSection />
    </>
  );
}
