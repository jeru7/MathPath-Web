import { type ReactElement, useState } from "react";
import logo from "../../../assets/images/logo/Sunnyyyyyyyyy.png";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { TermsModal } from "./download/TermsModal";

export default function Download(): ReactElement {
  const [showTerms, setShowTerms] = useState(false);

  const features = [
    {
      icon: <IoSparkles className="text-2xl text-green-400" />,
      text: "Interactive Learning",
    },
  ];

  const handleDownloadClick = () => {
    setShowTerms(true);
  };

  return (
    <section
      className="w-full flex items-center py-12 md:py-20 bg-inherit min-h-screen text-white"
      id="download"
    >
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center text-center gap-6 md:gap-8"
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
              alt="Math-Path App Icon"
              className="w-24 h-24 md:w-32 md:h-32 rounded-lg border border-green-400/20"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-green-400">
              Math-Path 10
            </h1>
            <p className="text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base px-2">
              Transform your grade 10 math learning journey with our interactive
              and engaging educational platform.
            </p>

            <div className="flex justify-center gap-2 md:gap-4 mb-6 md:mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-1 md:gap-2 bg-gray-800/50 rounded-lg px-3 py-1.5 md:px-4 md:py-2 border border-green-400/20"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  {feature.icon}
                  <span className="text-gray-300 text-xs md:text-sm font-medium">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Button
                onClick={handleDownloadClick}
                className="bg-green-400 hover:bg-green-500 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-base h-auto"
                size="lg"
              >
                <FaDownload className="mr-2 text-lg md:text-xl" />
                Download Now
              </Button>
            </motion.div>

            {/* version info */}
            <motion.p
              className="text-gray-400 text-xs md:text-sm mt-3 md:mt-4"
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

      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
    </section>
  );
}
