import { type ReactElement } from "react";
import { motion } from "framer-motion";

export default function About(): ReactElement {
  return (
    <section className="flex h-fit w-screen flex-col justify-center gap-4 bg-[var(--primary-black)] px-8 text-[var(--primary-white)]">
      {/* divider */}
      <motion.div
        className="h-[1px] w-full bg-[var(--primary-green)]"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 0.8, scaleX: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      />

      {/* title */}
      <div className="flex w-full flex-col items-center justify-center gap-4 py-16">
        <motion.h3
          className="text-4xl font-bold md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          About
        </motion.h3>

        {/* content */}
        <motion.p
          className="max-w-3xl text-center text-lg text-[var(--primary-white)] md:text-xl lg:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
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
        viewport={{ once: true }}
      />
    </section>
  );
}
