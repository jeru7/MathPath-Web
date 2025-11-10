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
    return <div className="text-foreground">Loading...</div>;
  }

  return (
    <main className="min-h-screen mt-4 lg:mt-0 h-fit w-full p-2 flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold transition-colors duration-200">
          Statistics
        </h3>
      </header>
      <div className="flex flex-col gap-2 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="w-full h-full">
            <StatsOverviewCard student={student} />
          </div>
          <div className="w-full h-full">
            <StudentHeatmap studentId={studentId} />
          </div>
          <div className="w-full h-full">
            <StudentTopicStats studentId={studentId} />
          </div>
          <div className="w-full h-full">
            <StudentQuestionStats studentId={studentId} />
          </div>
          <div className="w-full h-full">
            <StudentStageStats studentId={studentId} />
          </div>
          <div className="w-full h-full">
            <StudentAssessmentStats />
          </div>
        </div>
      </div>
    </main>
  );
}
