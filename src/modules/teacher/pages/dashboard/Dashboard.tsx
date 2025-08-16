import { type ReactElement } from "react";
import PrimaryStat, { IPrimaryStatProps } from "./components/PrimaryStat";
import ActivityList from "../../../core/components/activity/ActivityList";
import CustomCalendar from "../../../core/components/calendar/CustomCalendar";
import ActivityTrend from "./components/activity_trend/ActivityTrend";
import ActiveStudentsCard from "./components/active_students/ActiveStudentsCard";
import TopicHighlightsCard from "./components/topic_highlights/TopicHighlightsCard";
import AssessmentStatusCard from "./components/assessment_status/AssessmentStatusCard";
import { useTeacherContext } from "../../context/teacher.context";

export default function Dashboard(): ReactElement {
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
    <main className="flex flex-col h-full w-full max-w-[2200px] gap-2 bg-inherit p-4">
      {/* header */}
      <header className="flex items-center justify-between py-1">
        <h3 className="text-xl sm:text-2xl font-bold">Dashboard</h3>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row gap-2 xl:min-h-[calc(100vh-5rem)]">
        {/* left column */}
        <div className="xl:w-[75%] flex-1 flex flex-col gap-2">
          {/* stats */}
          <section className="flex min-h-[120px] xl:h-[200px] xl:min-h-[200px] w-full xl:w-full gap-2 overflow-x-auto overflow-y-hidden xl:overflow-x-hidden no-scrollbar">
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

          {/* stage progression */}
          <div className="w-full h-fit">
            <ActivityTrend classes="" />
          </div>

          {/* active students, correct percentage, assessment status */}
          <div className="w-full h-full flex flex-col gap-2">
            <section className="h-full w-full flex flex-col lg:flex-row gap-2">
              <ActiveStudentsCard classes="flex-1" />
              <TopicHighlightsCard classes="flex-1" />
              <AssessmentStatusCard classes=" flex-1" />
            </section>
          </div>
        </div>

        {/* right column */}
        <div className="w-full xl:w-[25%] flex flex-col md:flex-row xl:flex-col gap-2">
          {/* calendar */}
          <CustomCalendar classes="" />
          {/* student activity */}
          <ActivityList
            classes="min-h-[400px] rounded-md bg-white w-full"
            type="Teacher"
          />
        </div>
      </div>
    </main>
  );
}
