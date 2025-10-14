import { type ReactElement } from "react";
import { Student } from "../../../../../student/types/student.type";
import { useTeacherContext } from "../../../../context/teacher.context";
import { getSectionName } from "../../utils/student-table.util";
import { format } from "date-fns-tz";

type DetailsOverviewProps = {
  student: Student;
};

export default function DetailsOverview({
  student,
}: DetailsOverviewProps): ReactElement {
  const { sections } = useTeacherContext();

  return (
    <div className="">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
        Student Details
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">LRN:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {student.referenceNumber}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Name:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {student.lastName}, {student.firstName} {student.middleName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Section:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {getSectionName(student.sectionId, sections)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Date Created:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {format(new Date(student.createdAt.toString()), "MMMM d, yyyy", {
              timeZone: "Asia/Manila",
            })}
          </span>
        </div>
        {student.lastOnline && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Last Online:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {format(new Date(student.lastOnline), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
        )}
        {student.characterName && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Character Name:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {student.characterName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
