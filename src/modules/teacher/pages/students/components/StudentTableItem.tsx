import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { format } from "date-fns";
import { formatToPhDate } from "../../../../date/utils/date.util";
import { HiDotsVertical } from "react-icons/hi";
import { useTeacherContext } from "../../../context/teacher.context";
import {
  Student,
  StudentStatusType,
} from "../../../../student/types/student.type";
import { capitalizeWord } from "../../../../core/utils/string.util";
import { useTeacherDeleteStudent } from "../../../services/teacher.service";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getSectionName } from "../utils/student-table.util";

interface IStudentTableItemProps {
  student: Student;
  onClick: (studentId: string) => void;
}

export default function StudentTableItem({
  student,
  onClick,
}: IStudentTableItemProps): ReactElement {
  const { teacherId } = useParams();
  const queryClient = useQueryClient();
  const { sections, onlineStudents } = useTeacherContext();
  const { mutate: deleteStudent } = useTeacherDeleteStudent(teacherId ?? "");
  const onlineStudentIds = useMemo(
    () => new Set(onlineStudents.map((student) => student.id)),
    [onlineStudents],
  );
  const [status, setStatus] = useState<StudentStatusType>("Offline");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleDeleteStudent = () => {
    deleteStudent(student.id, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ["teacher", teacherId, "students"],
        });
      },
    });
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
      className="w-full font-medium text-sm xl:text-base hover:bg-gray-100 hover:cursor-pointer overflow-visible"
      onClick={() => onClick(student.id)}
    >
      <td className="text-left w-[15%]">{student.referenceNumber}</td>
      <td className="w-[20%] text-left">
        <div className="flex items-center gap-2 max-w-[180px] xl:max-w-none">
          <p className="whitespace-nowrap overflow-hidden text-ellipsis">{`${student.lastName}, ${capitalizeWord(`${student.firstName}`)}`}</p>
        </div>
      </td>
      <td className="w-[15%]">{getSectionName(student.sectionId, sections)}</td>
      <td
        className={`w-[15%] ${status === "Online" ? "text-[var(--tertiary-green)]" : "text-[var(--primary-red)]"}`}
      >
        {status}
      </td>
      <td className="w-[15%]">
        {format(formatToPhDate(student.createdAt.toString()), "MMMM d, yyyy")}
      </td>
      <td className="w-[15%] text-center">
        {student.lastOnline ? (
          format(
            formatToPhDate(student.lastOnline.toString()),
            "MMMM d, yyyy 'at' hh:mm a",
          )
        ) : (
          <p className="text-gray-300">N/A</p>
        )}
      </td>
      <td className="w-[5%] text-center relative">
        <button
          className="hover:scale-110 hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
        >
          <HiDotsVertical />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-20 w-28 top-0 bg-white border border-gray-200 rounded shadow-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* edit button */}
            <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 hover:cursor-pointer">
              Edit
            </button>

            {/* delete button */}
            <button
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500 hover:cursor-pointer"
              type="button"
              onClick={handleDeleteStudent}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
