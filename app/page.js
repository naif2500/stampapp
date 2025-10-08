import Image from "next/image";
import HeroSection from "./components/Hero";
import Col from "./components/DoubleCol";
import Col2 from "./components/DoubleCol2";
import FeatureSection from "./components/FeatureSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className=" items-center justify-items-center p-4 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main >
       <HeroSection />
       <Col />
        <Col2 />
      <FeatureSection />
      <CTASection />
  


      </main>
      <Footer />
    </div>
  );
}
