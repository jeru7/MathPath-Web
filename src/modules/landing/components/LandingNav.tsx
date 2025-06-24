import { type ReactElement, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import mathPathLogo from "../../../assets/svgs/mathPathTitle.svg";
import { useNavigate } from "react-router-dom";

export default function LandingNav(): ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - window.innerHeight / 4);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const offset =
        section.offsetTop - (window.innerHeight / 2 - section.clientHeight / 2);
      window.scrollTo({ top: offset, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav
      className={`font-gummy fixed left-0 right-0 top-0 z-50 h-fit transition-all duration-300 ${
        scrolled ? "shadow-lg" : "bg-transparent"
      }`}
      style={scrolled ? { background: "#222222" } : {}}
    >
      <motion.div
        className="flex w-full items-center justify-between px-6 py-5 text-[var(--primary-white)] md:px-8 md:py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
        >
          {isMenuOpen ? <X size={36} /> : <Menu size={36} />}
        </button>
        <button
          className="font-baloo hidden text-4xl font-bold hover:cursor-pointer md:block md:text-3xl"
          onClick={() => scrollToSection("hero")}
        >
          MathPath
        </button>
        <div className="text-1xl hidden items-center justify-center font-bold md:flex md:gap-8 lg:gap-16 lg:text-2xl">
          <button
            className="opacity-80 hover:scale-105 hover:cursor-pointer hover:opacity-100"
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>
          <button
            className="opacity-80 hover:scale-105 hover:cursor-pointer hover:opacity-100"
            onClick={() => scrollToSection("about")}
          >
            About
          </button>
          <button
            className="opacity-80 hover:scale-105 hover:cursor-pointer hover:opacity-100"
            onClick={() => scrollToSection("members")}
          >
            Members
          </button>
          <button
            className="opacity-80 hover:scale-105 hover:cursor-pointer hover:opacity-100"
            onClick={() => scrollToSection("download")}
          >
            Download
          </button>
        </div>
        <button
          className="rounded-full md:border-2 md:border-[var(--primary-white)] md:px-5 md:py-1 md:hover:scale-105 md:hover:cursor-pointer lg:ml-12"
          onClick={() => navigate("/login")}
        >
          <p className="text-2xl font-bold md:text-3xl">Login</p>
        </button>
      </motion.div>

      {/* sidebar menu */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isMenuOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed left-0 top-0 h-screen w-2/3 bg-[#222222] text-white shadow-lg md:hidden"
      >
        <div className="flex flex-col items-center gap-6 p-6">
          <button onClick={() => setIsMenuOpen(false)} className="self-end">
            <X size={30} />
          </button>
          <button onClick={() => scrollToSection("hero")}>
            <img src={mathPathLogo} className="h-[10vh]" />
          </button>
          <button
            className="text-xl hover:opacity-80"
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>
          <button
            className="text-xl hover:opacity-80"
            onClick={() => scrollToSection("about")}
          >
            About
          </button>
          <button
            className="text-xl hover:opacity-80"
            onClick={() => scrollToSection("members")}
          >
            Members
          </button>
          <button
            className="text-xl hover:opacity-80"
            onClick={() => scrollToSection("download")}
          >
            Download
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
