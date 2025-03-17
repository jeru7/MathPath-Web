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
import { motion } from "framer-motion";

export default function Landing(): ReactElement {
  return (
    <div className="">
      <Parallax pages={2}>
        {/* Hero */}

        {/* background trees */}
        <ParallaxLayer offset={0} speed={0}>
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8)), url(${bgTrees})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* bottom fade - bg */}
          <div className="absolute bottom-0 left-0 h-60 w-full bg-gradient-to-t from-[#222222] to-transparent" />
        </ParallaxLayer>

        {/* upper trees */}
        <ParallaxLayer offset={0} speed={0.2}>
          <motion.div
            className="absolute left-0 right-0 top-0 min-h-[120px] w-full bg-cover bg-top md:bg-contain xl:h-[20vh] xl:bg-center"
            style={{
              backgroundImage: `url(${upperTrees})`,
              willChange: "transform",
            }}
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </ParallaxLayer>

        {/* bottom bush */}
        <ParallaxLayer offset={0} speed={0.1}>
          <motion.div
            className="md:bg-fill absolute bottom-0 left-1/2 h-[30vh] w-full -translate-x-1/2 bg-cover lg:bg-center"
            style={{
              backgroundImage: `url(${bottomBush})`,
              willChange: "transform",
            }}
            animate={{
              y: [0, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            {/* bottom fade - bush */}
            <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-[#222222] to-transparent" />
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={0}
          speed={0.35}
          className="flex h-screen items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: [0, -20, 0] }}
            transition={{
              opacity: { duration: 1, ease: "easeOut" },
              y: {
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              },
            }}
          >
            <Hero />
          </motion.div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}
