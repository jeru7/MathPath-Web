import { useEffect, useState, type ReactElement } from "react";
import ActiveStudentsPie from "./ActiveStudentsPie.js";
import {
  ActiveStudents,
  ActiveStudentsSections,
} from "../../../../types/active-student.type.js";

const COLORS = ["#347928", "#99D58D", "#F09319", "#FFE31A", "#F6FB7A"];
const OFFLINE_COLOR = "#a9a9a9";

export default function ActiveStudentsCard({
  classes,
}: {
  classes: string;
}): ReactElement {
  const [data, setData] = useState<ActiveStudents | null>(null);

  useEffect(() => {
    setData({
      totalPercentage: 50,
      sections: [
        { name: "Section 1", percentage: 20 },
        { name: "Section 2", percentage: 20 },
        { name: "Section 3", percentage: 10 },
      ],
    });
  }, []);

  if (!data) return <div>no data</div>;

  const chartData: ActiveStudentsSections[] = [
    ...data.sections,
    { name: "Offline", percentage: 100 - data.totalPercentage },
  ];

  const sectionColors = [
    ...COLORS.slice(0, data.sections.length),
    OFFLINE_COLOR,
  ];

  return (
    <article
      className={`${classes} bg-white shadow-sm rounded-md py-2 px-3 flex flex-col`}
    >
      <header>
        <p className="font-semibold text-md md:text-lg">Active Students</p>
      </header>

      <div className="flex gap-2 h-full">
        {/* Pie */}
        <ActiveStudentsPie
          classes="w-[60%] relative"
          chartData={chartData}
          sectionColors={sectionColors}
          totalPercentage={data.totalPercentage}
        />

        {/* Section label with colors */}
        <section className="w-[40%] flex flex-col justify-center p-2 text-sm">
          {data.sections.map((section, index) => (
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
