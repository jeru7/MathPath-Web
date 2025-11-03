import { type ReactElement } from "react";
import { format } from "date-fns-tz";
import { Student } from "../../../../student/types/student.type";
import { getSectionName } from "../../../../teacher/pages/students/utils/student-table.util";
import { Section } from "../../../types/section/section.type";

type DetailsOverviewProps = {
  student: Student;
  sections: Section[];
};

export default function DetailsOverview({
  student,
  sections,
}: DetailsOverviewProps): ReactElement {
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
        {/* email */}
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Email:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {student.email}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Section:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {getSectionName(student.sectionId, sections)}
          </span>
        </div>
        {/* verification status */}
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Verification Status:
          </span>
          <span
            className={`font-medium ${student.verified?.verified
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
              }`}
          >
            {student.verified?.verified ? "Verified" : "Not Verified"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Date Created:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {format(
              new Date(student.createdAt.toString()),
              "MMMM d 'at' hh:mm a, yyyy",
              {
                timeZone: "Asia/Manila",
              },
            )}
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
