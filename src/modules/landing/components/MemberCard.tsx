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
      className={`${className} flex flex-col items-center text-center gap-4`}
    >
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br p-1">
          <img
            src={img}
            alt={name}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
      </motion.div>

      <motion.h4
        className="text-xl font-semibold text-primary"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        viewport={{ once: true }}
      >
        {name}
      </motion.h4>

      <div className="flex flex-col gap-1">
        <motion.p
          className="text-gray-300 text-sm"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          {role.first}
        </motion.p>

        {role.second && (
          <motion.p
            className="text-gray-300 text-sm"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
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
