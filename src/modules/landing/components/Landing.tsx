import { type ReactElement, useState, useEffect } from "react";
import LandingNav from "./LandingNav";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import Members from "./Members";
import Download from "./Download";
import Footer from "./Footer";
import { motion } from "framer-motion";
import SplashScreen from "./SplashScreen";

export default function Landing(): ReactElement {
  const [showSplash, setShowSplash] = useState(true);
  const [isLandingPage, setIsLandingPage] = useState(false);

  useEffect(() => {
    const onLandingPage =
      window.location.pathname === "/" || window.location.pathname === "";

    setIsLandingPage(onLandingPage);

    if (!onLandingPage) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (isLandingPage && showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />
      <div className="font-jersey flex flex-col min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />

        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(green 2px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "40px 40px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="relative z-10">
          <Hero />
          <Features />
          <About />
          <Members />
          <Download />
          <Footer />
        </div>
      </div>
    </div>
  );
}
