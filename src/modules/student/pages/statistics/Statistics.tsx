import { type ReactElement } from "react";
import StudentHeatmap from "./components/StudentHeatmap";
import StudentTopicStats from "./components/StudentTopicStats";
import StatsOverviewCard from "./components/StatsOverviewCard";
import StudentStageStats from "./components/StudentStageStats";
import { useStudentContext } from "../../contexts/student.context";
import StudentAssessmentStats from "./components/StudentAssessmentStats";
import StudentQuestionStats from "./components/StudentQuestionStats";

export default function Statistics(): ReactElement {
  const { studentId, student } = useStudentContext();

  if (!student) {
    return <div className="text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  return (
    <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-inherit p-2 transition-colors duration-200">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Statistics
        </h3>
      </header>
      <div className="flex-1 flex flex-col gap-2 w-full">
        {/* first row: overview and heatmap */}
        <div className="flex-1 flex flex-col xl:flex-0 xl:flex-row gap-2 w-full">
          <section className="flex w-full shadow-sm rounded-sm overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <StatsOverviewCard student={student} />
          </section>
          <section className="flex w-full shadow-sm rounded-sm overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <StudentHeatmap studentId={studentId} />
          </section>
        </div>

        {/* second row: topics and questions */}
        <div className="flex-1 flex flex-col md:flex-row gap-2 h-80 w-full">
          <section className="flex w-full shadow-sm rounded-sm overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <StudentTopicStats studentId={studentId} />
          </section>

          <section className="flex w-full shadow-sm rounded-sm overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <StudentQuestionStats studentId={studentId} />
          </section>
        </div>

        {/* third row: stage and assessments */}
        <div className="flex-1 flex flex-col md:flex-row gap-2 h-80 w-full">
          <section className="flex w-full shadow-sm rounded-sm overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <StudentStageStats studentId={studentId} />
          </section>

          <section className="flex w-full shadow-sm rounded-sm overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <StudentAssessmentStats studentId={studentId} />
          </section>
        </div>
      </div>
    </main>
  );
}
