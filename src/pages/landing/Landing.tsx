import { type ReactElement } from "react";
import LandingNav from "../../globals/components/LandingNav";
import Features from "./section/Features";
import Members from "./section/Members";
import Download from "./section/Download";
import About from "./section/About";
import Hero from "./section/Hero";
import Footer from "./section/Footer";

export default function Landing(): ReactElement {
  return (
    <>
      <LandingNav />
      <div className="font-gummy flex flex-col gap-16 bg-[var(--primary-black)]">
        <Hero />
        <Features />
        <About />
        <Members />
        <Download />
        <Footer />
      </div>
    </>
  );
}
