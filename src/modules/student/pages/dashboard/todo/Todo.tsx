import { type ReactElement } from "react";
import { FaCircleCheck, FaFile } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "../../../contexts/student.context";
import { useStudentAssessments } from "../../../services/student-assessment.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Todo(): ReactElement {
  const navigate = useNavigate();
  const { studentId, student } = useStudentContext();
  const { data: assessments = [] } = useStudentAssessments(studentId);

  const assessmentsDue = assessments.filter((assessment) => {
    if (assessment.status !== "in-progress") return false;

    // check if current date is within assessment date range
    const now = new Date();
    const startDate = assessment.date.start
      ? new Date(assessment.date.start)
      : null;
    const endDate = assessment.date.end ? new Date(assessment.date.end) : null;

    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;

    const studentAssessment = student?.assessments?.find(
      (sa) => sa.assessmentId === assessment.id,
    );

    const attemptsCount = studentAssessment?.attempts?.length || 0;
    return attemptsCount === 0;
  }).length;

  const hasAssessmentsDue = assessmentsDue > 0;

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("assessments");
  };

  return (
    <Card className="w-full h-full p-3">
      <CardContent className="p-0 space-y-1">
        <p className="font-semibold text-sm">To-do</p>
        <div className="w-full h-full flex items-center justify-start">
          <div className="flex gap-2 items-center justify-center">
            {hasAssessmentsDue ? (
              <>
                <FaFile className="text-primary" />
                <Badge
                  variant="outline"
                  className="hover:text-primary hover:cursor-pointer text-sm transition-colors"
                  onClick={handleTextClick}
                >
                  {assessmentsDue} Assessment{assessmentsDue !== 1 ? "s" : ""}{" "}
                  due
                </Badge>
              </>
            ) : (
              <>
                <FaCircleCheck className="text-green-500" />
                <p className="text-sm text-muted-foreground">
                  No assessments due
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
