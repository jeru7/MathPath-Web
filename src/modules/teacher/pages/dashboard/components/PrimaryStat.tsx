import { type ReactElement } from "react";
import { PiStudent } from "react-icons/pi";
import { GrGroup } from "react-icons/gr";
import { IoIosDocument } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export interface IPrimaryStatProps {
  title: "Students" | "Sections" | "Assessments";
  students?: number;
  sections?: number;
  assessments?: number;
  onlineStudents?: number;
}

// Simple skeleton - no memo
export function PrimaryStatSkeleton(): ReactElement {
  return (
    <Card className="flex flex-1 min-w-[300px] flex-col rounded-sm p-2">
      <CardContent className="p-2">
        <div className="flex w-full h-full">
          <div className="flex w-full items-center justify-center">
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
          <div className="w-full">
            <div className="text-right flex flex-col">
              <Skeleton className="h-8 w-16 ml-auto mb-2" />
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>
          </div>
        </div>
        <div className="flex h-fit items-end justify-between mt-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-24 rounded-2xl" />
        </div>
      </CardContent>
    </Card>
  );
}

// Main component - no memo bullshit
export default function PrimaryStat({
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

  const getColorClass = () => {
    switch (title) {
      case "Students":
        return "bg-green-500 dark:bg-green-600";
      case "Sections":
        return "bg-orange-500 dark:bg-orange-600";
      case "Assessments":
        return "bg-amber-500 dark:bg-amber-600";
      default:
        return "bg-blue-500 dark:bg-blue-600";
    }
  };

  return (
    <Card
      className={`flex flex-1 min-w-[300px] flex-col rounded-sm p-2 text-white ${getColorClass()}`}
    >
      <CardContent className="p-2">
        <div className="flex w-full h-full">
          <div className="flex w-full items-center justify-center">
            <div className="bg-primary-foreground/50 flex h-fit w-fit rounded-full p-4 text-white">
              {title === "Students" ? (
                <PiStudent className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />
              ) : title === "Sections" ? (
                <GrGroup className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />
              ) : (
                <IoIosDocument className="h-8 w-8 md:h-15 md:w-15 lg:h-20 lg:w-20" />
              )}
            </div>
          </div>
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
        <div className="flex h-fit items-end justify-between">
          <p className="text-primary-foreground/80 text-xs">
            {title === "Students" ? `${onlineStudents ?? 0} online` : ""}
          </p>
          <Button
            className="bg-primary-foreground/50 hover:bg-primary-foreground/60 dark:bg-foreground/50 dark:hover:bg-foreground/60 flex items-center gap-2 rounded-2xl px-3 py-2 font-semibold h-auto"
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
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
