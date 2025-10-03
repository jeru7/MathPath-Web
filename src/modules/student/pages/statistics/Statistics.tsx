import { type ReactElement } from "react";
import StudentQuestionStatistics from "./components/StudentQuestionStats";
import StudentHeatmap from "./components/StudentHeatmap";
import StudentTopicStats from "./components/StudentTopicStats";

export default function Statistics(): ReactElement {
  return (
    <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-inherit p-2">
      {/* main header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold">Statistics</h3>
      </header>
      <div className="flex-1 flex flex-col gap-2 w-full">
        {/* first row*/}
        <div className="flex gap-2 h-80 w-full">
          <section className="flex w-full shadow-sm rounded-sm overflow-hidden">
            <StudentTopicStats />
          </section>

          <section className="flex w-full shadow-sm rounded-sm overflow-hidden">
            <StudentQuestionStatistics />
          </section>
        </div>
        {/* first row*/}
        <div className="flex gap-2 h-80 w-full">
          <section className="flex w-full shadow-sm rounded-sm overflow-hidden">
            <StudentTopicStats />
          </section>

          <section className="flex w-full shadow-sm rounded-sm overflow-hidden">
            <StudentQuestionStatistics />
          </section>
        </div>
        {/* second row */}
        <div className="flex-1 flex flex-col xl:flex-0 xl:flex-row gap-2 h-fit lg:h-80 w-full">
          <section className="flex w-full shadow-sm rounded-sm overflow-hidden">
            <StudentHeatmap />
          </section>
        </div>
      </div>
    </main>
  );
}
