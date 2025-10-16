import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { format } from "date-fns-tz";
import { HiDotsVertical } from "react-icons/hi";
import { useTeacherContext } from "../../../context/teacher.context";
import {
  Student,
  StudentStatusType,
} from "../../../../student/types/student.type";
import { capitalizeWord } from "../../../../core/utils/string.util";
import { getSectionName } from "../utils/student-table.util";
import { formatToPhDate } from "../../../../core/utils/date.util";

type StudentTableItemProps = {
  student: Student;
  onClick: (studentId: string) => void;
  onDelete: (studentId: string) => void;
};

export default function StudentTableItem({
  student,
  onClick,
  onDelete,
}: StudentTableItemProps): ReactElement {
  const { sections, onlineStudents } = useTeacherContext();

  const onlineStudentIds = useMemo(
    () => new Set(onlineStudents.map((student) => student.id)),
    [onlineStudents],
  );

  const [status, setStatus] = useState<StudentStatusType>("Offline");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleRowClick = () => {
    onClick(student.id);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    console.log("Edit student:", student.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(student.id);
  };

  useEffect(() => {
    setStatus(onlineStudentIds.has(student.id) ? "Online" : "Offline");
  }, [onlineStudentIds, student.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        className={`w-[15%] ${status === "Online" ? "text-[var(--tertiary-green)] dark:text-green-400" : "text-[var(--primary-red)] dark:text-red-400"}`}
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
      <td className="w-[5%] text-center relative">
        <button
          className="hover:scale-110 hover:cursor-pointer text-gray-900 dark:text-gray-100 transition-transform duration-200"
          onClick={handleMenuClick}
        >
          <HiDotsVertical />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-20 w-28 top-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50 transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* edit button */}
            <button
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer text-gray-900 dark:text-gray-100 transition-colors duration-200"
              onClick={handleEditClick}
            >
              Edit
            </button>

            {/* delete button */}
            <button
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400 hover:cursor-pointer transition-colors duration-200"
              type="button"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
