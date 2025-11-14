import { type ReactElement, useEffect, useState } from "react";
import { useAdminContext } from "../../context/admin.context";
import { FaCheck, FaXmark, FaEnvelope, FaVenusMars } from "react-icons/fa6";
import { Teacher } from "../../../teacher/types/teacher.type";
import { Section } from "../../../core/types/section/section.type";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import EditTeacherModal from "./EditTeacherModal";
import { EditTeacherDTO } from "../../../teacher/types/teacher.schema";
import {
  useAdminEditTeacher,
  useAdminDeleteTeacher,
} from "../../services/admin-teacher.service";
import { toast } from "react-toastify";
import DeleteTeacherConfirmationModal from "./DeleteTeacherConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TeacherSectionsList from "./teacher-details/TeacherSectionList";
import TeacherAssessmentsList from "./teacher-details/TeacherAssessmentList";

type TeacherDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
  archiveLabel?: string;
};

export default function TeacherDetailsModal({
  isOpen,
  onClose,
  teacher,
  onEdit,
  onArchive,
  onDelete,
  disableEdit = false,
  disableDelete = false,
  archiveLabel = "Archive",
}: TeacherDetailsModalProps): ReactElement {
  const {
    adminId,
    allStudents: students,
    allSections: sections,
    allAssessments: assessments,
  } = useAdminContext();
  const queryClient = useQueryClient();
  const [teacherSections, setTeacherSections] = useState<Section[]>([]);
  const [teacherAssessments, setTeacherAssessments] = useState<Assessment[]>(
    [],
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: updateTeacher, isPending: isUpdating } =
    useAdminEditTeacher(adminId);
  const { mutate: deleteTeacher, isPending: isDeleting } =
    useAdminDeleteTeacher(adminId);

  const getSectionStudentCount = (sectionId: string) => {
    return students.filter((student) => student.sectionId === sectionId).length;
  };

  // calculate total students in teacher's sections
  const totalStudentsInSections = teacherSections.reduce((total, section) => {
    return total + getSectionStudentCount(section.id);
  }, 0);

  useEffect(() => {
    if (isOpen && teacher) {
      const assignedSections = sections.filter((section) =>
        section?.teacherIds?.includes(teacher.id),
      );
      setTeacherSections(assignedSections);

      const teacherAssessments = assessments.filter(
        (assessment) => assessment.teacher === teacher.id,
      );
      setTeacherAssessments(teacherAssessments);
    } else {
      setTeacherSections([]);
      setTeacherAssessments([]);
    }
  }, [isOpen, teacher, sections, assessments]);

  const getFullName = () => {
    return `${teacher.lastName}, ${teacher.firstName}${teacher.middleName ? ` ${teacher.middleName}` : ""
      }`.trim();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      setIsEditModalOpen(true);
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    deleteTeacher(teacher.id, {
      onSuccess: () => {
        toast.success("Teacher deleted successfully");
        setIsDeleteModalOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "teachers"],
        });
        onClose();
      },
      onError: (error) => {
        console.error("Failed to delete teacher:", error);
        toast.error("Failed to delete teacher");
      },
    });
  };

  const handleUpdateTeacher = async (
    teacherId: string,
    data: EditTeacherDTO,
  ) => {
    return new Promise<void>((resolve, reject) => {
      updateTeacher(
        { teacherId, teacherData: data },
        {
          onSuccess: () => {
            toast.success("Teacher updated successfully.");
            queryClient.invalidateQueries({
              queryKey: ["admin", adminId, "teachers"],
            });
            resolve();
          },
          onError: (error) => {
            console.error("Failed to update teacher:", error);
            reject(error);
          },
        },
      );
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[100dvw] h-[100dvh] max-w-none flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 overflow-hidden">
                  <img
                    src={getProfilePicture(
                      teacher?.profilePicture ?? "Default",
                    )}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {teacher.verified.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <FaCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  {getFullName()}
                </DialogTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaEnvelope className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaVenusMars className="w-4 h-4 flex-shrink-0" />
                    <span>{teacher.gender}</span>
                  </div>
                  <Badge
                    variant={
                      teacher.verified.verified ? "default" : "secondary"
                    }
                    className={`${teacher.verified.verified
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                      }`}
                  >
                    {teacher.verified.verified ? (
                      <>
                        <FaCheck className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <FaXmark className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-medium">Unverified</span>
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            <div className="space-y-6">
              {/* sections */}
              <TeacherSectionsList
                teacherSections={teacherSections}
                getSectionStudentCount={getSectionStudentCount}
              />

              {/* assessments */}
              <TeacherAssessmentsList teacherAssessments={teacherAssessments} />
            </div>
          </div>

          {/* action buttons */}
          <div className="border-t pt-4 mt-4 flex-shrink-0 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Badge variant="outline" className="text-xs">
                Last updated: {new Date(teacher.updatedAt).toLocaleDateString()}
              </Badge>
            </div>
            <div className="flex gap-2 justify-center sm:justify-end">
              {!disableEdit && (
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  Edit
                </Button>
              )}
              {onArchive && (
                <Button
                  variant="outline"
                  onClick={handleArchive}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  {archiveLabel}
                </Button>
              )}
              {!disableDelete && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* edit teacher modal */}
      {!disableEdit && !onEdit && (
        <EditTeacherModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          teacher={teacher}
          onUpdateTeacher={handleUpdateTeacher}
          isSubmitting={isUpdating}
        />
      )}

      {/* delete teacher confirmation modal */}
      {!disableDelete && !onDelete && (
        <DeleteTeacherConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          teacher={teacher}
          sectionsCount={teacherSections.length}
          assessmentsCount={teacherAssessments.length}
          studentsCount={totalStudentsInSections}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
