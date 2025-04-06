import { type ReactElement } from "react";

import { User, Users, FileText, ChevronRight } from "lucide-react";

export interface IPrimaryStatProps {
  color: string;
  title: "Students" | "Sections" | "Assessments";
  students?: number;
  sections?: number;
  assessments?: number;
  onlineStudents?: number;
}

export default function PrimaryStat({
  color,
  title,
  students,
  sections,
  assessments,
  onlineStudents,
}: IPrimaryStatProps): ReactElement {
  return (
    <div
      className={`flex w-full flex-col rounded-2xl bg-[var(--primary-green)] p-4 text-white ${color}`}
    >
      <div className="flex w-full grow-[8]">
        <div className="flex w-full items-center justify-center">
          <div className="bg-[var(--primary-white)]/50 flex h-fit w-fit rounded-full p-4 text-white">
            {title === "Students" ? (
              <User className="h-20 w-20" />
            ) : title === "Sections" ? (
              <Users className="h-20 w-20" />
            ) : (
              <FileText className="h-20 w-20" />
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="text-right">
            <p className="text-4xl">
              {title === "Students"
                ? students
                : title === "Sections"
                  ? sections
                  : assessments}
            </p>
            <p>{`Total ${title}`}</p>
          </div>
        </div>
      </div>
      <div className="flex h-fit items-end justify-between">
        <p>
          {title === "Students"
            ? `${onlineStudents} online`
            : title === "Sections"
              ? "Last added data here"
              : "1 Active"}
        </p>
        <button className="bg-[var(--primary-white)]/50 hover:scale-101 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm hover:cursor-pointer">
          <p className="">
            {title === "Students"
              ? "Check Students"
              : title === "Sections"
                ? "Check Sections"
                : "Check Assessments"}
          </p>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
