import { type ReactElement } from "react";
import { AssessmentStatus } from "../../../../types/stats/assessment_status/assessment_status.types";
import AssessmentStatusItem from "./AssessmentStatusItem";

export default function AssessmentStatusCard({
  classes,
}: {
  classes: string;
}): ReactElement {
  const assessmentData: AssessmentStatus[] = [
    {
      name: "Frontend Fundamentals",
      status: "Completed",
      date: {
        start: "2025-04-01T00:00:00.000Z",
        end: "2025-04-07T00:00:00.000Z",
      },
      sections: [{ name: "HTML Basics", banner: "SBanner_1" }],
    },
    {
      name: "React Proficiency",
      status: "In Progress",
      date: {
        start: "2025-06-10T00:00:00.000Z",
        end: "2025-06-20T00:00:00.000Z",
      },
      sections: [
        { name: "React Components", banner: "SBanner_1" },
        { name: "State Management", banner: "SBanner_2" },
        { name: "Routing", banner: "SBanner_3" },
      ],
    },
    {
      name: "Backend Basics",
      status: "Completed",
      date: {
        start: "2025-05-15T00:00:00.000Z",
        end: "2025-05-22T00:00:00.000Z",
      },
      sections: [
        { name: "Node.js Introduction", banner: "SBanner_2" },
        { name: "Express.js Routing", banner: "SBanner_3" },
      ],
    },
  ];

  return (
    <article
      className={`${classes} bg-white shadow-sm rounded-md py-2 px-3 flex flex-col gap-1`}
    >
      <header className="border-b-1 border-b-gray-300 pb-1">
        <p className="font-semibold text-lg">Assessment Status</p>
      </header>

      <div className="h-[200px] overflow-y-auto">
        <section className="flex flex-col gap-1">
          {assessmentData.map((assessment, index) => (
            <AssessmentStatusItem
              classes=""
              assessmentData={assessment}
              key={index}
            />
          ))}
        </section>
      </div>
    </article>
  );
}
