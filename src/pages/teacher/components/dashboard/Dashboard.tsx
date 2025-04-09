import { type ReactElement } from "react";
import PrimaryStat, { IPrimaryStatProps } from "./PrimaryStat";
import { useTeacherData } from "../../../../hooks/useTeacherData";


export default function Dashboard(): ReactElement {
  const { students, sections, assessments } = useTeacherData();
  const primaryStats: IPrimaryStatProps[] = [
    {
      color: "bg-[var(--primary-green)]",
      title: "Students",
      students: students.length,
      // onlineStudents: stats.onlineStudents,
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
    <main className="flex h-full w-full flex-col gap-4 bg-inherit p-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Dashboard</h3>
        <div className="flex w-fit items-center gap-2">
          <p>Emmanuel Ungab</p>
          <div className="border-1 w-15 h-15 rounded-full"></div>
        </div>
      </header>

      {/* Stats */}
      <section className="flex grow-[2] gap-4">
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
      <section className="flex grow-[10] gap-4">
        {/* Main Chart */}
        <div className="grow-[3] border-2"></div>
        {/* Student activity */}
        <div className="grow-[1] border-2"></div>
      </section>
    </main>
  );
}
