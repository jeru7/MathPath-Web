import { type ReactElement } from "react";
import samplePic from "../../../assets/images/samplePic.jpg";
import { motion } from "framer-motion";

export default function Download(): ReactElement {
  return (
    <section className="font-jersey flex w-screen flex-col items-center justify-center gap-16 bg-[var(--primary-black)] px-8 text-[var(--primary-white)]" id="download">
      <div className="flex flex-col items-center gap-4">
        {/* mp title */}
        <motion.h3
          className="font-baloo text-5xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          MathPath
        </motion.h3>

        {/* mp icon */}
        <motion.img
          src={samplePic}
          className="rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        />

        {/* file size */}
        <motion.p
          className="text-md font-plexMono font-semibold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          130mb
        </motion.p>

        {/* download button */}
        <motion.button
          className="rounded-full bg-[var(--primary-yellow)] px-3 py-1 text-xl text-[var(--primary-black)] hover:scale-105 hover:cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          Download
        </motion.button>
      </div>
    </section>
  );
}
