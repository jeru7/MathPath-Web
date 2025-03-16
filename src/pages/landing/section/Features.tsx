import { type ReactElement } from "react";
import GameFeatureCard from "./components/GameFeatureCard";
import samplePic from "../../../assets/images/samplePic.jpg";

export default function Features(): ReactElement {
  return (
    <section className="font-jersey h-fit w-screen text-[var(--primary-white)]">
      <div className="flex h-full w-full flex-col items-center gap-2">
        <h3 className="text-4xl">Game Features</h3>
      </div>
    </section>
  );
}
