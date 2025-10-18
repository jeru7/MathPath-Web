import { type ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssessmentTable from "./components/assessment_table/AssessmentTable";
import { useQueryClient } from "@tanstack/react-query";
import { useTeacherContext } from "../../context/teacher.context";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import { useDeleteAssessment } from "../../services/teacher-assessment.service";
import { toast } from "react-toastify";
import DeleteAssessmentConfirmationModal from "./components/DeleteAssessmentConfirmationModal";

export default function Assessments(): ReactElement {
  const navigate = useNavigate();
  const { teacherId, students, assessments } = useTeacherContext();
  const queryClient = useQueryClient();
  const { mutate: deleteAssessment } = useDeleteAssessment(teacherId ?? "");

  const [assessmentToDelete, setAssessmentToDelete] =
    useState<Assessment | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["teacher", teacherId, "assessments"],
    });
  }, [queryClient, teacherId]);

  const handleDeleteInitiate = (assessment: Assessment) => {
    setAssessmentToDelete(assessment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (assessmentToDelete) {
      deleteAssessment(assessmentToDelete.id, {
        onSuccess: () => {
          toast.success("Assessment deleted successfully.");
          queryClient.invalidateQueries({
            queryKey: ["teacher", teacherId, "assessments"],
          });
          setIsDeleteModalOpen(false);
          setAssessmentToDelete(null);
        },
        onError: (error) => {
          toast.error("Failed to delete assessment.");
          console.error("Delete assessment error:", error);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setAssessmentToDelete(null);
  };

  // calculate student and section counts for the assessment to delete
  const getStudentCountForAssessment = (
    assessment: Assessment | null,
  ): number => {
    if (!assessment) return 0;

    // get all students in the sections assigned to the assessment
    const sectionIds = assessment.sections || [];
    return students.filter((student) => sectionIds.includes(student.sectionId))
      .length;
  };

  const getSectionCountForAssessment = (
    assessment: Assessment | null,
  ): number => {
    if (!assessment) return 0;
    return (assessment.sections || []).length;
  };

  return (
    <main className="flex flex-col h-full min-h-screen w-full max-w-[2400px] gap-2 bg-inherit p-2">
      {/* header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Assessments
        </h3>
      </header>

      {/* table section */}
      <section className="bg-white border border-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 rounded-sm overflow-y-hidden shadow-sm w-full flex-1 flex flex-col">
        <AssessmentTable
          assessments={assessments}
          navigate={navigate}
          onDeleteAssessment={handleDeleteInitiate}
        />
      </section>

      {assessmentToDelete && (
        <DeleteAssessmentConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          assessment={assessmentToDelete}
          studentCount={getStudentCountForAssessment(assessmentToDelete)}
          sectionCount={getSectionCountForAssessment(assessmentToDelete)}
        />
      )}
    </main>
  );
}
