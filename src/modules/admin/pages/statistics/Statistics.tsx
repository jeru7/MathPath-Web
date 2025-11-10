import AssessmentStatistics from "@/modules/teacher/pages/statistics/components/assessment-statistics/AssessmentStatistics";
import { type ReactElement } from "react";
import { useAdminContext } from "../../context/admin.context";
import TopicStatistics from "@/modules/teacher/pages/statistics/components/topic-statistics/TopicStatistics";
import QuestionStatistics from "@/modules/teacher/pages/statistics/components/question-statistics/QuestionStatistics";
import StagesStatistics from "@/modules/teacher/pages/statistics/components/stage-statistics/StagesStatistics";

export default function Statistics(): ReactElement {
  const { adminId } = useAdminContext();

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
          <AssessmentStatistics userType="admin" userId={adminId} />
          <TopicStatistics userType="admin" userId={adminId} />
          <QuestionStatistics userType="admin" userId={adminId} />
          <StagesStatistics userType="admin" userId={adminId} />
        </section>
      </section>
    </main>
  );
}
