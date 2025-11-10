import { type ReactElement } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaListAlt,
  FaChartBar,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Assessment } from "@/modules/core/types/assessment/assessment.type";
import { Teacher } from "@/modules/teacher/types/teacher.type";
import { formatDate } from "../../utils/date.util";

type AssessmentInformationProps = {
  assessment: Assessment;
  totalQuestions?: number;
  averageScore?: number;
  studentCount?: number;
  teacher?: Teacher;
  className?: string;
};

export default function AssessmentInformation({
  assessment,
  totalQuestions,
  averageScore,
  studentCount,
  teacher,
  className = "",
}: AssessmentInformationProps): ReactElement {
  const renderField = (
    label: string,
    value: React.ReactNode,
    icon?: React.ReactNode,
    iconColor?: string,
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Badge
        variant="outline"
        className="w-full justify-start gap-2 py-2 px-3 h-10"
      >
        {icon && (
          <span className={`w-4 h-4 flex-shrink-0 ${iconColor || ""}`}>
            {icon}
          </span>
        )}
        <span className="truncate">{value}</span>
      </Badge>
    </div>
  );

  return (
    <Card className={className}>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* title */}
              {renderField("Title", assessment.title || "Untitled Assessment")}
              {/* topic */}
              {renderField("Topic", assessment.topic || "No topic specified")}
            </div>
          </div>

          {/* assessment metrics */}
          {(totalQuestions !== undefined ||
            averageScore !== undefined ||
            studentCount !== undefined) && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* total questions */}
                  {totalQuestions !== undefined &&
                    renderField(
                      "Questions",
                      totalQuestions,
                      <FaListAlt className="text-purple-500" />,
                      "text-purple-500",
                    )}
                  {/* average score */}
                  {averageScore !== undefined &&
                    renderField(
                      "Avg Score",
                      `${averageScore} pts`,
                      <FaChartBar className="text-green-500" />,
                      "text-green-500",
                    )}
                  {/* student count */}
                  {studentCount !== undefined &&
                    renderField(
                      "Students",
                      studentCount,
                      <FaUsers className="text-indigo-500" />,
                      "text-indigo-500",
                    )}
                  {/* passing score */}
                  {renderField(
                    "Passing Score",
                    `${assessment.passingScore || 0} pts`,
                    <FaChartBar className="text-blue-500" />,
                    "text-blue-500",
                  )}
                </div>
              </div>
            )}

          {/* date range */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField(
                "Start Date",
                assessment.date.start
                  ? formatDate(assessment.date.start)
                  : "Not set",
                <FaCalendarAlt />,
              )}
              {renderField(
                "End Date",
                assessment.date.end
                  ? formatDate(assessment.date.end)
                  : "Not set",
                <FaCalendarAlt />,
              )}
            </div>
          </div>

          {/* settings */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField(
                "Time Limit",
                assessment.timeLimit ? `${assessment.timeLimit}m` : "No limit",
                <FaClock />,
              )}
              {renderField(
                "Attempt Limit",
                assessment.attemptLimit || "Unlimited",
              )}
            </div>

            {teacher && (
              <div className="grid grid-cols-1 gap-4">
                {renderField(
                  "Teacher",
                  `${teacher.firstName} ${teacher.lastName}`,
                  <FaUserTie className="w-4 h-4" />,
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
