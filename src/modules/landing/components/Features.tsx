import { type ReactElement, useState } from "react";
import questImg from "../../../assets/images/features/questImg.png";
import battleImg from "../../../assets/images/features/battleImg.png";
import sunnyImg from "../../../assets/images/features/sunnyImg.png";
import badgeImg from "../../../assets/images/features/badgesImg.png";
import levelsImg from "../../../assets/images/features/levelsImg.png";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import GameFeatureCard from "./GameFeatureCard";
import "swiper/swiper-bundle.css";

const features = [
  {
    title: "Daily Quests",
    description:
      "Fresh challenges every day to keep you engaged and coming back for more",
    img: questImg,
  },
  {
    title: "Turn-Based Strategy",
    description:
      "Take your time planning each move in this thoughtful combat system",
    img: battleImg,
  },
  {
    title: "45 Challenging Levels",
    description: "Progress through diverse levels with increasing difficulty",
    img: levelsImg,
  },
  {
    title: "Chatbot Sunny",
    description:
      "Get help and companionship from Sunny, your friendly cat guide",
    img: sunnyImg,
  },
  {
    title: "Collect Badges",
    description:
      "Earn special badges as you achieve milestones and complete challenges",
    img: badgeImg,
  },
];

const mobileAnimationValue = {
  mobile: { delay: { img: 0.2, content: 0.2 } },
  desktop: null,
  onlyShowOnce: true,
};

const desktopAnimationValue = {
  mobile: null,
  desktop: { delay: { img: 0.3, content: 0.1 } },
  onlyShowOnce: false,
};

export default function Features(): ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      className="w-full min-h-screen py-32 px-8 bg-inherit text-white"
      id="features"
    >
      {/* header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-bold mb-3 text-primary">Game Features</h3>
        <p className="text-gray-300 max-w-md mx-auto">
          Discover what makes our game unique and engaging
        </p>
      </motion.div>

      {/* mobile layout */}
      <div className="flex w-full max-w-4xl flex-col lg:hidden">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <GameFeatureCard
              className="h-full w-full flex-col gap-6"
              imgSrc={feature.img}
              title={feature.title}
              description={feature.description}
              animation={mobileAnimationValue}
            />
          </motion.div>
        ))}
      </div>

      {/* desktop layout */}
      <div className="hidden lg:block w-full max-w-7xl mx-auto">
        <div className="h-[50vh] w-full">
          <Swiper
            direction="vertical"
            slidesPerView={1}
            spaceBetween={60}
            mousewheel={{
              forceToAxis: true,
              releaseOnEdges: true,
              sensitivity: 1,
            }}
            modules={[Mousewheel, Navigation]}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="h-full w-full"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index}>
                <GameFeatureCard
                  className="h-full w-full flex-row gap-12 px-4"
                  imgSrc={feature.img}
                  title={feature.title}
                  description={feature.description}
                  animation={desktopAnimationValue}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* feature counter */}
      <motion.div
        className="hidden lg:flex items-center gap-2 text-sm text-green-400 mx-auto justify-center mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="font-mono">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span>/</span>
        <span className="font-mono">
          {String(features.length).padStart(2, "0")}
        </span>
      </motion.div>
    </section>
  );
}
