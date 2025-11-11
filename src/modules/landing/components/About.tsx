import { type ReactElement, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ghost from "../../../assets/images/enemy/Ghost.png";
import slime from "../../../assets/images/enemy/Slime.png";
import jiji from "../../../assets/images/enemy/JiJi.png";
import blissy from "../../../assets/images/enemy/Blissy.png";
import noroi from "../../../assets/images/enemy/Noroi.png";
import grimwhisker from "../../../assets/images/enemy/Grimwhisker.png";
import srinivasa from "../../../assets/images/enemy/Srinivasa.png";
import regenEssence from "../../../assets/images/items/regenEssence.png";
import healingDew from "../../../assets/images/items/healingDew.png";
import lifeBloom from "../../../assets/images/items/lifeBloom.png";
import vitaNectar from "../../../assets/images/items/vitaNectar.png";

const enemies = [
  { name: "Ghost", image: ghost },
  { name: "Slime", image: slime },
  { name: "Jiji", image: jiji },
  { name: "Blissy", image: blissy },
  { name: "Noroi", image: noroi },
  { name: "Grimwhisker", image: grimwhisker },
  { name: "Srinivasa", image: srinivasa },
];

const potions = [
  {
    name: "Regen Essence",
    image: regenEssence,
    effect: "Gradual HP Recovery",
  },
  {
    name: "Healing Dew",
    image: healingDew,
    effect: "Moderate HP Recovery",
  },
  {
    name: "Life Bloom",
    image: lifeBloom,
    effect: "Major HP Recovery",
  },
  {
    name: "Vita Nectar",
    image: vitaNectar,
    effect: "Full HP Restoration",
  },
];

export default function About(): ReactElement {
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);

  const nextEnemy = useCallback(() => {
    setCurrentEnemyIndex((prev) => (prev + 1) % enemies.length);
  }, []);

  const prevEnemy = useCallback(() => {
    setCurrentEnemyIndex(
      (prev) => (prev - 1 + enemies.length) % enemies.length,
    );
  }, []);

  const goToEnemy = useCallback((index: number) => {
    setCurrentEnemyIndex(index);
  }, []);

  return (
    <section className="w-full py-20 px-8 bg-inherit text-white" id="about">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-3 text-primary">About</h3>
          <p className="text-gray-300">Discover the world of Math-Path</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-gray-300 leading-relaxed">
                Math-Path is an educational adventure designed to make learning
                mathematics both fun and meaningful. Created by a group of
                passionate college students, Math-Path blends the excitement of
                gaming with the depth of real mathematical learning.
              </p>

              <p className="text-gray-300 leading-relaxed">
                Math-Path website extends this experience beyond the game.
                Teachers can monitor student progress, identify their strengths
                and weaknesses, and even create customized tests. Students can
                track their in-game achievements, view their rankings, and take
                tests prepared by their teachers all in one place.
              </p>
            </motion.div>

            {/* potions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-bold mb-6 text-green-400">
                Healing Items
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {potions.map((potion, index) => (
                  <motion.div
                    key={potion.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-gray-800 flex items-center justify-center p-2 group-hover:bg-green-500/10 transition-colors">
                      <img
                        src={potion.image}
                        alt={potion.name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <h5 className="font-semibold text-sm mb-1 text-primary">
                      {potion.name}
                    </h5>
                    <p className="text-gray-400 text-xs">{potion.effect}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* enemy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h4 className="text-xl font-bold mb-2 text-green-400">Enemies</h4>
              <p className="text-gray-300 text-sm">
                Face challenging adversaries on your math journey
              </p>
            </div>

            <div className="relative">
              <button
                onClick={prevEnemy}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center hover:bg-gray-700 hover:border-green-500 transition-colors"
                aria-label="Previous enemy"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextEnemy}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center hover:bg-gray-700 hover:border-green-500 transition-colors"
                aria-label="Next enemy"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>

              <div className="px-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentEnemyIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-48 h-48 mx-auto mb-6 bg-gray-800 rounded-xl flex items-center justify-center p-6">
                      <img
                        src={enemies[currentEnemyIndex].image}
                        alt={enemies[currentEnemyIndex].name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <h5 className="font-bold text-2xl text-green-400">
                      {enemies[currentEnemyIndex].name}
                    </h5>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="flex gap-2">
                {enemies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToEnemy(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentEnemyIndex
                        ? "bg-green-500"
                        : "bg-gray-600 hover:bg-gray-400"
                      }`}
                    aria-label={`Go to enemy ${index + 1}`}
                  />
                ))}
              </div>
              <div className="text-gray-400 text-sm">
                {currentEnemyIndex + 1} / {enemies.length}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
