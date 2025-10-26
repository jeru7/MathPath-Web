import { useEffect, useState, type ReactElement } from "react";
import { format } from "date-fns-tz";
import {
  Student,
  StudentStatusType,
} from "../../../student/types/student.type";
import { capitalizeWord } from "../../../core/utils/string.util";
import { formatToPhDate } from "../../../core/utils/date.util";
import { getSectionName } from "../../../teacher/pages/students/utils/student-table.util";
import { Section } from "../../types/section/section.type";

type StudentTableItemProps = {
  student: Student;
  onClick: (studentId: string) => void;
  sections: Section[];
  onlineStudentIds: Set<string>;
};

export default function StudentTableItem({
  student,
  onClick,
  sections,
  onlineStudentIds,
}: StudentTableItemProps): ReactElement {
  const [status, setStatus] = useState<StudentStatusType>("Offline");

  const handleRowClick = () => {
    onClick(student.id);
  };

  useEffect(() => {
    setStatus(onlineStudentIds.has(student.id) ? "Online" : "Offline");
  }, [onlineStudentIds, student.id]);

  return (
    <tr
      className="w-full font-medium text-sm xl:text-base hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer overflow-visible transition-colors duration-200"
      onClick={handleRowClick}
    >
      <td className="text-left w-[15%] text-gray-900 dark:text-gray-100">
        {student.referenceNumber}
      </td>
      <td className="w-[20%] text-left">
        <div className="flex items-center gap-2 max-w-[180px] xl:max-w-none">
          <p className="whitespace-nowrap overflow-hidden text-ellipsis text-gray-900 dark:text-gray-100">{`${student.lastName}, ${capitalizeWord(`${student.firstName}`)}`}</p>
        </div>
      </td>
      <td className="w-[15%] text-gray-900 dark:text-gray-100">
        {getSectionName(student.sectionId, sections)}
      </td>
      <td
        className={`w-[15%] ${status === "Online"
            ? "text-[var(--tertiary-green)] dark:text-green-400"
            : "text-[var(--primary-red)] dark:text-red-400"
          }`}
      >
        {status}
      </td>
      <td className="w-[15%] text-gray-900 dark:text-gray-100">
        {format(formatToPhDate(student.createdAt.toString()), "MMMM d, yyyy")}
      </td>
      <td className="w-[15%] text-center text-gray-900 dark:text-gray-100">
        {student.lastOnline ? (
          format(new Date(student.lastOnline), "MMMM d, yyyy 'at' hh:mm a", {
            timeZone: "Asia/Manila",
          })
        ) : (
          <p className="text-gray-300 dark:text-gray-500">N/A</p>
        )}
      </td>
    </tr>
  );
}
