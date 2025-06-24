import { type ReactElement } from "react";
import { useTeacherContext } from "../../hooks/useTeacher";
import PrimaryStat, { IPrimaryStatProps } from "./components/PrimaryStat";
import TeacherChart from "./components/TeacherChart";
import ActivityList from "../../../core/components/activity/ActivityList";

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

      {/* Stats */}
      <section className="flex max-h-[200px] h-[20%] gap-2">
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

      {/* Charts */}
      <section className="flex max-h-[1000px] h-[75%] gap-2">
        {/* Chart */}
        <TeacherChart classNames="w-[80%] h-full" />

        {/* Student activity */}
        <ActivityList
          classes="rounded-md bg-white shadow-sm w-[20%]"
          type="Teacher"
        ></ActivityList>
      </section>
    </main>
  );
}
