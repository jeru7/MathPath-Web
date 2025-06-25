import { type ReactElement } from "react";
import { FaMedal } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";

export default function TopicHighlightsCard({
  classes,
}: {
  classes: string;
}): ReactElement {
  return (
    <article
      className={`${classes} bg-white shadow-sm rounded-md p-2 flex flex-col gap-3`}
    >
      <header>
        <p className="font-semibold text-lg">Topic Highlights</p>
      </header>
      <div className="flex flex-col gap-2 h-full">
        <article className="h-full flex flex-col gap-2">
          <header className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-[var(--primary-green)] rounded-full p-2">
              <FaMedal className="w-4 h-4 text-white" />
            </div>
            <h6 className="text-md font-semibold">Top: Geometry</h6>
          </header>
          <section className="flex justify-around">
            <article className="flex flex-col text-center w-full">
              <p>Stage</p>
              <p>5</p>
            </article>
            <article className="flex flex-col text-center w-full">
              <p>Total Attempts</p>
              <p>26</p>
            </article>
            <article className="flex flex-col text-center w-full">
              <p>Correctness</p>
              <p>80%</p>
            </article>
          </section>
        </article>
        {/* Lowest */}
        <article className="h-full flex flex-col gap-2">
          <header className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-[var(--primary-yellow)] rounded-full p-2">
              <IoWarning className="w-4 h-4 text-white" />
            </div>
            <h6 className="text-md font-semibold">Lowest: Permutation</h6>
          </header>
          <section className="flex justify-around">
            <article className="flex flex-col text-center w-full">
              <p>Stage</p>
              <p>17</p>
            </article>
            <article className="flex flex-col text-center w-full">
              <p>Total Attempts</p>
              <p>14</p>
            </article>
            <article className="flex flex-col text-center w-full">
              <p>Correctness</p>
              <p>26%</p>
            </article>
          </section>
        </article>
      </div>
    </article>
  );
}
