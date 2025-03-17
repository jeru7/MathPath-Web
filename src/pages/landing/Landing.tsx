import { type ReactElement } from "react";
import Features from "./section/Features";
import Members from "./section/Members";
import Download from "./section/Download";
import About from "./section/About";
import Hero from "./section/Hero";

export default function Landing(): ReactElement {
  return (
    <div className="font-gummy flex flex-col bg-[var(--primary-black)]">
      <Hero />
      <Features />
      <About />
      <Members />
      <Download />
    </div>
  );
}
