import { useState, type ReactElement } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import StudentTableItem from "./StudentTableItem";
import { useNavigate } from "react-router-dom";
import "../../../../core/styles/customTable.css";
import { Student } from "../../../../core/types/student/student.types";
import { useTeacherContext } from "../../../hooks/useTeacher";

export default function StudentTable(): ReactElement {
  const { students } = useTeacherContext();
  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: "ascending" | "descending";
  }>({ key: "status", direction: "descending" });

  const handleSort = (column: keyof Student) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key: column, direction });
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

    return sortConfig.direction === "ascending" ? comparison : -comparison;
  });

  const handleItemOnclick = (studentId: string) => {
    navigate(`${studentId}`, { replace: true });
  };

  return (
    <div className="table-container h-full">
      {students.length === 0 ? (
        <div className="flex w-full h-full flex-1 items-center justify-center text-[var(--primary-gray)] italic">
          Student list is currently empty.
        </div>
      ) : (
        <div className="min-h-full">
          {/* Table */}
          <table className="font-primary table-auto">
            <thead>
              <tr className="text-[var(--primary-gray)]">
                <th className="text-left">LRN</th>
                <th
                  className="cursor-pointer px-4 py-2"
                  onClick={() => handleSort("lastName")}
                >
                  <div
                    className={`flex items-center justify-start gap-2 ${sortConfig.key === "lastName" ? "text-[var(--primary-black)]" : ""}`}
                  >
                    Name
                    {sortConfig.key === "lastName" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-2"
                  onClick={() => handleSort("sectionId")}
                >
                  <div
                    className={`flex items-center justify-center gap-2 ${sortConfig.key === "sectionId" ? "text-[var(--primary-black)]" : ""}`}
                  >
                    Section
                    {sortConfig.key === "sectionId" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-2"
                  onClick={() => handleSort("status")}
                >
                  <div
                    className={`flex items-center justify-center gap-2 ${sortConfig.key === "status" ? "text-[var(--primary-black)]" : ""}`}
                  >
                    Status
                    {sortConfig.key === "status" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-2"
                  onClick={() => handleSort("createdAt")}
                >
                  <div
                    className={`flex items-center justify-center gap-2 ${sortConfig.key === "createdAt" ? "text-[var(--primary-black)]" : ""}`}
                  >
                    Date Created
                    {sortConfig.key === "createdAt" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-2"
                  onClick={() => handleSort("lastPlayed")}
                >
                  <div
                    className={`flex items-center justify-center gap-2 ${sortConfig.key === "lastPlayed" ? "text-[var(--primary-black)]" : ""}`}
                  >
                    Last Played
                    {sortConfig.key === "lastPlayed" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <StudentTableItem
                  student={student}
                  key={student.referenceNumber}
                  onClick={handleItemOnclick}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
