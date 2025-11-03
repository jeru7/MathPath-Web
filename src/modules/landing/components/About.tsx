import { type ReactElement, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ghost from "../../../assets/images/enemy/Ghost.png";
import slime from "../../../assets/images/enemy/Slime.png";
import jiji from "../../../assets/images/enemy/JiJi.png";
import blissy from "../../../assets/images/enemy/Blissy.png";
import noroi from "../../../assets/images/enemy/Noroi.png";
import grimwhisker from "../../../assets/images/enemy/Grimwhisker.png";
import srinivasa from "../../../assets/images/enemy/Srinivasa.png";

const enemies = [
  { name: "Ghost", image: ghost },
  { name: "Slime", image: slime },
  { name: "Jiji", image: jiji },
  { name: "Blissy", image: blissy },
  { name: "Noroi", image: noroi },
  { name: "Grimwhisker", image: grimwhisker },
  { name: "Srinivasa", image: srinivasa },
];

const potions = ["Life Bloom", "Healing Dew", "Vita Nectar", "Regen Essence"];

export default function About(): ReactElement {
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);

  const nextEnemy = () => {
    setCurrentEnemyIndex((prev) => (prev + 1) % enemies.length);
  };

  const prevEnemy = () => {
    setCurrentEnemyIndex(
      (prev) => (prev - 1 + enemies.length) % enemies.length,
    );
  };

  const goToEnemy = (index: number) => {
    setCurrentEnemyIndex(index);
  };

  return (
    <section
      className="flex h-fit w-full flex-col items-center justify-center gap-4 bg-inherit px-6 py-16 text-white md:px-8 lg:py-20"
      id="about"
    >
      {/* header */}
      <motion.div
        className="flex flex-col items-center gap-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-bold tracking-tight lg:text-4xl">About</h3>
        <p className="max-w-md text-gray-300 text-sm lg:text-base">
          Discover the world of MathPath
        </p>
      </motion.div>

      {/* about content */}
      <motion.p
        className="max-w-4xl text-center text-gray-300 text-sm lg:text-base leading-relaxed mb-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        MathPath is an engaging turn-based mobile game designed specifically for
        Grade 10 ProbEx students. Master mathematical concepts through strategic
        battles, solve challenging problems to defeat enemies, and progress
        through an immersive learning adventure that makes Grade 10 mathematics
        exciting and interactive.
      </motion.p>

      <motion.div
        className="flex flex-col items-center gap-8 w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="text-center">
          <h4 className="text-2xl font-bold lg:text-3xl mb-2">Enemies</h4>
          <p className="text-gray-300 text-sm lg:text-base">
            Face challenging adversaries on your math journey
          </p>
        </div>

        <div className="relative w-full">
          <button
            onClick={prevEnemy}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gray-800/80 border border-gray-600 flex items-center justify-center hover:bg-gray-700/80 transition-all duration-300 hover:border-[var(--primary-green)] hover:scale-110"
            aria-label="Previous enemy"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextEnemy}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gray-800/80 border border-gray-600 flex items-center justify-center hover:bg-gray-700/80 transition-all duration-300 hover:border-[var(--primary-green)] hover:scale-110"
            aria-label="Next enemy"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>

          {/* vertical enemy card */}
          <div className="bg-transparent rounded-2xl p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEnemyIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 blur-xl opacity-50 animate-pulse"></div>

                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-2xl">
                      <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden border-2 border-white/10">
                        <img
                          src={enemies[currentEnemyIndex].image}
                          alt={enemies[currentEnemyIndex].name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -inset-4 border-2 border-purple-400/30 rounded-full"
                    />
                  </motion.div>
                </div>

                {/* enemy name */}
                <motion.h5
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="font-bold text-2xl lg:text-3xl text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  {enemies[currentEnemyIndex].name}
                </motion.h5>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* progress dots */}
        <div className="flex gap-2 mt-4">
          {enemies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToEnemy(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentEnemyIndex
                  ? "bg-[var(--primary-green)] scale-125"
                  : "bg-gray-600 hover:bg-gray-400"
                }`}
              aria-label={`Go to enemy ${index + 1}`}
            />
          ))}
        </div>

        {/* enemy counter */}
        <div className="text-center text-gray-400 text-sm">
          {currentEnemyIndex + 1} / {enemies.length}
        </div>
      </motion.div>

      {/* potions section - unchanged */}
      <motion.div
        className="flex flex-col items-center gap-4 w-full max-w-4xl mt-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h4 className="text-2xl font-bold lg:text-3xl">Potions</h4>
        <p className="text-gray-300 text-sm lg:text-base mb-4">
          Restore your abilities with powerful elixirs
        </p>
        <div className="grid grid-cols-2 gap-4 w-full">
          {potions.map((potion, index) => (
            <motion.div
              key={potion}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-600 hover:border-[var(--primary-green)] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white/20">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-white/30 to-transparent" />
                </div>
                <h5 className="font-semibold text-center text-sm lg:text-base">
                  {potion}
                </h5>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
