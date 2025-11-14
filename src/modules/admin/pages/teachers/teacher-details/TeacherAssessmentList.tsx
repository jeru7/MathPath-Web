import { type ReactElement } from "react";
import { FaFileAlt } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Assessment } from "@/modules/core/types/assessment/assessment.type";
import AssessmentCard from "../AssessmentCard";

type TeacherAssessmentsListProps = {
  teacherAssessments: Assessment[];
};

export default function TeacherAssessmentsList({
  teacherAssessments,
}: TeacherAssessmentsListProps): ReactElement {
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Teacher Assessments
        </h2>
        <Badge variant="outline">
          {teacherAssessments.length} assessment
          {teacherAssessments.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {teacherAssessments.length > 0 ? (
        <div className="h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-sm p-4">
          <div className="grid gap-4">
            {teacherAssessments.map((assessment) => (
              <AssessmentCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-sm border-2 border-dashed border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <FaFileAlt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">
              No Assessments Created
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm">
              This teacher hasn't created any assessments yet.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
