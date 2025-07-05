import { type ReactElement } from "react";
import { useTeacherContext } from "../../hooks/useTeacher";
import PrimaryStat, { IPrimaryStatProps } from "./components/PrimaryStat";
import ActivityList from "../../../core/components/activity/ActivityList";
import CustomCalendar from "../../../core/components/calendar/CustomCalendar";
import ActivityTrend from "./components/activity_trend/ActivityTrend";
import ActiveStudentsCard from "./components/active_students/ActiveStudentsCard";
import TopicHighlightsCard from "./components/topic_highlights/TopicHighlightsCard";
import AssessmentStatusCard from "./components/assessment_status/AssessmentStatusCard";

export default function DashboardPage(): ReactElement {
  const { students, sections, assessments, onlineStudents } =
    useTeacherContext();

  const primaryStats: IPrimaryStatProps[] = [
    {
      color: "bg-[var(--primary-green)]",
      title: "Students",
      students: students.length,
      onlineStudents: onlineStudents.length,
    },
    {
      color: "bg-[var(--primary-orange)]",
      title: "Sections",
      sections: sections.length,
    },
    {
      color: "bg-[var(--secondary-orange)]",
      title: "Assessments",
      assessments: assessments.length,
    },
  ];

  return (
    <main className="flex h-screen w-full max-w-[2200px] flex-col gap-2 bg-inherit p-4">
      {/* Header */}
      <header className="flex items-center justify-between py-1">
        <h3 className="text-2xl font-bold">Dashboard</h3>
      </header>

      <div className="h-full flex gap-2">
        <div className="w-[80%] h-full flex flex-col gap-2">
          {/* Stats */}
          <section className="flex h-[20%] gap-2">
            {primaryStats.map((stat, index) => (
              <PrimaryStat
                key={index}
                title={stat.title}
                color={stat.color}
                students={stat.students}
                sections={stat.sections}
                assessments={stat.assessments}
                onlineStudents={stat.onlineStudents}
              />
            ))}
          </section>

          {/* Stage progression */}
          <div className="w-full h-[50%]">
            <ActivityTrend classes="w-full h-full max-h-[500px]" />
          </div>

          {/* Active students, Correct Percentage, Assessment Status */}
          <div className="w-full flex flex-col gap-2 h-[30%]">
            <section className="h-full w-full flex gap-2">
              <ActiveStudentsCard classes="h-full w-full" />
              <TopicHighlightsCard classes=" h-full w-full" />
              <AssessmentStatusCard classes=" h-full w-full" />
            </section>
          </div>
        </div>

        {/* Calendar and Activity list */}
        <div className="w-[20%] h-full flex flex-col gap-2">
          {/* Calendar */}
          <CustomCalendar />
          {/* Student activity */}
          <ActivityList classes="rounded-md bg-white w-full" type="Teacher" />
        </div>
      </div>
    </main>
  );
}
