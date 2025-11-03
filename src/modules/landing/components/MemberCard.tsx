import { type ReactElement } from "react";
import { motion } from "framer-motion";

interface IMemberCard {
  className?: string;
  img: string;
  name: string;
  role: {
    first: string;
    second?: string;
  };
}

const MemberCard: React.FC<IMemberCard> = ({
  className = "",
  img,
  name,
  role,
}: IMemberCard): ReactElement => {
  return (
    <div
      className={`${className} flex flex-col items-center text-center gap-1 sm:gap-2`}
    >
      <motion.div
        className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 aspect-square"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        <img
          src={img}
          alt={name}
          className="rounded-full w-full h-full object-cover shadow-md"
        />
      </motion.div>

      <motion.p
        className="mt-2 text-base font-semibold sm:text-lg md:text-xl lg:text-2xl"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
        viewport={{ once: true }}
      >
        {name}
      </motion.p>

      <div className="flex flex-col">
        <motion.p
          className="text-xs sm:text-sm md:text-base opacity-70"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          {role.first}
        </motion.p>

        {role.second && (
          <motion.p
            className="text-xs sm:text-sm md:text-base opacity-70"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
            viewport={{ once: true }}
          >
            {role.second}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
