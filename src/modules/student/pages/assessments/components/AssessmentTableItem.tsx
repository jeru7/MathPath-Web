import { ReactElement } from "react";
import { format } from "date-fns-tz";
import { Student } from "../../../types/student.type";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import { useAssessmentAttempt } from "../../../services/student-assessment-attempt.service";
import {
  getAssessmentStatus,
  getTotalAttemptsCount,
} from "../../../utils/assessments/assessment.util";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AssessmentTableItemProps = {
  assessment: Assessment;
  student: Student | null | undefined;
  onAssessmentClick: (assessment: Assessment) => void;
  isLastItem?: boolean;
};

export default function AssessmentTableItem({
  assessment,
  student,
  onAssessmentClick,
  isLastItem,
}: AssessmentTableItemProps): ReactElement {
  const totalQuestions = assessment.pages.reduce((total, page) => {
    const questionCount = page.contents.filter(
      (content) => content.type === "question",
    ).length;
    return total + questionCount;
  }, 0);

  const { data: attempts = [] } = useAssessmentAttempt(
    student?.id || "",
    assessment.id,
  );

  const totalAttempts = getTotalAttemptsCount(attempts);

  const studentStatus = getAssessmentStatus(assessment);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "expired":
        return "destructive";
      case "not-available":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "expired":
        return "Expired";
      case "not-available":
        return "Not Available";
      default:
        return "Not Available";
    }
  };

  return (
    <TableRow
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/50 h-17",
        isLastItem && "border-b-0",
      )}
      onClick={() => onAssessmentClick(assessment)}
    >
      <TableCell className="py-4 align-middle">
        {" "}
        {/* Added align-middle */}
        <div className="flex items-center">
          <p className="font-medium text-sm line-clamp-2">
            {" "}
            {/* Added line-clamp */}
            {assessment.title || "Untitled Assessment"}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-4 align-middle">
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {assessment.topic || "No topic"}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {assessment.date.end
              ? format(new Date(assessment.date.end), "MMM d 'at' h:mm a", {
                timeZone: "Asia/Manila",
              })
              : "N/A"}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {assessment.timeLimit ? `${assessment.timeLimit} mins` : "No limit"}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <Badge variant={getStatusVariant(studentStatus)}>
            {getStatusText(studentStatus)}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">{totalQuestions}</p>
        </div>
      </TableCell>
      <TableCell className="py-4 text-center align-middle">
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {totalAttempts}/{assessment.attemptLimit || "∞"}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}
