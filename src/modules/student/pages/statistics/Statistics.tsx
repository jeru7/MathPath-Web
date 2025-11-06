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
    <div className="min-h-screen h-fit w-full p-2 flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold transition-colors duration-200">
          Statistics
        </h3>
      </header>
      <div className="flex flex-col gap-2 w-full flex-1">
        {/* first row: overview and heatmap */}
        <div className="flex-1 flex flex-col md:flex-row gap-2 w-full">
          <div className="flex w-full md:w-1/2 md:min-w-1/2">
            <StatsOverviewCard student={student} />
          </div>
          <div className="flex w-full md:w-1/2 md:min-w-1/2">
            <StudentHeatmap studentId={studentId} />
          </div>
        </div>

        {/* second row: topics and questions */}
        <div className="flex-1 flex flex-col md:flex-row gap-2 w-full">
          <div className="flex w-full md:w-1/2">
            <StudentTopicStats studentId={studentId} />
          </div>
          <div className="flex w-full md:w-1/2">
            <StudentQuestionStats studentId={studentId} />
          </div>
        </div>

        {/* third row: stage and assessments */}
        <div className="flex-1 flex flex-col md:flex-row gap-2 w-full">
          <div className="flex w-full md:w-1/2">
            <StudentStageStats studentId={studentId} />
          </div>
          <div className="flex w-full md:w-1/2">
            <StudentAssessmentStats />
          </div>
        </div>
      </div>
    </div>
  );
}
