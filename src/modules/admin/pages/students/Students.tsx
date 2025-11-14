import { useEffect, useState, type ReactElement } from "react";
import { toast } from "react-toastify";
import { useAdminContext } from "../../context/admin.context";
import { AnimatePresence, motion } from "framer-motion";
import { GoPlus } from "react-icons/go";
import { Student } from "../../../student/types/student.type";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  useAdminArchiveStudent,
  useAdminDeleteStudent,
  useAdminEditStudent,
  useAdminRestoreStudent,
} from "../../services/admin-student.service";
import StudentTable from "../../../core/components/tables/student-table/StudentTable";
import StudentDetailsModal from "../../../core/components/tables/student-table/student-details/StudentDetailsModal";
import DeleteStudentConfirmationModal from "../../../core/components/tables/student-table/DeleteStudentConfirmationModal";
import { EditStudentDTO } from "../../../student/types/student.schema";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import EditStudentModal from "../../../core/components/tables/student-table/EditStudentModal";
import AddStudentModal from "../../../core/components/tables/student-table/AddStudentModal";
import StudentArchiveModal from "../../../core/components/tables/student-table/student-archive/StudentArchiveModal";
import StudentArchiveConfirmationModal from "../../../core/components/tables/student-table/StudentArchiveConfirmationModal";

