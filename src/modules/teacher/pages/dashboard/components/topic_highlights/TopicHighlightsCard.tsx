import { type ReactElement } from "react";
import { FaMedal } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import CircularProgress from "../../../../../core/components/charts/CircularProgress";

export default function TopicHighlightsCard({
  classes,
}: {
  classes: string;
}): ReactElement {
  return (
    <article
      className={`${classes} bg-white shadow-sm rounded-md py-2 px-3 flex flex-col gap-3 pb-5`}
    >
      <header>
        <p className="font-semibold text-md md:text-lg">Topic Highlights</p>
      </header>

      <section className="flex gap-2 h-full">
        {/* Highest */}
        <article className="h-full w-full flex flex-col gap-2 items-center">
          <header className="flex items-center gap-2 w-full">
            <div className="flex items-center justify-center bg-[var(--primary-green)] rounded-full p-2">
              <FaMedal className="w-4 h-4 text-white" />
            </div>
            <h6 className="text-sm md:text-md font-semibold">
              Lowest: Permutation
            </h6>
          </header>
          <section className="flex h-full">
            <section className="w-full h-full flex items-center justify-center flex-col">
              <CircularProgress progress={74} color="var(--primary-green)" />
            </section>
            <section className="flex w-full flex-col text-sm  items-center justify-center">
              <article className="flex flex-col text-center w-full">
                <p>Stage</p>
                <p className="text-lg font-bold">4</p>
              </article>
              <article className="flex flex-col text-center w-full">
                <p>Attempts</p>
                <p className="text-lg font-bold">80</p>
              </article>
            </section>
          </section>
        </article>

        <div className="w-[2px] bg-gray-200"></div>

        {/* Lowest */}
        <article className="h-full w-full flex flex-col gap-2 items-center">
          <header className="flex items-center gap-2 w-full">
            <div className="flex items-center justify-center bg-[var(--primary-yellow)] rounded-full p-2">
              <IoWarning className="w-4 h-4 text-white" />
            </div>
            <h6 className="text-sm md:text-md font-semibold">
              Lowest: Permutation
            </h6>
          </header>
          <section className="flex h-full">
            <section className="w-full h-full flex items-center justify-center flex-col">
              <CircularProgress progress={20} color="var(--primary-yellow)" />
            </section>
            <section className="flex w-full flex-col text-sm  items-center justify-center">
              <article className="flex flex-col text-center w-full">
                <p>Stage</p>
                <p className="text-lg font-bold">17</p>
              </article>
              <article className="flex flex-col text-center w-full">
                <p>Attempts</p>
                <p className="text-lg font-bold">24</p>
              </article>
            </section>
          </section>
        </article>
      </section>
    </article>
  );
}
