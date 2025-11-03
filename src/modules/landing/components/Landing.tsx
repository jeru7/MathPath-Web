import { type ReactElement } from "react";
import LandingNav from "./LandingNav";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import Members from "./Members";
import Download from "./Download";
import Footer from "./Footer";

export default function Landing(): ReactElement {
  return (
    <>
      <LandingNav />
      <div className="font-gummy flex flex-col gap-16 bg-gradient-to-br from-gray-900 to-black">
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
