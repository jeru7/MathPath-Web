import { type ReactElement } from "react";
import { PiStudent } from "react-icons/pi";
import { GrGroup } from "react-icons/gr";
import { IoIosDocument } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export type PrimaryStatProps = {
  color: string;
  title: "Students" | "Teachers" | "Sections" | "Assessments";
  students?: number;
  teachers?: number;
  sections?: number;
  assessments?: number;
  onlineStudents?: number;
};

export default function PrimaryStat({
  color,
  title,
  students,
  teachers,
  sections,
  assessments,
  onlineStudents,
}: PrimaryStatProps): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateClickHandler = () => {
    if (title === "Students") {
      navigate(`${location.pathname}/students`);
    } else if (title === "Teachers") {
      navigate(`${location.pathname}/teachers`);
    } else if (title === "Sections") {
      navigate(`${location.pathname}/sections`);
    } else {
      navigate(`${location.pathname}/assessments`);
    }
  };

  const getIcon = () => {
    switch (title) {
      case "Students":
        return (
          <PiStudent className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />
        );
      case "Teachers":
        return (
          <FaChalkboardTeacher className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />
        );
      case "Sections":
        return <GrGroup className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />;
      case "Assessments":
        return (
          <IoIosDocument className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />
        );
      default:
        return <GrGroup className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />;
    }
  };

  const getValue = () => {
    switch (title) {
      case "Students":
        return students;
      case "Teachers":
        return teachers;
      case "Sections":
        return sections;
      case "Assessments":
        return assessments;
      default:
        return 0;
    }
  };

  const getSubtitle = () => {
    switch (title) {
      case "Students":
        return `${onlineStudents ?? 0} online`;
      case "Teachers":
        return `${sections ?? 0} sections`;
      case "Sections":
        return "Active classes";
      default:
        return "";
    }
  };

  const getButtonText = () => {
    switch (title) {
      case "Students":
        return "Check Students";
      case "Teachers":
        return "Check Teachers";
      case "Sections":
        return "Check Sections";
      case "Assessments":
        return "Check Assessments";
      default:
        return "Check";
    }
  };

  return (
    <div
      className={`flex flex-1 min-w-[300px] flex-col rounded-sm p-2 text-white shadow-sm ${color}`}
    >
      <div className="flex w-full h-full">
        {/* icon */}
        <div className="flex w-full items-center justify-center">
          <div className="bg-[var(--primary-white)]/50 flex h-fit w-fit rounded-full p-4 text-white">
            {getIcon()}
          </div>
        </div>
        {/* total number */}
        <div className="w-full">
          <div className="text-right flex flex-col">
            <p className="md:text-xl lg:text-4xl">{getValue()}</p>
            <p className="text-sm font-semibold text-nowrap md:text-lg">{`Total ${title}`}</p>
          </div>
        </div>
      </div>
      {/* specific stat/detail */}
      <div className="flex h-fit items-end justify-between">
        <p className="text-[var(--primary-white)]/80 text-xs ">
          {getSubtitle()}
        </p>
        {/* quick nav button */}
        <button
          className="bg-[var(--primary-white)]/50 hover:bg-[var(--primary-white)]/60 flex items-center gap-2 rounded-2xl px-3 py-2 font-semibold hover:cursor-pointer"
          onClick={navigateClickHandler}
        >
          <p className="text-nowrap text-[10px] md:text-xs">
            {getButtonText()}
          </p>
          <FaChevronRight className="w-2 h-2 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
}
