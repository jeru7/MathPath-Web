import { type ReactElement } from "react";
import Nav from "../../globals/components/Nav"
import Features from "./section/Features";
import Members from "./section/Members";
import Download from "./section/Download";
import About from "./section/About";
import Hero from "./section/Hero";
import Footer from "./section/Footer";

export default function Landing(): ReactElement {
  return (
    <>
      <Nav />
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
