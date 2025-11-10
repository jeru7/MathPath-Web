import { type ReactElement } from "react";
import { PiStudent } from "react-icons/pi";
import { GrGroup } from "react-icons/gr";
import { IoIosDocument } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
        return <PiStudent className="h-12 w-12 lg:h-16 lg:w-16" />;
      case "Teachers":
        return <FaChalkboardTeacher className="h-12 w-12 lg:h-16 lg:w-16" />;
      case "Sections":
        return <GrGroup className="h-12 w-12 lg:h-16 lg:w-16" />;
      case "Assessments":
        return <IoIosDocument className="h-12 w-12 lg:h-16 lg:w-16" />;
      default:
        return <GrGroup className="h-12 w-12 lg:h-16 lg:w-16" />;
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
      className={`flex flex-1 min-w-[280px] flex-col rounded-lg p-4 text-white shadow-lg ${color}`}
    >
      <div className="flex w-full h-full flex-1 mb-4">
        {/* icon */}
        <div className="flex w-full items-center justify-center">
          <div className="bg-white/20 flex h-fit w-fit rounded-full p-3 lg:p-4">
            {getIcon()}
          </div>
        </div>
        {/* total number */}
        <div className="w-full">
          <div className="text-right flex flex-col">
            <p className="text-2xl lg:text-4xl font-bold">{getValue()}</p>
            <p className="text-sm font-semibold text-nowrap lg:text-base opacity-90">
              {`Total ${title}`}
            </p>
          </div>
        </div>
      </div>
      {/* specific stat/detail */}
      <div className="flex items-center justify-between mt-auto">
        <p className="text-white/80 text-xs lg:text-sm">{getSubtitle()}</p>
        {/* quick nav button */}
        <Button
          variant="ghost"
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white border-0 h-8 px-3 rounded-full font-semibold hover:text-white"
          onClick={navigateClickHandler}
        >
          <span className="text-xs mr-1">{getButtonText()}</span>
          <FaChevronRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
