import { type ReactElement } from "react";
import mathPathTitle from "../../../assets/svgs/mathPathTitle.svg";

export default function Hero(): ReactElement {
  return (
    <main className="flex h-screen w-screen justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <img
          src={mathPathTitle}
          alt="MathPath Title"
          className="h-auto max-w-[80%] sm:h-auto sm:max-w-[60%]"
        />
        <button className="font-jersey hover:scale-101 rounded-2xl border-2 border-[var(--parimary-white)] px-3 py-1 text-xl text-[var(--primary-white)] hover:cursor-pointer lg:text-2xl">
          Learn More
        </button>
      </div>

    </main>
  );
}
