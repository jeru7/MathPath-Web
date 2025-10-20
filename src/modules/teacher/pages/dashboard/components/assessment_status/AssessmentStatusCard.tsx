import { type ReactElement, useState } from "react";
import AssessmentStatusItem from "./AssessmentStatusItem";
import { useTeacherAssessmentStatus } from "../../../../services/teacher-stats.service";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { AssessmentStatus } from "../../../../types/assessment-status.type";
import { useTeacherContext } from "../../../../context/teacher.context";
import AssessmentDetailsModal from "../../../assessments/components/assessment-details/AssessmentDetailsModal";
import { useTeacherAssessmentAttempts } from "../../../../services/teacher-assessment-attempt.service";

export default function AssessmentStatusCard({
  classes,
}: {
  classes: string;
}): ReactElement {
  const { assessments, teacherId, students } = useTeacherContext();
  const { data: assessmentStatus } = useTeacherAssessmentStatus(
    teacherId ?? "",
  );

  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const { data: studentAttempts = [], isLoading: isLoadingAttempts } =
    useTeacherAssessmentAttempts(teacherId, selectedAssessmentId);

  const handleAssessmentClick = (assessmentStatus: AssessmentStatus) => {
    const assessment = assessments.find((a) => a.id === assessmentStatus.id);
    setSelectedAssessment(assessment ?? null);
    setSelectedAssessmentId(assessmentStatus.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssessment(null);
    setSelectedAssessmentId("");
  };

  return (
    <>
      <article
        className={`${classes} bg-white dark:bg-gray-800 shadow-sm min-h-[300px] lg:h-auto lg:min-h-0 rounded-sm p-2 flex flex-col gap-1 border border-gray-200 dark:border-gray-700 transition-colors duration-200`}
      >
        <header className="">
          <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            Assessment Status
          </p>
        </header>

        {assessmentStatus && assessmentStatus?.length > 0 ? (
          <div className="h-[200px] overflow-y-auto">
            <section className="flex flex-col gap-1">
              {assessmentStatus?.map((assessment, index) => (
                <AssessmentStatusItem
                  classes=""
                  assessmentData={assessment}
                  key={index}
                  onItemClick={() => handleAssessmentClick(assessment)}
                />
              ))}
            </section>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-300 dark:text-gray-500 italic">
              No data available
            </p>
          </div>
        )}
      </article>

      {/* assessment details modal */}
      {selectedAssessment && (
        <AssessmentDetailsModal
          assessment={selectedAssessment}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          studentAttempts={studentAttempts}
          students={students}
          isLoadingAttempts={isLoadingAttempts}
        />
      )}
    </>
  );
}
