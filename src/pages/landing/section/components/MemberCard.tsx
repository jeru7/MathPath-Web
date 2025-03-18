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
  className,
  img,
  name,
  role,
}: IMemberCard): ReactElement => {
  return (
    <div className={`${className} flex flex-col`}>
      {/* image */}
      <motion.img
        src={img}
        className="rounded-full"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      />

      {/* name */}
      <motion.p
        className="mt-2 text-lg font-semibold lg:text-2xl"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        {name}
      </motion.p>

      {/* roles */}
      <motion.p
        className="text-sm opacity-50 lg:text-lg"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        {role.first}
      </motion.p>
      {role.second && (
        <motion.p
          className="text-sm opacity-50 lg:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          {role.second}
        </motion.p>
      )}
    </div>
  );
};

export default MemberCard;
