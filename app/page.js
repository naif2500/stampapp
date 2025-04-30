import Image from "next/image";
import HeroSection from "./components/Hero";
import Col from "./components/DoubleCol";
import FeatureSection from "./components/FeatureSection";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <div className=" items-center justify-items-center p-4 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main >
       <HeroSection />
       <Col />
      <FeatureSection />
      <CTASection />
  


      </main>
    
    </div>
  );
}
