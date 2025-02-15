import { type ReactElement } from "react";
import MemberCard from "./components/MemberCard";
import kathPhoto from "../../assets/kath.png";
import samPhoto from "../../assets/sam.png";
import laPhoto from "../../assets/la.png";
import emmanPhoto from "../../assets/emman.png";

export default function About(): ReactElement {
  return (
    <section
      id="about"
      className="h-full snap-start px-4 py-2 pt-28 md:p-8 md:px-8 md:pt-32 "
    >
      <div className="flex h-auto flex-col justify-around gap-4 rounded-2xl border-2 bg-[var(--color-green-secondary)] px-4 py-8 md:px-8">
        <div className="font-baloo flex flex-col gap-2 p-4 text-center md:px-16 xl:gap-8">
          <div>
            <p className="font-outline text-2xl font-bold text-[var(--color-yellow)] sm:text-3xl md:text-4xl lg:text-6xl">
              Meet the team behind
            </p>
            <p className="font-outline text-5xl font-bold text-[var(--color-yellow)] sm:text-6xl md:text-7xl lg:text-9xl">
              MathPath
            </p>
          </div>
          <p className="font-primary sm:text-lg md:text-xl">
            lorem ipsum dolor sit amet consectetur adipiscing elit volutpat
            gravida malesuada quam commodo id integer nam lorem ipsum dolor sit
            amet consectetur adipiscing elit volutpat gravida malesuada quam
            commodo id integer nam Lorem ipsum dolor sit amet consectetur
            adipiscing elit volutpat gravida malesuada quam commodo id integer
            nam
          </p>
        </div>
        <div className="grid h-auto grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MemberCard photo={emmanPhoto} name="Ungab, John Emmanuel" />
          <MemberCard photo={laPhoto} name="Ventura, Lorriel Ann" />
          <MemberCard photo={kathPhoto} name="Dayoha, Kathleen Kate" />
          <MemberCard photo={samPhoto} name="Marquez, Oliver Sam" />
        </div>
      </div>
    </section>
  );
}
