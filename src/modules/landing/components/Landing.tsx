import { type ReactElement } from "react";
import LandingNav from "./LandingNav";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import Members from "./Members";
import Download from "./Download";
import Footer from "./Footer";
import { motion } from "framer-motion";

export default function Landing(): ReactElement {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />
      <div className="font-jersey flex flex-col min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />

        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(green 2px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "40px 40px"],
          }}
        />

        <div className="relative z-10">
          <Hero />
          <Features />
          <About />
          <Members />
          <Download />
          <Footer />
        </div>
      </div>
    </div>
  );
}
