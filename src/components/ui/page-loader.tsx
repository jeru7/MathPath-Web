import { type ReactElement, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PageLoaderProps = {
  items?: string[]; // messages to rotate
  interval?: number; // time between message changes
};

export default function PageLoader({
  items = ["Loading..."],
  interval = 1000,
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
    <article className="flex flex-col items-center justify-center h-[100dvh] w-[100dvw] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] p-6">
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="w-12 h-12 border-4 border-[hsl(var(--muted))] border-t-[hsl(var(--primary))] rounded-full animate-spin mb-6"
      />

      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-medium text-center"
        >
          {items[index]}
        </motion.p>
      </AnimatePresence>
    </article>
  );
}
