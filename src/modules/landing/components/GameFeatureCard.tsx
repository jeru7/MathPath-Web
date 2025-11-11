import { type ReactElement, useState } from "react";
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
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`${className} flex items-center justify-center text-white`}>
      <motion.div
        className="flex items-center justify-center relative group"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay:
            animation.mobile?.delay.img ?? animation.desktop?.delay.img ?? 0.2,
        }}
        viewport={{ once: animation.onlyShowOnce }}
      >
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={imgSrc}
            alt={title}
            className={`h-auto w-full max-w-xl object-cover transition-all duration-700 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-lg" />
        )}
      </motion.div>

      <div className="flex flex-col items-center gap-6 lg:items-start lg:gap-6">
        <motion.div
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
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <div className="w-8 h-0.5 bg-green-500 mb-2" />
            <h4 className="text-2xl font-semibold tracking-tight lg:text-3xl text-green-400">
              {title}
            </h4>
          </div>

          <p className="max-w-md text-center text-gray-300 leading-relaxed lg:text-left lg:text-lg lg:max-w-lg">
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default GameFeatureCard;
