import { useState, type ReactElement } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTeacherContext } from "../../../../hooks/useTeacherData";
import { StudentType } from "../../../../types/student";
import StudentTableItem from "./StudentTableItem";

export default function StudentTable(): ReactElement {
  const { students } = useTeacherContext()

  const [sortConfig, setSortConfig] = useState<{
    key: keyof StudentType;
    direction: "ascending" | "descending";
  }>({ key: "status", direction: "descending" });

  const handleSort = (column: keyof StudentType) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key: column, direction })
  };

  const sortedStudents = [...students].sort((a, b) => {
    const column = sortConfig.key;
    let comparison = 0;

    if (a[column] instanceof Date && b[column] instanceof Date) {
      const dateA = new Date(a[column]);
      const dateB = new Date(b[column]);
      comparison = dateA.getTime() - dateB.getTime();
    } else if (typeof a[column] === "string" && typeof b[column] === "string") {
      comparison = a[column].localeCompare(b[column]);
    } else if (typeof a[column] === "number" && typeof b[column] === "number") {
      comparison = a[column] - b[column];
    }

    return sortConfig.direction === "ascending" ? comparison : -comparison
  });

  return (
    <div className="h-full overflow-x-auto">
      {students.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="font-bold text-[var(--primary-gray)]">Students List is empty.</p>
        </div>
      ) : (
        <table className="font-primary min-w-full table-auto">
          <thead className="border-b-2 border-b-[var(--primary-gray)]">
            <tr className="text-center text-[var(--primary-gray)]">
              <th
                className="px-4 py-2 text-left"
              >
                Student Number
              </th>
              <th
                className="cursor-pointer px-4 py-2"
                onClick={() => handleSort("lastName")}
              >
                <div className={`flex items-center justify-start gap-2 ${sortConfig.key === "lastName" ? "text-[var(--primary-black)]" : ""}`}>
                  Name
                  {sortConfig.key === "lastName" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-2"
                onClick={() => handleSort("section")}
              >
                <div className={`flex items-center justify-center gap-2 ${sortConfig.key === "section" ? "text-[var(--primary-black)]" : ""}`}>
                  Section
                  {sortConfig.key === "section" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-2"
                onClick={() => handleSort("status")}
              >
                <div className={`flex items-center justify-center gap-2 ${sortConfig.key === "status" ? "text-[var(--primary-black)]" : ""}`}>
                  Status
                  {sortConfig.key === "status" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
                </div>
              </th>
              <th className="cursor-pointer px-4 py-2"
                onClick={() => handleSort("createdAt")}
              >
                <div className={`flex items-center justify-center gap-2 ${sortConfig.key === "createdAt" ? "text-[var(--primary-black)]" : ""}`}>
                  Date Created
                  {sortConfig.key === "createdAt" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-2"
                onClick={() => handleSort("lastPlayed")}
              >
                <div className={`flex items-center justify-center gap-2 ${sortConfig.key === "lastPlayed" ? "text-[var(--primary-black)]" : ""}`}>
                  Last Played
                  {sortConfig.key === "lastPlayed" ? sortConfig.direction === "ascending" ? <ChevronUp /> : <ChevronDown /> : <ChevronDown />}
                </div>
              </th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <StudentTableItem student={student} key={student.studentNumber} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
