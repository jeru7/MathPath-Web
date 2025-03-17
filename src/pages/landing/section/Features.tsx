import { useState, type ReactElement } from "react";
import samplePic from "../../../assets/images/samplePic.jpg";

const features = [
  {
    title: "Feature 1",
    description: "Feature Description",
    img: samplePic,
  },
  {
    title: "Feature 2",
    description: "Feature Description",
    img: samplePic,
  },
  {
    title: "Feature 3",
    description: "Feature Description",
    img: samplePic,
  },
];

export default function Features(): ReactElement {
  return (
    <section className="font-jersey flex h-screen w-screen items-center justify-center bg-[var(--primary-black)] text-[var(--primary-white)]">
      <h3>Game Features</h3>
    </section>
  );
}

