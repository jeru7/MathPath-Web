import { useEffect, useState, type ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StudentTable from "./components/StudentTable";
import { useTeacherContext } from "../../context/teacher.context";
import { AnimatePresence, motion } from "framer-motion";
import AddStudent from "./components/add-student/AddStudent";
import { GoPlus } from "react-icons/go";
import RegistrationCode from "./registration-codes/RegistrationCode";
import { Student } from "../../../student/types/student.type";
import StudentDetailsModal from "./components/student-details/StudentDetailsModal";
import { useTeacherDeleteStudent } from "../../services/teacher.service";
import DeleteStudentConfirmationModal from "./components/DeleteStudentConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";

export default function Students(): ReactElement {
  const { teacherId } = useTeacherContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { sections, students } = useTeacherContext();
  const { mutate: deleteStudent } = useTeacherDeleteStudent(teacherId);

  const showForm = location.pathname.endsWith("/add-students");
  const showCodes = location.pathname.endsWith("/registration-codes");

  const mode: string | null = searchParams.get("mode");

  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleAddStudent = () => {
    if (sections.length === 0) {
      toast.error("You can't add students if there are no sections.");
      return;
    }
    navigate("add-students");
  };

  const handleStudentClick = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setIsModalOpen(true);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setStudentToDelete(student);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id, {
        onSuccess: () => {
          toast.success("Student deleted successfully");

          queryClient.invalidateQueries({
            queryKey: ["teacher", teacherId, "students"],
          });
        },
        onError: () => {
          toast.error("Failed to delete student");
        },
      });
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
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
          onDeleteStudent={handleDeleteStudent}
        />
      </section>

      {showForm && (
        <AddStudent
          navigate={navigate}
          initialMode={mode as "manual" | "generate" | null}
        />
      )}

      {showCodes && <RegistrationCode navigate={navigate} />}

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
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
