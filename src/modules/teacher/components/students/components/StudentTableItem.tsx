import { useEffect, useMemo, useState, type ReactElement } from "react";

import { Circle, Settings } from "lucide-react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  Student,
  StudentStatusType,
} from "../../../../core/types/student/student.types";
import { useTeacherContext } from "../../../hooks/useTeacher";
import { Section } from "../../../../core/types/section/section.types";
import { formatToPhDate } from "../../../../date/utils/date.util";

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
        className="hover:bg-[var(--primary-gray)]/10 cursor-pointer text-center"
        onClick={() => onClick(student.id)}
      >
        <td className="px-4 py-2 text-left">{student.referenceNumber}</td>
        <td className="max-w-[200px] truncate px-4 py-2 text-left">
          <div className="flex items-center gap-2">
            <Circle className="h-10 w-10" />
            <p>{`${student.lastName}, ${formatFirstName(student)}`}</p>
          </div>
        </td>
        <td className="px-4 py-2 text-center">
          {getSectionName(student.sectionId)}
        </td>
        <td
          className={`px-4 py-2 font-bold ${status === "Online" ? "text-[var(--tertiary-green)]" : "text-[var(--primary-red)]"}`}
        >
          {status}
        </td>
        <td className="px-4 py-2">
          {format(formatToPhDate(student.createdAt.toString()), "MMMM d, yyyy")}
        </td>
        <td className="px-4 py-2">
          {student.lastPlayed
            ? formatInTimeZone(
                student.lastPlayed?.toString(),
                "UTC",
                "MMMM d, yyyy",
              )
            : "N/A"}
        </td>
        <td className="px-4 py-2">
          <div className="hover:scale-101 flex w-full cursor-pointer items-center justify-center hover:text-[var(--primary-green)]">
            <Settings />
          </div>
        </td>
      </tr>
    </>
  );
}
