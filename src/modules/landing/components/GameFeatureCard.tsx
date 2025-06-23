import { type ReactElement } from "react";
import { motion } from "framer-motion";

interface IGameFeatureCard {
  className?: string;
  imgSrc: string;
  title: string;
  description: string;
  animation: {
    mobile?: {
      delay: {
        img: number;
        content: number;
      };
    } | null;
    desktop?: {
      delay: {
        img: number;
        content: number;
      };
    } | null;
    onlyShowOnce: boolean;
  };
}

const GameFeatureCard: React.FC<IGameFeatureCard> = ({
  className,
  imgSrc,
  title,
  description,
  animation,
}: IGameFeatureCard): ReactElement => {
  return (
    <div
      className={`${className} flex h-full items-center justify-center text-[var(--primary-white)]`}
    >
      {/* image */}
      <motion.img
        src={imgSrc}
        alt={title}
        className="lg:w[50%]  h-full w-[80%] rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay:
            animation.mobile?.delay.img ?? animation.desktop?.delay.img ?? 0.2,
        }}
        viewport={{ once: animation.onlyShowOnce }}
      />

      {/* title */}
      <div className="flex flex-col items-center gap-5">
        <motion.p
          className="w-fit text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay:
              animation.mobile?.delay.content ??
              animation.desktop?.delay.content ??
              0.2,
          }}
          viewport={{ once: animation.onlyShowOnce }}
        >
          {title}
        </motion.p>

        {/* description */}
        <motion.p
          className="w-[80%] text-center text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.6, y: 0 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
            delay:
              animation.mobile?.delay.content ??
              animation.desktop?.delay.content ??
              0.2,
          }}
          viewport={{ once: animation.onlyShowOnce }}
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
};

export default GameFeatureCard;
