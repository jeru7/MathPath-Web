import { type ReactElement, useState } from "react";
import AssessmentStatusItem from "./AssessmentStatusItem";
import { useTeacherAssessmentStatus } from "../../../../services/teacher-stats.service";
import { useTeacherAssessmentAttempts } from "../../../../services/teacher-assessment-attempt.service";
import { useTeacherContext } from "../../../../context/teacher.context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { AssessmentStatus } from "../../../../types/assessment-status.type";
import AssessmentDetailsModal from "@/modules/core/components/assessment-details/AssessesmentDetailsModal";

export function AssessmentStatusCardSkeleton(): ReactElement {
  return (
    <Card className="p-2">
      <CardHeader className="p-0 pb-3">
        <Skeleton className="h-4 w-24" />
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-2 max-h-[280px] overflow-y-auto">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AssessmentStatusCard({
  classes,
}: {
  classes?: string;
}): ReactElement {
  const { rawAssessments, teacherId, rawStudents } = useTeacherContext();
  const { data: assessmentStatus, isLoading } = useTeacherAssessmentStatus(
    teacherId ?? "",
  );

  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: studentAttempts = [] } = useTeacherAssessmentAttempts(
    teacherId ?? "",
    selectedAssessmentId,
  );

  const handleAssessmentClick = (assessmentStatusItem: AssessmentStatus) => {
    const assessment = rawAssessments.find(
      (a) => a.id === assessmentStatusItem.id,
    );
    setSelectedAssessment(assessment ?? null);
    setSelectedAssessmentId(assessmentStatusItem.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAssessment(null);
    setSelectedAssessmentId("");
    setIsModalOpen(false);
  };

  if (isLoading) return <AssessmentStatusCardSkeleton />;

  return (
    <>
      <Card className={`${classes ?? ""} p-2`}>
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm">Assessments</CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-hidden">
          {assessmentStatus && assessmentStatus.length > 0 ? (
            <div className="space-y-2 max-h-[225px] overflow-y-auto">
              {assessmentStatus.map((assessment, index) => (
                <AssessmentStatusItem
                  key={index}
                  assessmentData={assessment}
                  onItemClick={() => handleAssessmentClick(assessment)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">No assessments</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAssessment && (
        <AssessmentDetailsModal
          userType="teacher"
          userId={teacherId}
          assessment={selectedAssessment}
          isOpen={isModalOpen}
          disableEdit={true}
          onClose={handleCloseModal}
          studentAttempts={studentAttempts}
          students={rawStudents}
          showFooter={false}
        />
      )}
    </>
  );
}
