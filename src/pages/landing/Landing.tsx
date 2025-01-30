import { type ReactElement } from "react";
import About from "./About";
import landingArt from "../../assets/landingArt.png";

export default function Landing(): ReactElement {
  return (
    <>
      <main className="w-full h-screen flex pt-24 justify-between items-center pl-48">
        <div className="flex-col justify-center flex w-[40%] h-[80%] gap-8">
          <h2 className="text-9xl text-wrap drop-shadow-[1px_1px_black] font-baloo font-bold text-[var(--color-green-primary)]">
            Welcome Back!
          </h2>
          <p className="font-bold text-4xl">Continue your learning journey with MathPath.</p>
          <a className="font-bold text-3xl text-[var(--color-green-primary)] underline">Download Now</a>
        </div>
        <img src={landingArt} className="h-full object-contain"></img>
      </main>
      <About />
    </>
  );
}
