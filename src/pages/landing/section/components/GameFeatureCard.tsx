import { type ReactElement } from "react";
import { motion } from "framer-motion";

interface IGameFeatureCard {
  className?: string;
  imgSrc: string;
  title: string;
  description: string;
}

const GameFeatureCard: React.FC<IGameFeatureCard> = ({
  className,
  imgSrc,
  title,
  description,
}: IGameFeatureCard): ReactElement => {
  return (
    <div
      className={`${className} flex h-fit w-full flex-col items-center justify-center gap-6 text-[var(--primary-white)]`}
    >
      {/* image */}
      <motion.img
        src={imgSrc}
        alt={title}
        className="h-auto w-[80%] rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      />

      {/* title */}
      <div className="flex flex-col items-center gap-5">
        <motion.p
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.p>

        {/* description */}
        <motion.p
          className="text-center text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
};

export default GameFeatureCard;
