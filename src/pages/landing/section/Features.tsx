import { type ReactElement } from "react";
import samplePic from "../../../assets/images/samplePic.jpg";
import GameFeatureCard from "./components/GameFeatureCard";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";

const features = [
  {
    title: "Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo leo, hendrerit in tellus non, molestie rutrum orci. Aenean in nunc ut ante placerat congue quis sed purus",
    img: samplePic,
  },
  {
    title: "Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo leo, hendrerit in tellus non, molestie rutrum orci. Aenean in nunc ut ante placerat congue quis sed purus",
    img: samplePic,
  },
  {
    title: "Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo leo, hendrerit in tellus non, molestie rutrum orci. Aenean in nunc ut ante placerat congue quis sed purus",
    img: samplePic,
  },
];

const mobileAnimationValue = {
  mobile: {
    delay: {
      img: 0.2,
      content: 0.2,
    },
  },
  desktop: null,
  onlyShowOnce: true,
};

const desktopAnimationValue = {
  mobile: null,
  desktop: {
    delay: {
      img: 0.6,
      content: 0.2,
    },
  },
  onlyShowOnce: false,
};

export default function Features(): ReactElement {
  return (
    <section className="flex h-fit w-screen flex-col items-center justify-center gap-12 bg-[var(--primary-black)] px-8 text-[var(--primary-white)]">
      <motion.h3
        className="text-4xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        Game Features
      </motion.h3>

      {/* member cards mobile */}
      <div className="flex h-fit w-full flex-col gap-16 lg:hidden">
        {features.map((feature) => (
          <GameFeatureCard
            className="h-full w-full snap-center flex-col gap-6"
            imgSrc={feature.img}
            title={feature.title}
            description={feature.description}
            animation={mobileAnimationValue}
          />
        ))}
      </div>

      {/* member cards desktop */}
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={64}
        mousewheel={{ forceToAxis: true }}
        touchStartPreventDefault={false}
        touchMoveStopPropagation={true}
        simulateTouch={true}
        className="hidden h-[50vh] w-full overflow-y-hidden overscroll-none p-8 lg:flex"
        modules={[Mousewheel]}
      >
        {features.map((feature, index) => (
          <SwiperSlide key={index} className="h-full snap-center">
            <GameFeatureCard
              className="h-full w-full flex-row lg:gap-24 xl:px-32"
              imgSrc={feature.img}
              title={feature.title}
              description={feature.description}
              animation={desktopAnimationValue}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
