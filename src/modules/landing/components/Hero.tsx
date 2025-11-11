import { type ReactElement, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import mathPathTitle from "../../../assets/svgs/mathpath-title.svg";
import bgTrees from "../../../assets/images/background-image/trees.png";
import upperTrees from "../../../assets/svgs/top-trees.svg";
import bottomBush from "../../../assets/svgs/bottom-bush.svg";

export default function Hero(): ReactElement {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgTreesY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const upperTreesY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const bottomBushY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  const bgTreesScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const upperTreesScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  return (
    <main
      ref={heroRef}
      className="relative flex h-screen w-screen justify-center overflow-hidden"
      id="hero"
    >
      {/* background trees */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8)), url(${bgTrees})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: bgTreesY,
          scale: bgTreesScale,
        }}
      />

      {/* upper trees */}
      <motion.div
        className="absolute left-0 right-0 top-0 min-h-[120px] w-full bg-cover bg-top md:bg-contain xl:h-[20vh] xl:bg-center"
        style={{
          backgroundImage: `url(${upperTrees})`,
          y: upperTreesY,
          scale: upperTreesScale,
        }}
      />

      {/* bottom bush */}
      <motion.div
        className="md:bg-fill absolute bottom-0 left-1/2 h-[30vh] w-full -translate-x-1/2 bg-cover lg:bg-center"
        style={{
          backgroundImage: `url(${bottomBush})`,
          y: bottomBushY,
        }}
      >
        {/* bottom fade effect */}
        <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-[#0A1F0A] via-[#0A1F0A]/50 to-transparent" />
      </motion.div>

      {/* hero content */}
      <motion.div
        className="relative z-10 flex w-full flex-col items-center justify-center gap-2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          opacity: { duration: 1, ease: "easeOut" },
          y: { duration: 1, ease: "easeOut" },
        }}
      >
        <motion.img
          src={mathPathTitle}
          alt="MathPath Title"
          className="h-auto max-w-[80%] sm:h-auto sm:max-w-[60%]"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        <button
          className="rounded-2xl border-2 border-[var(--parimary-white)] px-3 py-1 text-xl font-bold text-[var(--primary-white)] hover:scale-105 hover:cursor-pointer lg:text-2xl"
          onClick={() => {
            // tinatamad ako reuse yung isa
            const featuresSection = document.getElementById("features");
            if (featuresSection) {
              const offset =
                featuresSection.offsetTop -
                (window.innerHeight / 2 - featuresSection.clientHeight / 2);
              window.scrollTo({ top: offset, behavior: "smooth" });
            }
          }}
        >
          Learn More
        </button>
      </motion.div>
    </main>
  );
}
