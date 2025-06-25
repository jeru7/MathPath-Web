import { type ReactElement } from "react";
import { useTeacherContext } from "../../hooks/useTeacher";
import PrimaryStat, { IPrimaryStatProps } from "./components/PrimaryStat";
import ActivityList from "../../../core/components/activity/ActivityList";
import CustomCalendar from "../../../core/components/calendar/CustomCalendar";
import ActivityTrend from "../../../core/components/stats/activity_trend/ActivityTrend";

export default function TeacherDashboard(): ReactElement {
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
      <header className="flex items-center justify-between h-[5%]">
        <h3 className="text-2xl font-bold">Dashboard</h3>
      </header>

      <div className="h-[95%] flex gap-2">
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
            <div className="h-full w-full flex gap-2">
              <section className="h-full w-full bg-white shadow-sm rounded-md p-2">
                <header className="">
                  <p className="font-semibold text-lg">Active Students</p>
                </header>
              </section>
              <section className=" h-full w-full bg-white shadow-sm rounded-md p-2">
                <header>
                  <p className="font-semibold text-lg">Answer Correctness</p>
                </header>
              </section>
              <section className=" h-full w-full bg-white shadow-sm rounded-md p-2">
                <header className="border-b-gray-300 border-b-2 pb-1">
                  <p className="font-semibold text-lg">Active Assessments</p>
                </header>
              </section>
            </div>
          </div>
        </div>

        {/* Calendar and Activity list */}
        <div className="w-[20%] h-full flex flex-col gap-2">
          {/* Calendar */}
          <CustomCalendar />
          {/* Student activity */}
          <ActivityList
            classes="rounded-md bg-white shadow-sm w-full"
            type="Teacher"
          />
        </div>
      </div>
    </main>
  );
}
