import { type ReactElement } from "react";

import PrimaryStat, { IPrimaryStatProps } from "./PrimaryStat";

import { useAuth } from "../../../../hooks/useAuth";
import { useTeacherContext } from "../../../../hooks/useTeacher";
import TeacherChart from "./TeacherChart";

export default function Dashboard(): ReactElement {
  const { logout } = useAuth();
  const { teacher, students, sections, assessments, onlineStudents } =
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

  const handleLogoutClick = async () => {
    if (teacher) {
      logout(teacher._id);
    }
  };

  return (
    <main className="flex h-full w-full max-w-[2200px] flex-col gap-4 bg-inherit p-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Dashboard</h3>
        <button
          className="rounded-sm bg-red-400 px-4 py-1 hover:scale-105 hover:cursor-pointer"
          onClick={handleLogoutClick}
        >
          Logout
        </button>
        <div className="flex w-fit items-center gap-2">
          <p>{`${teacher?.firstName}, ${teacher?.lastName}`}</p>
          <div className="border-1 w-15 h-15 rounded-full"></div>
        </div>
      </header>

      {/* Stats */}
      <section className="flex max-h-[200px] grow-[2] gap-4">
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
      <section className="flex max-h-[600px] min-h-[400px] grow-[10] gap-4">
        {/* Chart */}
        <TeacherChart classNames="max-w-[1300px] w-full" />

        {/* Student activity */}
        <div className="grow-[1] rounded-md bg-white shadow-sm"></div>
      </section>
    </main>
  );
}
