import { useEffect, useRef, type ReactElement } from "react";
import About from "./About";
import landingArt from "../../assets/landingArt.png";

export default function Landing(): ReactElement {
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.location.hash === "#about") {
      setTimeout(() => {
        aboutRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (
              entry.target === aboutRef.current &&
              window.location.hash !== "#about"
            ) {
              window.history.pushState(null, "", "#about");
            } else if (
              entry.target === heroRef.current &&
              window.location.hash !== "/"
            ) {
              window.history.pushState(null, "", "/");
            }
          }
        });
      },
      { threshold: 0.5 },
    );

    if (aboutRef.current) observer.observe(aboutRef.current);
    if (heroRef.current) observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash === "#about") {
        aboutRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        heroRef.current?.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", "/");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="hide-scrollbar h-screen snap-y overflow-y-scroll md:snap-mandatory">
      <main
        id="main-hero"
        ref={heroRef}
        className="flex h-screen snap-start items-center p-4 lg:gap-8 lg:pb-0 lg:pl-24 lg:pr-0 lg:pt-32 xl:pl-32"
      >
        <div className="font-baloo flex w-full flex-col gap-4 text-center lg:w-auto lg:text-left">
          <h3 className="font-outline  text-6xl font-bold text-[var(--color-green-primary)] md:text-8xl xl:text-9xl">
            WELCOME BACK!
          </h3>
          <p className="text-2xl font-semibold">
            Continue your learning journey with MathPath.
          </p>
          <p className="cursor-pointer text-2xl font-bold text-[var(--color-green-primary)] underline hover:scale-105 lg:w-fit">
            Download Now!
          </p>
        </div>
        <div className="hidden lg:block">
          <img src={landingArt} />
        </div>
      </main>
      <div ref={aboutRef} className="snap-start">
        <About />
      </div>
    </div>
  );
}
