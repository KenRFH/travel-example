import Navbar from "@/app/components/Navbar";
import HeroSection from "@/app/components/HeroSection";
import WhyChooseUs from "@/app/components/WhyChooseUs";
import PopularRoutes from "@/app/components/PopularRoutes";
import Testimonials from "@/app/components/Testimonials";
import CtaSection from "@/app/components/CtaSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <HeroSection />
        <WhyChooseUs />
        <PopularRoutes />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
