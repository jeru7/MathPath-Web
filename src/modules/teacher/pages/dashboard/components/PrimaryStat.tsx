import { type ReactElement } from "react";

import { PiStudent } from "react-icons/pi";
import { GrGroup } from "react-icons/gr";
import { IoIosDocument } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";
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
      navigate(`${location.pathname}/students`);
    } else if (title === "Sections") {
      navigate(`${location.pathname}/sections`);
    } else {
      navigate(`${location.pathname}/assessments`);
    }
  };
  return (
    <div
      className={`flex flex-1 min-w-[300px] flex-col rounded-sm p-2 md:p-4 text-white shadow-sm ${color}`}
    >
      <div className="flex w-full h-full">
        {/* Icon */}
        <div className="flex w-full items-center justify-center">
          <div className="bg-[var(--primary-white)]/50 flex h-fit w-fit rounded-full p-4 text-white">
            {title === "Students" ? (
              <PiStudent className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />
            ) : title === "Sections" ? (
              <GrGroup className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />
            ) : (
              <IoIosDocument className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />
            )}
          </div>
        </div>
        {/* Total Number */}
        <div className="w-full">
          <div className="text-right flex flex-col">
            <p className="md:text-xl lg:text-4xl">
              {title === "Students"
                ? students
                : title === "Sections"
                  ? sections
                  : assessments}
            </p>
            <p className="text-sm font-semibold text-nowrap md:text-lg">{`Total ${title}`}</p>
          </div>
        </div>
      </div>
      {/* Specific stat/detail */}
      <div className="flex h-fit items-end justify-between">
        <p className="text-[var(--primary-white)]/80 text-xs ">
          {title === "Students"
            ? `${onlineStudents ?? 0} online`
            : title === "Assessments"
              ? `${assessments ?? 0} in progress`
              : ""}
        </p>
        {/* Quick nav button */}
        <button
          className="bg-[var(--primary-white)]/50 hover:bg-[var(--primary-white)]/60 flex items-center gap-2 rounded-2xl px-3 py-2 font-semibold hover:cursor-pointer"
          onClick={navigateClickHandler}
        >
          <p className="text-nowrap text-[10px] md:text-xs">
            {title === "Students"
              ? "Check Students"
              : title === "Sections"
                ? "Check Sections"
                : "Check Assessments"}
          </p>
          <FaChevronRight className="w-2 h-2 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
}
