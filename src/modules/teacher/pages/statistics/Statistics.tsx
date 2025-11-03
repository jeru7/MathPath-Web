import { type ReactElement } from "react";
import StagesStatistics from "./components/stage-statistics/StagesStatistics";
import AssessmentStatistics from "./components/assessment-statistics/AssessmentStatistics";
import TopicStatistics from "./components/topic-statistics/TopicStatistics";
import QuestionStatistics from "./components/question-statistics/QuestionStatistics";

export default function Statistics(): ReactElement {
  return (
    <main className="flex flex-col min-h-screen h-fit w-full max-w-[2200px] gap-2 bg-inherit p-2">
      {/* main header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-300">
          Statistics
        </h3>
      </header>

      {/* stats */}
      <section className="flex-1 w-full flex flex-col-reverse lg:flex-row gap-2">
        <section className="w-full flex flex-col gap-2">
          <AssessmentStatistics />
          <TopicStatistics />
          <QuestionStatistics />
          <StagesStatistics />
        </section>
      </section>
    </main>
  );
}
