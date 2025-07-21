import { useEffect, useMemo, useState, type ReactElement } from "react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Section } from "../../../../core/types/section/section.type";
import { formatToPhDate } from "../../../../date/utils/date.util";
import { HiDotsVertical } from "react-icons/hi";
import { useTeacherContext } from "../../../context/teacher.context";
import {
  Student,
  StudentStatusType,
} from "../../../../student/types/student.type";

interface IStudentTableItemProps {
  student: Student;
  onClick: (studentId: string) => void;
}

const formatFirstName = (student: Student) => {
  const firstName = student.firstName
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    .join(" ");

  return firstName;
};

export default function StudentTableItem({
  student,
  onClick,
}: IStudentTableItemProps): ReactElement {
  const { sections, onlineStudents } = useTeacherContext();
  const onlineStudentIds = useMemo(
    () => new Set(onlineStudents.map((student) => student.id)),
    [onlineStudents],
  );
  const [status, setStatus] = useState<StudentStatusType>("Offline");

  // get the section name using the section id on the student
  const getSectionName = (sectionId: string) => {
    const studentSection: Section | undefined = sections.find(
      (section) => section.id === sectionId,
    );
    return studentSection ? studentSection.name : "Unknown section";
  };

  useEffect(() => {
    setStatus(onlineStudentIds.has(student.id) ? "Online" : "Offline");
  }, [onlineStudentIds, student.id]);

  return (
    <>
      {console.log(student)}
      <tr
        className="hover:bg-gray-100 cursor-pointer text-left font-medium"
        onClick={() => onClick(student.id)}
      >
        <td className="text-left w-[15%]">{student.referenceNumber}</td>
        <td className="w-[20%] text-left">
          <div className="flex items-center gap-2">
            <p>{`${student.lastName}, ${formatFirstName(student)}`}</p>
          </div>
        </td>
        <td className="w-[15%]">{getSectionName(student.sectionId)}</td>
        <td
          className={`w-[15%] ${status === "Online" ? "text-[var(--tertiary-green)]" : "text-[var(--primary-red)]"}`}
        >
          {status}
        </td>
        <td className="w-[15%]">
          {format(formatToPhDate(student.createdAt.toString()), "MMMM d, yyyy")}
        </td>
        <td className="w-[15%]">
          {student.lastPlayed
            ? formatInTimeZone(
                student.lastPlayed?.toString(),
                "UTC",
                "MMMM d, yyyy",
              )
            : "N/A"}
        </td>
        <td className="w-[5%]">
          <button className="hover:scale-110 hover:cursor-pointer">
            <HiDotsVertical />
          </button>
        </td>
      </tr>
    </>
  );
}
