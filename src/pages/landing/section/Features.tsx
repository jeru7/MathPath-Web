import { type ReactElement } from "react";
import samplePic from "../../../assets/images/samplePic.jpg";
import GameFeatureCard from "./components/GameFeatureCard";
import { motion } from "framer-motion";

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

export default function Features(): ReactElement {
  return (
    <section className="flex h-fit w-screen flex-col items-center justify-center gap-12 bg-[var(--primary-black)] px-4 pt-16 text-[var(--primary-white)]">
      <motion.h3
        className="text-4xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{once: true}}
      >
        Game Features
      </motion.h3>
      <div className="flex flex-col gap-16">
        {features.map((feature) => (
          <GameFeatureCard
            className=""
            imgSrc={feature.img}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
