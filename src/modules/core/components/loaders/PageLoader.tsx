import { type ReactElement, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PageLoaderProps = {
  items?: string[]; // messages to show
  interval?: number; // how long before switching
};

export default function PageLoader({
  items = ["Loading..."],
  interval = 2000,
}: PageLoaderProps): ReactElement {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items, interval]);

  return (
    <article className="flex flex-col items-center justify-center h-[100svh] w-[100svw] bg-white dark:bg-gray-800 p-6">
      {/* Spinner */}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mb-6"
      />

      {/* Message area */}
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-gray-900 dark:text-gray-100 text-lg font-medium text-center"
        >
          {items[index]}
        </motion.p>
      </AnimatePresence>
    </article>
  );
}
