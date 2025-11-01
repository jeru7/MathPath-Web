import { type ReactElement } from "react";
import { Student } from "../../../../student/types/student.type";
import StudentArchiveItem from "./StudentArchiveItem";

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
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No archived students</p>
          <p className="text-sm">There are no students in the archive.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {students.map((student) => (
        <div
          key={student.id}
          onClick={() => onStudentClick(student)}
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
        >
          <StudentArchiveItem student={student} />
        </div>
      ))}
    </div>
  );
}
