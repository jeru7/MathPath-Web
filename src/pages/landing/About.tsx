import { type ReactElement } from "react";
import MemberCard from "./components/MemberCard";

export default function About(): ReactElement {
  return <section className="px-4 py-2 xl:p-8 xl:pt-32">
    <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border-2 bg-[var(--color-green-secondary)] px-4 py-2 xl:p-16">
      <div className="font-baloo flex flex-col gap-2 p-4 text-center xl:gap-8">
      <div>
        <p className="font-outline text-2xl font-bold text-[var(--color-yellow)] sm:text-3xl md:text-4xl">Meet the team behind</p>
        <p className="font-outline text-5xl font-bold text-[var(--color-yellow)] sm:text-6xl md:text-7xl lg:text-8xl">MathPath</p>
      </div>
        <p className="font-primary">lorem ipsum dolor sit amet consectetur adipiscing elit volutpat gravida malesuada quam commodo id integer nam lorem ipsum dolor sit amet consectetur adipiscing elit volutpat gravida malesuada quam commodo id integer nam Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat gravida malesuada quam commodo id integer nam</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MemberCard/>
        <MemberCard/>
        <MemberCard/>
        <MemberCard/>
      </div>
    </div>   
  </section>;
}