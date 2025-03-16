import { type ReactElement } from "react";
import Features from "./section/Features";
import Members from "./section/Members";
import Download from "./section/Download";
import About from "./section/About";
import Hero from "./section/Hero";
import bgTrees from "../../assets/backgroundImage/bgTrees.png";
import upperTrees from "../../assets/svgs/upperTrees.svg";
import bottomBush from "../../assets/svgs/bottomBush.svg";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

export default function Landing(): ReactElement {
  return (
    <div className="">
      <Parallax pages={2}>
        {/* Hero */}
        <ParallaxLayer offset={0} speed={0}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8)), url(${bgTrees})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute bottom-0 left-0 h-80 w-full bg-gradient-to-t from-[#222222] to-transparent" />
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.2}>
          <div
            className="absolute left-0 right-0 top-0 max-h-[40vh] min-h-[120px] w-full bg-cover bg-top md:bg-contain xl:bg-center"
            style={{
              backgroundImage: `url(${upperTrees})`,
            }}
          />
          <div className="absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-black/60 to-transparent" />
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.1}>
          <div
            className="absolute bottom-0 left-1/2 h-[30vh] w-full -translate-x-1/2 bg-cover md:h-[20vh] md:bg-contain xl:bg-center"
            style={{
              backgroundImage: `url(${bottomBush})`,
            }}
          />
          <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#222222] to-transparent" />
        </ParallaxLayer>

        <ParallaxLayer
          offset={0}
          speed={0.35}
          className="flex h-screen items-center justify-center"
        >
          <Hero />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}
