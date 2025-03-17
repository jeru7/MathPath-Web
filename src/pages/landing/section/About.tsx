import { type ReactElement } from "react";
import { motion } from "framer-motion";

export default function About(): ReactElement {
  return (
    <section className="flex h-fit w-screen flex-col justify-center gap-4 bg-[var(--primary-black)] px-8 pt-16 text-[var(--primary-white)]">
      {/* divider */}
      <motion.div
        className="h-[1px] w-full bg-[var(--primary-green)]"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 0.8, scaleX: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      <div className="flex w-full flex-col items-center justify-center gap-2">
        <motion.h3
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          About
        </motion.h3>

        {/* content */}
        <motion.p
          className="max-w-2xl text-center text-lg text-[var(--primary-white)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et
          hendrerit sapien. Aliquam erat volutpat. Integer leo diam, sagittis
          non faucibus a, fermentum sit amet mauris.
        </motion.p>
      </div>

      {/* divider */}
      <motion.div
        className="h-[1px] w-full bg-[var(--primary-green)]"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 0.8, scaleX: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </section>
  );
}
