import { useEffect, useMemo, useState, type ReactElement } from "react";

import { Circle, Settings } from "lucide-react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { IStudent, StudentStatusType } from "../../../../types/student.type";
import { useTeacherContext } from "../../../../hooks/useTeacher";
import { ISection } from "../../../../types/section.type";
import { convertToPhilippinesDate } from "../../../../utils/date.util";

interface IStudentTableItemProps {
  student: IStudent;
  onClick: (studentId: string) => void;
}

const formatFirstName = (student: IStudent) => {
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
    () => new Set(onlineStudents.map((student) => student._id)),
    [onlineStudents],
  );
  const [status, setStatus] = useState<StudentStatusType>("Offline");

  // get the section name using the section id on the student
  const getSectionName = (sectionId: string) => {
    const studentSection: ISection | undefined = sections.find(
      (section) => section._id === sectionId,
    );
    return studentSection ? studentSection.name : "Unknown section";
  };

  useEffect(() => {
    setStatus(onlineStudentIds.has(student._id) ? "Online" : "Offline");
  }, [onlineStudentIds, student._id]);

  return (
    <>
      {console.log(student)}
      <tr
        className="hover:bg-[var(--primary-gray)]/10 cursor-pointer text-center"
        onClick={() => onClick(student._id)}
      >
        <td className="px-4 py-2 text-left">{student.referenceNumber}</td>
        <td className="max-w-[200px] truncate px-4 py-2 text-left">
          <div className="flex items-center gap-2">
            <Circle className="h-10 w-10" />
            <p>{`${student.lastName}, ${formatFirstName(student)}`}</p>
          </div>
        </td>
        <td className="px-4 py-2 text-center">
          {getSectionName(student.section)}
        </td>
        <td
          className={`px-4 py-2 font-bold ${status === "Online" ? "text-[var(--tertiary-green)]" : "text-[var(--primary-red)]"}`}
        >
          {status}
        </td>
        <td className="px-4 py-2">
          {format(
            convertToPhilippinesDate(student.createdAt.toString()),
            "MMMM d, yyyy",
          )}
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
