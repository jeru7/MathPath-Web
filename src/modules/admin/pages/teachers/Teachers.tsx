import { useEffect, useState, type ReactElement } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import TeacherTable from "./TeacherTable";
import TeacherDetailsModal from "./TeacherDetailsModal";
import AddTeacherModal from "./AddTeacherModal";
import {
  useAdminArchiveTeacher,
  useAdminDeleteTeacher,
  useAdminEditTeacher,
  useAdminRestoreTeacher,
} from "../../services/admin-teacher.service";
import { useAdminContext } from "../../context/admin.context";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Teacher } from "@/modules/teacher/types/teacher.type";
import TeacherArchiveModal from "./archive-teacher/TeacherArchiveModal";
import TeacherArchiveConfirmationModal from "./archive-teacher/TeacherArchiveConfirmationModal";
import DeleteTeacherConfirmationModal from "./DeleteTeacherConfirmationModal";
import { EditTeacherDTO } from "../../../teacher/types/teacher.schema";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import EditTeacherModal from "./EditTeacherModal";

export default function Teachers(): ReactElement {
  const {
    adminId,
    archivedTeachers,
    rawSections,
    rawAssessments,
    rawTeachers,
    rawStudents,
  } = useAdminContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { teacherId } = useParams();
  const queryClient = useQueryClient();

  const { mutate: archiveTeacher } = useAdminArchiveTeacher(adminId);
  const { mutate: restoreTeacher } = useAdminRestoreTeacher(adminId);
  const { mutate: deleteTeacher } = useAdminDeleteTeacher(adminId);
  const { mutate: editTeacher, isPending: isUpdating } =
    useAdminEditTeacher(adminId);

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [teacherToArchive, setTeacherToArchive] = useState<Teacher | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const pathSegments = location.pathname.split("/");
  const pathEnd = pathSegments.pop();
  const isAddTeacherRoute = pathEnd === "add-teacher";
  const showArchiveRoute = pathEnd === "archives";

  const isTeacherDetailsRoute = Boolean(
    teacherId && !showArchiveRoute && !isAddTeacherRoute,
  );

  useEffect(() => {
    if (teacherId && !showArchiveRoute) {
      const teacher = rawTeachers.find((t) => t.id === teacherId);
      setSelectedTeacher(teacher!);
    } else {
      setSelectedTeacher(null);
    }
  }, [teacherId, showArchiveRoute, rawTeachers]);

  const handleTeacherClick = (teacherId: string) => {
    if (!showArchiveRoute) {
      const teacher = rawTeachers.find((t) => t.id === teacherId);
      setSelectedTeacher(teacher!);
      navigate(teacherId);
    }
  };

  const handleAddTeacher = () => {
    navigate("add-teacher");
  };

  const handleCloseModal = () => {
    navigate("..");
  };

  const handleDeleteInitiate = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  // Archive handlers
  const handleArchiveInitiate = (teacher: Teacher) => {
    setTeacherToArchive(teacher);
    setIsArchiveModalOpen(true);
  };

  const handleEditInitiate = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      deleteTeacher(teacherToDelete.id, {
        onSuccess: () => {
          toast.success("Teacher deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "teachers"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "sections"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "students"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "assessments"],
          });
          setIsDeleteModalOpen(false);
          setTeacherToDelete(null);

          if (selectedTeacher?.id === teacherToDelete.id) {
            navigate("..");
            setSelectedTeacher(null);
          }
        },
        onError: () => {
          toast.error("Failed to delete teacher");
        },
      });
    }
  };

  const confirmArchive = () => {
    if (teacherToArchive) {
      archiveTeacher(teacherToArchive.id, {
        onSuccess: () => {
          toast.success("Teacher archived successfully.");
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "teachers"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "archived-teachers"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "assessments"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "sections"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "students"],
          });
          setIsArchiveModalOpen(false);
          setTeacherToArchive(null);

          if (selectedTeacher?.id === teacherToArchive.id) {
            navigate("..");
            setSelectedTeacher(null);
          }
        },
        onError: (error) => {
          toast.error("Failed to archive teacher.");
          console.error("Archive teacher error:", error);
        },
      });
    }
  };

  const handleUpdateTeacher = async (
    teacherId: string,
    data: EditTeacherDTO,
  ) => {
    return new Promise<void>((resolve, reject) => {
      editTeacher(
        { teacherId, teacherData: data },
        {
          onSuccess: () => {
            toast.success("Teacher updated successfully.");
            queryClient.invalidateQueries({
              queryKey: ["admin", adminId, "teachers"],
            });
            resolve();
          },
          onError: (error: unknown) => {
            const errorData: APIErrorResponse = handleApiError(error);

            if (errorData.error === "EMAIL_ALREADY_EXISTS") {
              console.error("A teacher with this email already exists.");
            } else {
              console.error("Failed to update teacher.");
            }

            reject(error);
          },
        },
      );
    });
  };

  const handleRestoreTeacher = (teacherId: string) => {
    restoreTeacher(teacherId, {
      onSuccess: () => {
        toast.success("Teacher restored successfully");
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "teachers"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "archived-teachers"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "assessments"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "sections"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "students"],
        });
      },
      onError: () => {
        toast.error("Failed to restore teacher");
      },
    });
  };

  const handlePermanentDelete = (teacherId: string) => {
    deleteTeacher(teacherId, {
      onSuccess: () => {
        toast.success("Teacher permanently deleted");
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "teachers"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "archived-teachers"],
        });
      },
      onError: () => {
        toast.error("Failed to delete teacher");
      },
    });
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTeacherToDelete(null);
  };

  const cancelArchive = () => {
    setIsArchiveModalOpen(false);
    setTeacherToArchive(null);
  };

  // Calculate teacher's sections and assessments count for archive confirmation
  const getTeacherSectionsCount = (teacher: Teacher | null) => {
    if (!teacher) return 0;
    return rawSections.filter((section) =>
      section?.teacherIds?.includes(teacher.id),
    ).length;
  };

  const getTeacherAssessmentsCount = (teacher: Teacher | null) => {
    if (!teacher) return 0;
    return rawAssessments.filter(
      (assessment) => assessment.teacher === teacher.id,
    ).length;
  };

  const getTeacherStudentsCount = (teacher: Teacher | null) => {
    if (!teacher) return 0;

    const teacherSections = rawSections.filter((section) =>
      section?.teacherIds?.includes(teacher.id),
    );

    return teacherSections.reduce((total, section) => {
      const studentsInSection = rawStudents.filter(
        (student) => student.sectionId === section.id,
      ).length;
      return total + studentsInSection;
    }, 0);
  };

  return (
    <main className="flex flex-col min-h-screen h-full w-full mt-4 md:mt-0 gap-2 bg-secondary p-2">
      {/* header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Teachers
        </h3>
      </header>

      <section className="overflow-y-hidden w-full flex-1 flex flex-col">
        <TeacherTable
          onTeacherClick={handleTeacherClick}
          onAddTeacher={handleAddTeacher}
          showArchive={true}
        />
      </section>

      {/* add teacher modal */}
      <AddTeacherModal isOpen={isAddTeacherRoute} onClose={handleCloseModal} />

      {/* archive modal */}
      {showArchiveRoute && (
        <TeacherArchiveModal
          isOpen={showArchiveRoute}
          onClose={() => navigate("..")}
          teachers={archivedTeachers}
          onRestoreTeacher={handleRestoreTeacher}
          onDeleteTeacher={handlePermanentDelete}
        />
      )}

      {/* teacher details modal */}
      {selectedTeacher && (
        <TeacherDetailsModal
          isOpen={isTeacherDetailsRoute}
          onClose={handleCloseModal}
          teacher={selectedTeacher}
          onEdit={handleEditInitiate}
          onArchive={() => handleArchiveInitiate(selectedTeacher)}
          onDelete={() => handleDeleteInitiate(selectedTeacher)}
        />
      )}

      {/* edit teacher modal */}
      {selectedTeacher && (
        <EditTeacherModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          teacher={selectedTeacher}
          onUpdateTeacher={handleUpdateTeacher}
          isSubmitting={isUpdating}
        />
      )}

      {/* delete confirmation modal */}
      <DeleteTeacherConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        teacher={teacherToDelete}
        sectionsCount={getTeacherSectionsCount(teacherToDelete)}
        assessmentsCount={getTeacherAssessmentsCount(teacherToDelete)}
        studentsCount={getTeacherStudentsCount(teacherToDelete)}
      />

      {/* archive confirmation modal */}
      <TeacherArchiveConfirmationModal
        isOpen={isArchiveModalOpen}
        onClose={cancelArchive}
        onConfirm={confirmArchive}
        teacher={teacherToArchive}
        sectionsCount={getTeacherSectionsCount(teacherToArchive)}
        assessmentsCount={getTeacherAssessmentsCount(teacherToArchive)}
      />
    </main>
  );
}
