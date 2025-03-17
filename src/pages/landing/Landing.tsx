import { type ReactElement } from "react";
import Features from "./section/Features";
import Members from "./section/Members";
import Download from "./section/Download";
import About from "./section/About";
import Hero from "./section/Hero";

export default function Landing(): ReactElement {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <About />
      <Members />
      <Download />
    </div>
  );
}
