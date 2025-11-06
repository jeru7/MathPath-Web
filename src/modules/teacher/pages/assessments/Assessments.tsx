import { type ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AssessmentTable from "./components/assessment_table/AssessmentTable";
import { useQueryClient } from "@tanstack/react-query";
import { useTeacherContext } from "../../context/teacher.context";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import { useDeleteAssessment } from "../../services/teacher-assessment.service";
import { toast } from "react-toastify";
import DeleteAssessmentConfirmationModal from "./components/DeleteAssessmentConfirmationModal";
import AssessmentDetailsModal from "./components/assessment-details/AssessmentDetailsModal";
import { useTeacherAssessmentAttempts } from "../../services/teacher-assessment-attempt.service";
import {
  useTeacherArchiveAssessment,
  useTeacherRestoreAssessment,
  useTeacherArchivedAssessments,
} from "../../services/teacher-assessment.service";
import AssessmentArchiveConfirmationModal from "../../../core/components/assessment-archive/AssessmentArchiveConfirmationModal";
import AssessmentArchiveModal from "../../../core/components/assessment-archive/AssessmentArchiveModal";

export default function Assessments(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { assessmentId } = useParams();
  const { teacherId, students, assessments } = useTeacherContext();
  const queryClient = useQueryClient();
  const { mutate: deleteAssessment } = useDeleteAssessment(teacherId ?? "");

  const { data: archivedAssessments } =
    useTeacherArchivedAssessments(teacherId);
  const { mutate: archiveAssessment } = useTeacherArchiveAssessment(teacherId);
  const { mutate: restoreAssessment } = useTeacherRestoreAssessment(teacherId);

  const [assessmentToDelete, setAssessmentToDelete] =
    useState<Assessment | null>(null);
  const [assessmentToArchive, setAssessmentToArchive] =
    useState<Assessment | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [hideFab, setHideFab] = useState<boolean>(false);

  // TODO: handle loading attempts
  // pasa sa details modal
  // fetch attempts for the selected assessment
  const { data: studentAttempts = [] } = useTeacherAssessmentAttempts(
    teacherId,
    selectedAssessment?.id || "",
  );

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["teacher", teacherId, "assessments"],
    });
  }, [queryClient, teacherId]);

  useEffect(() => {
    if (assessmentId) {
      const assessment = assessments.find((a) => a.id === assessmentId);
      setSelectedAssessment(assessment || null);
    } else {
      setSelectedAssessment(null);
    }
  }, [assessmentId, assessments]);

  const pathEnd = location.pathname.split("/").pop();
  const isAssessmentDetailsRoute =
    selectedAssessment !== null && pathEnd === selectedAssessment.id;
  const showArchiveRoute = location.pathname.endsWith("/archives");

  useEffect(() => {
    setHideFab(showArchiveRoute);
  }, [showArchiveRoute]);

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
          navigate("..");
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

  // Archive handlers
  const handleArchiveInitiate = (assessment: Assessment) => {
    if (assessment?.status === "draft") {
      toast.error(
        "Draft assessments cannot be archived. Please publish or delete the draft instead.",
      );
      return;
    }
    setAssessmentToArchive(assessment);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveConfirm = () => {
    if (assessmentToArchive) {
      archiveAssessment(assessmentToArchive.id, {
        onSuccess: () => {
          toast.success("Assessment archived successfully.");
          queryClient.invalidateQueries({
            queryKey: ["teacher", teacherId, "assessments"],
          });
          queryClient.invalidateQueries({
            queryKey: ["teacher", teacherId, "archived-assessments"],
          });
          setIsArchiveModalOpen(false);
          setAssessmentToArchive(null);
          if (selectedAssessment?.id === assessmentToArchive.id) {
            navigate("..");
            setSelectedAssessment(null);
          }
        },
        onError: (error: unknown) => {
          toast.error("Failed to archive assessment.");
          console.error("Archive assessment error:", error);
        },
      });
    }
  };

  const handleArchiveCancel = () => {
    setIsArchiveModalOpen(false);
    setAssessmentToArchive(null);
  };

  const handleRestoreAssessment = (assessmentId: string) => {
    restoreAssessment(assessmentId, {
      onSuccess: () => {
        toast.success("Assessment restored successfully");
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "assessments"],
        });
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "archived-assessments"],
        });
      },
      onError: () => {
        toast.error("Failed to restore assessment");
      },
    });
  };

  const handlePermanentDelete = (assessmentId: string) => {
    deleteAssessment(assessmentId, {
      onSuccess: () => {
        toast.success("Assessment permanently deleted");
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "assessments"],
        });
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "archived-assessments"],
        });
      },
      onError: () => {
        toast.error("Failed to delete assessment");
      },
    });
  };

  const handleAssessmentClick = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    navigate(assessment.id);
  };

  const handleCloseDetailsModal = () => {
    navigate("..");
    setSelectedAssessment(null);
  };

  const handleEditAssessment = (assessment: Assessment) => {
    // Navigate to builder with /edit
    navigate(`/teacher/${teacherId}/assessments/${assessment.id}/edit`);
  };

  const getStudentCountForAssessment = (
    assessment: Assessment | null,
  ): number => {
    if (!assessment) return 0;
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
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Assessments
        </h3>
      </header>

      <section className="bg-white border border-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 rounded-sm overflow-y-hidden shadow-sm w-full flex-1 flex flex-col">
        <AssessmentTable
          assessments={assessments}
          navigate={navigate}
          onAssessmentClick={handleAssessmentClick}
          onArchiveAssessment={handleArchiveInitiate}
          showArchive={true}
          hideFab={hideFab}
        />
      </section>

      {showArchiveRoute && archivedAssessments && (
        <AssessmentArchiveModal
          isOpen={showArchiveRoute}
          onClose={() => navigate("..")}
          assessments={archivedAssessments}
          onRestoreAssessment={handleRestoreAssessment}
          onDeleteAssessment={handlePermanentDelete}
          students={students}
          studentAttempts={studentAttempts}
        />
      )}

      {selectedAssessment && (
        <AssessmentDetailsModal
          isOpen={isAssessmentDetailsRoute}
          assessment={selectedAssessment}
          onClose={handleCloseDetailsModal}
          studentAttempts={studentAttempts}
          students={students}
          disableEdit={selectedAssessment.status !== "draft"}
          onDelete={() => handleDeleteInitiate(selectedAssessment)}
          onArchive={() => handleArchiveInitiate(selectedAssessment)}
          onEdit={() => handleEditAssessment(selectedAssessment)}
        />
      )}

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

      <AssessmentArchiveConfirmationModal
        isOpen={isArchiveModalOpen}
        onClose={handleArchiveCancel}
        onConfirm={handleArchiveConfirm}
        assessment={assessmentToArchive}
        students={students}
      />
    </main>
  );
}
