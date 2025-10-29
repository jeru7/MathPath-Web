import { useEffect, useState, type ReactElement } from "react";
import { toast } from "react-toastify";
import { useAdminContext } from "../../context/admin.context";
import { AnimatePresence, motion } from "framer-motion";
import { GoPlus } from "react-icons/go";
import { Student } from "../../../student/types/student.type";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  useAdminDeleteStudent,
  useAdminEditStudent,
} from "../../services/admin-student.service";
import StudentTable from "../../../core/components/student-table/StudentTable";
import StudentDetailsModal from "../../../core/components/student-table/student-details/StudentDetailsModal";
import DeleteStudentConfirmationModal from "../../../core/components/student-table/DeleteStudentConfirmationModal";
import { EditStudentDTO } from "../../../student/types/student.schema";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import EditStudentModal from "../../../core/components/student-table/EditStudentModal";
import AddStudentModal from "../../../core/components/student-table/AddStudentModal";

export default function Students(): ReactElement {
  const adminContext = useAdminContext();
  const { sections, students, adminId } = adminContext;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { studentId } = useParams();

  const { mutate: deleteStudent } = useAdminDeleteStudent(adminId);
  const { mutate: editStudent, isPending: isUpdating } =
    useAdminEditStudent(adminId);

  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const pathEnd = location.pathname.split("/").pop();
  const isAddStudentRoute = pathEnd === "add-student";
  const isStudentDetailsRoute =
    selectedStudent !== null && pathEnd === selectedStudent.id;

  useEffect(() => {
    if (studentId) {
      const student = students.find((s) => s.id === studentId);
      setSelectedStudent(student || null);
    } else {
      setSelectedStudent(null);
    }
  }, [studentId, students]);

  const handleAddStudent = () => {
    if (sections.length === 0) {
      toast.error("You can't add students if there are no sections.");
      return;
    }
    navigate("add-student");
  };

  const handleCloseAddStudentModal = () => {
    navigate("..");
  };

  const handleStudentClick = (studentId: string) => {
    setSelectedStudent(students.find((s) => s.id === studentId) || null);
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

            // handle specific error cases
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

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
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
    <main className="flex flex-col h-full min-h-screen w-full max-w-[2400px] gap-2 bg-inherit p-2">
      <AnimatePresence>
        {showAddButton && (
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
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Students
        </h3>
      </header>

      <section className="overflow-y-hidden w-full bg-white border border-white dark:bg-gray-800 dark:border-gray-700 shadow-sm rounded-sm flex-1 flex flex-col">
        <StudentTable
          onClickAddStudent={handleAddStudent}
          onStudentClick={handleStudentClick}
          context={adminContext}
          showRegistrationCodes={false}
        />
      </section>

      {/* add student modal */}
      <AddStudentModal
        isOpen={isAddStudentRoute}
        onClose={handleCloseAddStudentModal}
      />

      {/* student details modal */}
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          isOpen={isStudentDetailsRoute}
          onClose={handleCloseDetailsModal}
          sections={sections}
          onEdit={handleEditInitiate}
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
          sections={sections}
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
    </main>
  );
}
