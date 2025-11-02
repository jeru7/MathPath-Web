import { type ReactElement, useState } from "react";
import { IoClose } from "react-icons/io5";
import StudentArchiveList from "./StudentArchiveList";
import { Student } from "../../../../student/types/student.type";
import ModalOverlay from "../../modal/ModalOverlay";
import { Section } from "../../../types/section/section.type";
import StudentDetailsModal from "../student-details/StudentDetailsModal";

type StudentArchiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onRestoreStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  sections: Section[];
};

export default function StudentArchiveModal({
  isOpen,
  onClose,
  students,
  onRestoreStudent,
  onDeleteStudent,
  sections,
}: StudentArchiveModalProps): ReactElement {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseDetailsModal = () => {
    setSelectedStudent(null);
  };

  const handleRestore = () => {
    if (selectedStudent) {
      onRestoreStudent(selectedStudent.id);
      setSelectedStudent(null);
    }
  };

  const handleDelete = () => {
    if (selectedStudent) {
      onDeleteStudent(selectedStudent.id);
      setSelectedStudent(null);
    }
  };

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-sm border border-white dark:border-gray-700 h-[100svh] w-[100svw] md:h-[85svh] md:w-[90svw] lg:w-[75svw] md:max-w-7xl md:max-h-[800px] overflow-hidden flex flex-col">
          {/* header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Archived Students
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {students.length} archived student
                {students.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-900 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 ml-4"
            >
              <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <StudentArchiveList
                students={students}
                onStudentClick={handleStudentClick}
              />
            </div>
          </div>

          {/* footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select a student to view details or restore
              </p>
            </div>
          </div>
        </div>
      </ModalOverlay>

      {/* student details modal for archived students */}
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={handleCloseDetailsModal}
          sections={sections}
          onArchive={handleRestore}
          onDelete={handleDelete}
          disableEdit={true}
          archiveLabel="Restore"
        />
      )}
    </>
  );
}
