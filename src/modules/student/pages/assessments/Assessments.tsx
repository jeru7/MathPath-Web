import { type ReactElement, useState } from "react";
import { useStudentContext } from "../../contexts/student.context";
import AssessmentTable from "./components/AssessmentTable";
import { useNavigate } from "react-router-dom";
import { useStudentAssessments } from "../../services/student-assessment.service";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import AssessmentDetailsModal from "./components/AssessmentDetailsModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function Assessments(): ReactElement {
  const { studentId, student } = useStudentContext();
  const { data: assessments, isPending: assessmentPending } =
    useStudentAssessments(studentId);
  const navigate = useNavigate();

  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleAssessmentClick = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedAssessment(null);
  };

  const handleTakeAssessment = (assessment: Assessment) => {
    navigate(`${assessment.id}/attempt`);
    handleCloseModal();
  };

  if (assessmentPending) {
    return (
      <div className="min-h-screen h-fit w-full p-2 flex flex-col gap-2">
        {/* header skeleton */}
        <Skeleton className="h-8 w-64 rounded" />

        {/* table skeleton */}
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-fit w-full p-2 flex flex-col gap-2">
      {/* header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <AssessmentTable
          assessments={assessments || []}
          navigate={navigate}
          student={student}
          onAssessmentClick={handleAssessmentClick}
        />
      </div>

      {selectedAssessment && (
        <AssessmentDetailsModal
          isOpen={showDetailsModal}
          assessment={selectedAssessment}
          student={student}
          onClose={handleCloseModal}
          onTakeAssessment={handleTakeAssessment}
        />
      )}
    </div>
  );
}
