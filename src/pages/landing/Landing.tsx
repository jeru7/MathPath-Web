import { type ReactElement } from "react";
import About from "./About";
import landingArt from "../../assets/landingArt.png";

export default function Landing(): ReactElement {
  return (
    <>
      <main className="flex h-screen items-center p-4 md:pl-16 lg:gap-8 lg:pb-0 lg:pr-0 lg:pt-32">
        <div className="font-baloo flex w-full flex-col gap-4 text-center lg:w-auto lg:text-left">
          <h3 className="font-outline  text-6xl font-bold text-[var(--color-green-primary)] md:text-8xl xl:text-9xl">WELCOME BACK!</h3>
          <p className="text-2xl font-semibold">Continue your learning journey with MathPath.</p>
          <p className=" text-2xl font-bold text-[var(--color-green-primary)] underline">Download Now!</p>
        </div>
        <div className="hidden lg:block">
          <img src={landingArt}/>
        </div>
      </main>
      <About />
    </>
  );
}
