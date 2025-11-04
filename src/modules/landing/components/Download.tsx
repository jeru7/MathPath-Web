// TODO: improve, provide total downloads, file size, download instructions
import { type ReactElement } from "react";
import logo from "../../../assets/images/logo/Sunnyyyyyyyyy.png";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";

export default function Download(): ReactElement {
  const downloadUrl =
    "https://github.com/jeru7/MathPath-Server/releases/download/untagged-b08816de60ea5aa9eca0/Math-Path10.zip";

  const features = [
    {
      icon: <IoSparkles className="text-2xl text-[var(--primary-yellow)]" />,
      text: "Interactive Learning",
    },
  ];

  return (
    <section
      className="flex min-h-screen w-full items-center justify-center bg-inherit px-6 py-16"
      id="download"
    >
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          className="flex flex-col items-center text-center gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img
              src={logo}
              alt="MathPath App Icon"
              className="w-40 h-40 rounded-sm shadow-lg border border-white/10"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--primary-white)] mb-4">
              MathPath
            </h1>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Transform your grade 10 math learning journey with our interactive
              and engaging educational platform.
            </p>

            <div className="flex justify-center gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  {feature.icon}
                  <span className="text-gray-300 text-sm font-medium">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.a
              href={downloadUrl}
              download="Math-Path10.zip"
              className="group relative inline-flex items-center justify-center gap-3 bg-[var(--primary-yellow)] hover:bg-amber-400 text-slate-900 font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload className="text-xl" />
              Download Now
            </motion.a>

            {/* version info */}
            <motion.p
              className="text-gray-400 text-sm mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              Version 1.0.0 • Android
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