export default function Students(): ReactElement {
  const adminContext = useAdminContext();
  const { rawSections, rawStudents, adminId, archivedStudents, allSections } =
    adminContext;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { studentId } = useParams();

  const { mutate: deleteStudent } = useAdminDeleteStudent(adminId);
  const { mutate: editStudent, isPending: isUpdating } =
    useAdminEditStudent(adminId);
  const { mutate: archiveStudent } = useAdminArchiveStudent(adminId);
  const { mutate: restoreStudent } = useAdminRestoreStudent(adminId);

  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [studentToArchive, setStudentToArchive] = useState<Student | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [hideFab, setHideFab] = useState<boolean>(false);

  const pathEnd = location.pathname.split("/").pop();
  const isAddStudentRoute = pathEnd === "add-student";
  const isStudentDetailsRoute =
    selectedStudent !== null && pathEnd === selectedStudent.id;
  const showArchive = location.pathname.endsWith("/archives");

  useEffect(() => {
    if (isAddStudentRoute || showArchive) {
      setHideFab(true);
    } else {
      setHideFab(false);
    }
  }, [isAddStudentRoute, showArchive]);

  useEffect(() => {
    if (studentId) {
      const student = rawStudents.find((s) => s.id === studentId);
      setSelectedStudent(student || null);
    } else {
      setSelectedStudent(null);
    }
  }, [studentId, rawStudents]);

  const handleAddStudent = () => {
    if (rawSections.length === 0) {
      toast.error("You can't add students if there are no sections.");
      return;
    }
    navigate("add-student");
  };

  const handleCloseAddStudentModal = () => {
    navigate("..");
  };

  const handleStudentClick = (studentId: string) => {
    setSelectedStudent(rawStudents.find((s) => s.id === studentId) || null);
    navigate(studentId);
  };

  const handleCloseDetailsModal = () => {
    navigate("..");
    setSelectedStudent(null);
  };

  const handleDeleteInitiate = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleArchiveInitiate = (student: Student) => {
    setStudentToArchive(student);
    setIsArchiveModalOpen(true);
  };

  const handleEditInitiate = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id, {
        onSuccess: () => {
          toast.success("Student deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "students"],
          });
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);

          if (selectedStudent?.id === studentToDelete.id) {
            navigate("..");
            setSelectedStudent(null);
          }
        },
        onError: () => {
          toast.error("Failed to delete student");
        },
      });
    }
  };

  const confirmArchive = () => {
    if (studentToArchive) {
      archiveStudent(studentToArchive.id, {
        onSuccess: () => {
          toast.success("Student archived successfully");
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "students"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin", adminId, "archived-students"],
          });
          setIsArchiveModalOpen(false);
          setStudentToArchive(null);

          if (selectedStudent?.id === studentToArchive.id) {
            navigate("..");
            setSelectedStudent(null);
          }
        },
        onError: () => {
          toast.error("Failed to archive student");
        },
      });
    }
  };

  const handleUpdateStudent = async (
    studentId: string,
    data: EditStudentDTO,
  ) => {
    return new Promise<void>((resolve, reject) => {
      editStudent(
        { studentId, studentData: data },
        {
          onSuccess: () => {
            toast.success("Student updated successfully.");
            queryClient.invalidateQueries({
              queryKey: ["admin", adminId, "students"],
            });
            resolve();
          },
          onError: (error: unknown) => {
            const errorData: APIErrorResponse = handleApiError(error);

            if (errorData.error === "EMAIL_ALREADY_EXISTS") {
              console.error("A student with this email already exists.");
            } else {
              console.error("Failed to update student.");
            }

            reject(error);
          },
        },
      );
    });
  };

  const handleRestoreStudent = (studentId: string) => {
    restoreStudent(studentId, {
      onSuccess: () => {
        toast.success("Student restored successfully");
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "students"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "archived-students"],
        });
      },
      onError: (error: unknown) => {
        const errorData: APIErrorResponse = handleApiError(error);

        if (errorData.error === "ARCHIVED_SECTION") {
          toast.error(
            "Student's section is currently archived. Please restore it first.",
          );
        } else {
          toast.error("Failed to restore student");
        }
      },
    });
  };

  const handlePermanentDelete = (studentId: string) => {
    deleteStudent(studentId, {
      onSuccess: () => {
        toast.success("Student permanently deleted");
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "students"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "archived-students"],
        });
      },
      onError: () => {
        toast.error("Failed to delete student");
      },
    });
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const cancelArchive = () => {
    setIsArchiveModalOpen(false);
    setStudentToArchive(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const atBottom = scrollPosition >= pageHeight - 10;

      setShowAddButton(!atBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-secondary flex flex-col h-full min-h-screen mt-4 md:mt-0 w-full gap-2 p-2">
      <AnimatePresence>
        {showAddButton && !hideFab && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 100, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-full h-16 w-16 bg-[var(--primary-green)]/90 fixed z-5 right-5 bottom-5 flex items-center justify-center md:hidden"
            type="button"
            onClick={handleAddStudent}
          >
            <GoPlus className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          Students
        </h3>
      </header>

      <section className="overflow-y-hidden w-full  flex-1 flex flex-col">
        <StudentTable
          onClickAddStudent={handleAddStudent}
          onStudentClick={handleStudentClick}
          context={adminContext}
          showRegistrationCodes={false}
          showArchive={true}
          hideFab={hideFab}
        />
      </section>

      {/* add student modal */}
      <AddStudentModal
        isOpen={isAddStudentRoute}
        onClose={handleCloseAddStudentModal}
      />

      {/* archive modal */}
      {showArchive && archivedStudents && (
        <StudentArchiveModal
          isOpen={showArchive}
          onClose={() => navigate("..")}
          students={archivedStudents}
          onRestoreStudent={handleRestoreStudent}
          onDeleteStudent={handlePermanentDelete}
          sections={allSections}
        />
      )}

      {/* student details modal */}
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          isOpen={isStudentDetailsRoute}
          onClose={handleCloseDetailsModal}
          sections={rawSections}
          onEdit={handleEditInitiate}
          onArchive={() => handleArchiveInitiate(selectedStudent)}
          onDelete={() => handleDeleteInitiate(selectedStudent)}
        />
      )}

      {/* edit student modal */}
      {selectedStudent && (
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          student={selectedStudent}
          onUpdateStudent={handleUpdateStudent}
          isSubmitting={isUpdating}
          sections={rawSections}
          showSectionSelection={true}
        />
      )}

      {/* delete confirmation modal */}
      <DeleteStudentConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        student={studentToDelete}
      />

      {/* archive confirmation modal */}
      <StudentArchiveConfirmationModal
        isOpen={isArchiveModalOpen}
        onClose={cancelArchive}
        onConfirm={confirmArchive}
        student={studentToArchive}
      />
    </main>
  );
}
