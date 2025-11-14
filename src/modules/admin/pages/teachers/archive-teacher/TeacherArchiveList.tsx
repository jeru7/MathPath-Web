import { type ReactElement } from "react";
import TeacherArchiveItem from "./TeacherArchiveItem";
import { GoArchive } from "react-icons/go";
import { Teacher } from "@/modules/teacher/types/teacher.type";

type TeacherArchiveListProps = {
  teachers: Teacher[];
  onTeacherClick: (teacher: Teacher) => void;
};

export default function TeacherArchiveList({
  teachers,
  onTeacherClick,
}: TeacherArchiveListProps): ReactElement {
  if (teachers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <GoArchive className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Archived Teachers
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Teachers that you archive will appear here. You can restore them at
            any time.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm p-3 text-left">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> Archive teachers to keep your active list
              organized while preserving all their data and sections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // sort teachers by archive date (using updatedAt as fallback)
  const sortedTeachers = [...teachers].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className="space-y-6">
      {sortedTeachers.length > 0 && (
        <div>
          <div className="space-y-2">
            {sortedTeachers.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => onTeacherClick(teacher)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
              >
                <TeacherArchiveItem teacher={teacher} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
