import { type ReactElement, useState } from "react";
import StagesStatistics from "./components/stage-statistics/StagesStatistics";
import AssessmentStatistics from "./components/assessment-statistics/AssessmentStatistics";
import TopicStatistics from "./components/topic-statistics/TopicStatistics";
import QuestionStatistics from "./components/question-statistics/QuestionStatistics";
import { useTeacherContext } from "../../context/teacher.context";
import TopicPredictionsModal from "./components/topic-statistics/TopicPredictionsModal";
import PredictionsCard from "./components/predictions/PredictionCard";

export default function Statistics(): ReactElement {
  const { teacherId } = useTeacherContext();
  const [isPredictionsModalOpen, setIsPredictionsModalOpen] = useState(false);

  return (
    <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-inherit p-2 mt-4 md:mt-0">
      {/* main header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          Statistics
        </h3>
      </header>

      {/* stats */}
      <section className="flex-1 w-full flex flex-col-reverse lg:flex-row gap-2">
        <section className="w-full flex flex-col gap-2">
          <AssessmentStatistics userType="teacher" userId={teacherId} />
          <PredictionsCard
            onViewPredictions={() => setIsPredictionsModalOpen(true)}
          />
          <TopicStatistics userType="teacher" userId={teacherId} />
          <QuestionStatistics userType="teacher" userId={teacherId} />
          <StagesStatistics userType="teacher" userId={teacherId} />
        </section>
      </section>

      {/* Topic Predictions Modal */}
      <TopicPredictionsModal
        isOpen={isPredictionsModalOpen}
        onClose={() => setIsPredictionsModalOpen(false)}
        userType="teacher"
        userId={teacherId}
      />
    </main>
  );
}
