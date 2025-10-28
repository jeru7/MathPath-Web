import { type ReactElement } from "react";
import { useAdminContext } from "../../context/admin.context";
import CustomCalendar from "../../../core/components/calendar/CustomCalendar";
import PrimaryStat, { PrimaryStatProps } from "./PrimaryStat";

export default function AdminDashboard(): ReactElement {
  const { students, teachers, sections, assessments, onlineStudents } =
    useAdminContext();

  const primaryStats: PrimaryStatProps[] = [
    {
      color: "bg-[var(--primary-green)] dark:bg-[var(--primary-green-dark)]",
      title: "Students",
      students: students.length,
      onlineStudents: onlineStudents.length,
    },
    {
      color: "bg-blue-400 dark:bg-blue-800",
      title: "Teachers",
      teachers: teachers.length,
      sections: sections.length,
    },
    {
      color: "bg-[var(--primary-orange)] dark:bg-[var(--primary-orange-dark)]",
      title: "Sections",
      sections: sections.length,
    },
    {
      color:
        "bg-[var(--secondary-orange)] dark:bg-[var(--secondary-orange-dark)]",
      title: "Assessments",
      assessments: assessments.length,
    },
  ];

  return (
    <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-inherit p-2">
      {/* header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Dashboard
        </h3>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row gap-2">
        {/* left column - main content */}
        <div className="xl:w-[80%] flex-1 flex flex-col gap-2">
          <section className="flex min-h-[180px] xl:h-[200px] w-full gap-2 overflow-x-auto overflow-y-hidden xl:overflow-x-hidden no-scrollbar">
            {primaryStats.map((stat, index) => (
              <PrimaryStat
                key={index}
                title={stat.title}
                color={stat.color}
                students={stat.students}
                teachers={stat.teachers}
                sections={stat.sections}
                assessments={stat.assessments}
                onlineStudents={stat.onlineStudents}
              />
            ))}
          </section>

          <div className="w-full h-full flex flex-col gap-2">
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-sm p-2 border border-gray-200 dark:border-gray-700"></div>

            <div className="flex-1 bg-white dark:bg-gray-800 rounded-sm p-2 border border-gray-200 dark:border-gray-700"></div>
          </div>
        </div>

        {/* right column - sidebar */}
        <div className="w-full xl:w-[20%] flex flex-col gap-2">
          {/* calendar - full width in sidebar */}
          <div className="w-full">
            <CustomCalendar classes="" />
          </div>

          <div className="flex-1 w-full bg-white dark:bg-gray-800 rounded-sm p-2 border border-gray-200 dark:border-gray-700 min-h-[200px]"></div>

          <div className="flex-1 w-full bg-white dark:bg-gray-800 rounded-sm p-2 border border-gray-200 dark:border-gray-700 min-h-[200px]"></div>
        </div>
      </div>
    </main>
  );
}
