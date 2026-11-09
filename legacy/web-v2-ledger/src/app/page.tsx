import { brand } from "@/content/site";
import SmoothScroll from "@/components/motion/SmoothScroll";
import PageMotion from "@/components/motion/PageMotion";
import Header from "@/components/Header";
import MobileBar from "@/components/MobileBar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Results from "@/components/sections/Results";
import Accountant from "@/components/sections/Accountant";
import Faq from "@/components/sections/Faq";
import T from "@/components/ui/T";
import Pricing from "@/components/sections/Pricing";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main id="top" className="relative z-10">
        <Hero />
        <Problem />
        <Services />
        <Process />
        <Results />
        <Accountant />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <footer className="relative z-10 border-t border-line bg-ink pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8 lg:pb-8">
        <div className="container-x flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href="#top" className="font-display text-2xl">{brand.name}<span className="text-brass">.</span></a>
          <div className="flex flex-col gap-1 text-sm text-bone-dim sm:items-end">
            <a href={brand.phoneHref} className="hover:text-bone">{brand.phone}</a>
            <p><T>{brand.legal}</T></p>
            <p>© 2026 {brand.name}. {brand.tagline}.</p>
          </div>
        </div>
      </footer>
      <MobileBar />
      <PageMotion />
    </>
  );
}
