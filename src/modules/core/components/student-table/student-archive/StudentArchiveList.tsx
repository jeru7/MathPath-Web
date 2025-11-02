import { type ReactElement } from "react";
import { Student } from "../../../../student/types/student.type";
import StudentArchiveItem from "./StudentArchiveItem";
import { GoArchive } from "react-icons/go";

type StudentArchiveListProps = {
  students: Student[];
  onStudentClick: (student: Student) => void;
};

export default function StudentArchiveList({
  students,
  onStudentClick,
}: StudentArchiveListProps): ReactElement {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <GoArchive className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Archived Students
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Students that you archive will appear here. You can restore them at
            any time.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm p-3 text-left">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> Archive students to keep your active list
              organized while preserving all their data and progress.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // sort students by archive date
  const sortedStudents = [...students].sort((a, b) => {
    const dateA = a.archive?.archiveDate
      ? new Date(a.archive.archiveDate).getTime()
      : new Date(a.updatedAt).getTime();
    const dateB = b.archive?.archiveDate
      ? new Date(b.archive.archiveDate).getTime()
      : new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className="space-y-6">
      {sortedStudents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            Archived Students
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {sortedStudents.length}
            </span>
          </h3>
          <div className="space-y-2">
            {sortedStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => onStudentClick(student)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
              >
                <StudentArchiveItem student={student} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
