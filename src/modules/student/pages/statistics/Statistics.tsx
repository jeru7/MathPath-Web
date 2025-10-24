import { type ReactElement } from "react";
import StudentHeatmap from "./components/StudentHeatmap";
import StudentTopicStats from "./components/StudentTopicStats";
import StatsOverviewCard from "./components/StatsOverviewCard";
import StudentStageStats from "./components/StudentStageStats";
import { useStudentContext } from "../../contexts/student.context";
// import StudentAssessmentStats from "./components/StudentAssessmentStats";
import StudentQuestionStats from "./components/StudentQuestionStats";
import { FaClockRotateLeft } from "react-icons/fa6";

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
            {/* <StudentAssessmentStats studentId={studentId} /> */}
            <div className="text-center space-y-3 w-full h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <FaClockRotateLeft className="w-4 h-4 text-gray-900 dark:text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Assessment Statistics
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                Assessment statistics are currently in development.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
