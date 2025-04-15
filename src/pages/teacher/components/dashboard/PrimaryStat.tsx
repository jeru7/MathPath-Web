import { type ReactElement } from "react";

import { User, Users, FileText, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();

  const navigateClickHandler = () => {
    if (title === "Students") {
      navigate(`${location.pathname}/students`)
    } else if (title === "Sections") {
      navigate(`${location.pathname}/sections`)
    } else {
      navigate(`${location.pathname}/assessments`)
    }
  }
  return (
    <div
      className={`flex w-full flex-col rounded-sm bg-[var(--primary-green)] p-4 text-white shadow-sm ${color}`}
    >
      <div className="flex w-full grow-[8]">
        {/* Icon */}
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
        {/* Total Number */}
        <div className="w-full">
          <div className="text-right">
            <p className="text-4xl">
              {title === "Students"
                ? students
                : title === "Sections"
                  ? sections
                  : assessments}
            </p>
            <p className="text-lg font-semibold">{`Total ${title}`}</p>
          </div>
        </div>
      </div>
      {/* Specific stat/detail */}
      <div className="flex h-fit items-end justify-between">
        <p className="text-[var(--primary-white)]/80 text-xs ">
          {title === "Students"
            ? `${onlineStudents ?? 0} online`
            : title === "Sections"
              ? "Last added data here"
              : `${assessments ?? 0} Active`}
        </p>
        {/* Quick nav button */}
        <button className="bg-[var(--primary-white)]/50 hover:bg-[var(--primary-white)]/60 flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold hover:cursor-pointer"
          onClick={navigateClickHandler}>
          <p>
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
