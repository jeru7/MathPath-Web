import { type ReactElement } from "react";
import ActiveStudentsPie from "./ActiveStudentsPie.js";
import { useTeacherActiveStudent } from "../../../../services/teacher-stats.service.js";
import { useParams } from "react-router-dom";

const COLORS = ["#347928", "#99D58D", "#F09319", "#FFE31A", "#F6FB7A"];
const OFFLINE_COLOR = "#a9a9a9";

export default function ActiveStudentsCard({
  classes,
}: {
  classes: string;
}): ReactElement {
  const { teacherId } = useParams();
  const { data: activeStudents } = useTeacherActiveStudent(teacherId ?? "");

  const chartData =
    activeStudents?.totalPercentage === 0
      ? [{ name: "Offline", percentage: 100 }]
      : (activeStudents?.sections ?? []);

  const sectionColors =
    activeStudents?.totalPercentage === 0
      ? [OFFLINE_COLOR]
      : [...COLORS.slice(0, chartData.length), OFFLINE_COLOR];

  return (
    <article
      className={`${classes} bg-white shadow-sm rounded-sm p-2 flex flex-col`}
    >
      <header>
        <p className="font-semibold text-md md:text-lg">Active Students</p>
      </header>

      <div className="flex gap-1 xl:gap-3 h-full items-center justify-center">
        {/* Pie */}
        <ActiveStudentsPie
          classes="relative min-w-[150px]"
          chartData={chartData}
          sectionColors={sectionColors}
          totalPercentage={activeStudents?.totalPercentage ?? 0}
        />

        {/* Section label with colors */}
        <section className="flex flex-col justify-center p-2 text-sm">
          {activeStudents?.sections.map((section, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{section.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: OFFLINE_COLOR }}
            />
            <span>Offline</span>
          </div>
        </section>
      </div>
    </article>
  );
}
