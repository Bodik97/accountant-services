import Motion from "@/animations/Motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Finances from "@/components/sections/Finances";
import Process from "@/components/sections/Process";
import Pricing from "@/components/sections/Pricing";
import Guarantees from "@/components/sections/Guarantees";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <a href="#main" data-skip-link className="sr-only z-[60] rounded-full bg-black px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        До змісту
      </a>
      <Header />
      <main id="top">
        <span id="main" tabIndex={-1} />
        <Hero />
        <About />
        <Services />
        <Finances />
        <Process />
        <Pricing />
        <Guarantees />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <Motion />
    </>
  );
}
