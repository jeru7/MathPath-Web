import { type ReactElement } from "react";
import {
  Section,
  SectionColor,
} from "../../../../core/types/section/section.type";
import { getSectionBanner } from "../../../../core/utils/section/section.util";
import { SectionTableContext } from "./SectionTable";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/modules/core/utils/date.util";

type SectionItemProps = {
  section: Section;
  onClick?: () => void;
  onDelete?: () => void;
  context: SectionTableContext;
};

export default function SectionItem({
  section,
  onClick,
  context,
}: SectionItemProps): ReactElement {
  const { onlineStudents, rawStudents, rawAssessments } = context;

  const studentCount = rawStudents.filter(
    (student) => student.sectionId === section.id,
  ).length;

  const assessmentCount = rawAssessments.filter((assessment) =>
    assessment?.sections?.includes(section.id),
  ).length;

  const onlineStudentCount = (): number => {
    const onlineInSection = onlineStudents.filter(
      (student) => student.sectionId === section.id,
    );
    return onlineInSection.length;
  };

  const onlinePercentage =
    studentCount > 0
      ? Math.round((onlineStudentCount() / studentCount) * 100)
      : 0;

  const getColorClass = (color: SectionColor) => {
    switch (color) {
      case "primary-green":
        return "bg-green-500";
      case "tertiary-green":
        return "bg-green-400";
      case "primary-orange":
        return "bg-orange-500";
      case "primary-yellow":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-200 h-full"
      onClick={handleCardClick}
    >
      <div
        className={`${getColorClass(section.color)} h-2 w-full rounded-t-lg`}
      />
      <CardContent className="p-4 space-y-4">
        <div className="rounded-lg flex items-center justify-center bg-muted/50 p-2">
          <img
            src={getSectionBanner(section.banner)}
            alt="section banner"
            className="object-contain w-full h-32 rounded-md"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold truncate">{section.name}</h3>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-2xl font-bold">{studentCount}</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{assessmentCount}</p>
            <p className="text-xs text-muted-foreground">Assessments</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Online Students</span>
            <Badge variant="secondary">
              {onlineStudentCount()} / {studentCount}
            </Badge>
          </div>
          <Progress value={onlinePercentage} className="h-2" />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{onlinePercentage}% online</span>
            <span>Created {formatDate(section.createdAt.toString())}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
