import { type ReactElement } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import mathPathTitle from "../../../assets/svgs/mathPathTitle.svg";
import bgTrees from "../../../assets/backgroundImage/bgTrees.png";
import upperTrees from "../../../assets/svgs/upperTrees.svg";
import bottomBush from "../../../assets/svgs/bottomBush.svg";

export default function Hero(): ReactElement {
  const { scrollYProgress } = useScroll();

  const bgTreesY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const upperTreesY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const bottomBushY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <main className="relative flex h-screen w-screen justify-center overflow-hidden">
      {/* background trees */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8)), url(${bgTrees})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: bgTreesY,
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* upper trees */}
      <motion.div
        className="absolute left-0 right-0 top-0 min-h-[120px] w-full bg-cover bg-top md:bg-contain xl:h-[20vh] xl:bg-center"
        style={{
          backgroundImage: `url(${upperTrees})`,
          y: upperTreesY,
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

      {/* bottom bush */}
      <motion.div
        className="md:bg-fill absolute bottom-0 left-1/2 h-[30vh] w-full -translate-x-1/2 bg-cover lg:bg-center"
        style={{
          backgroundImage: `url(${bottomBush})`,
          y: bottomBushY,
          willChange: "transform",
        }}
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut",
        }}
      >
        {/* bottom fade effect */}
        <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-[#222222] to-transparent" />
      </motion.div>

      {/* hero content */}
      <motion.div
        className="relative z-10 flex w-full flex-col items-center justify-center gap-2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: [-20, -30, -10] }}
        transition={{
          opacity: { duration: 1, ease: "easeOut" },
          y: {
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          },
        }}
      >
        <img
          src={mathPathTitle}
          alt="MathPath Title"
          className="h-auto max-w-[80%] sm:h-auto sm:max-w-[60%]"
        />
        <button className="rounded-2xl border-2 border-[var(--parimary-white)] px-3 py-1 text-xl font-bold text-[var(--primary-white)] hover:scale-105 hover:cursor-pointer lg:text-2xl">
          Learn More
        </button>
      </motion.div>
    </main>
  );
}
