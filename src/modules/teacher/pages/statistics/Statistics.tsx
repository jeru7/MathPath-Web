import { type ReactElement } from "react";
import StagesStatistics from "./components/StagesStatistics";
import AssessmentStatistics from "./components/AssessmentStatistics";
import TopicStatistics from "./components/TopicStatistics";
import QuestionStatistics from "./components/QuestionStatistics";

export default function Statistics(): ReactElement {
  return (
    <main className="flex flex-col min-h-screen h-fit w-full max-w-[2200px] gap-2 bg-inherit p-2">
      {/* main header */}
      <header className="flex items-center justify-between py-1">
        <h3 className="text-xl sm:text-2xl font-bold">Statistics</h3>
      </header>

      {/* stats */}
      <section className="flex-1 w-full flex flex-col-reverse lg:flex-row gap-2">
        {/* stats: left column*/}
        <section className="w-full flex flex-col gap-2 xl:w-[80%]">
          <TopicStatistics />
          <QuestionStatistics />
          <StagesStatistics />
          <AssessmentStatistics />
        </section>

        {/* stats: right column*/}
        <section className="w-full xl:w-[20%] flex flex-col gap-2">
          <article className="rounded-sm bg-white shadow-sm p-2 h-56 lg:h-96">
            <header className="font-semibold text-lg">Top Students</header>
          </article>

          <article className="rounded-sm bg-white shadow-sm p-2 h-56 lg:h-96">
            <header className="font-semibold text-lg">Top Sections</header>
          </article>
        </section>
      </section>
    </main>
  );
}
