import { useState, type ReactElement } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import StudentTableItem from "./StudentTableItem";
import { useNavigate } from "react-router-dom";
import "../../../../core/styles/customTable.css";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { useTeacherContext } from "../../../context/teacher.context";
import { Student } from "../../../../student/types/student.type";

type StudentTableProps = {
  onClickAddStudent: () => void;
};
export default function StudentTable({
  onClickAddStudent,
}: StudentTableProps): ReactElement {
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

  // const sortedStudents = [...students].sort((a, b) => {
  //   const column = sortConfig.key;
  //   let comparison = 0;
  //
  //   if (a[column] instanceof Date && b[column] instanceof Date) {
  //     const dateA = new Date(a[column]);
  //     const dateB = new Date(b[column]);
  //     comparison = dateA.getTime() - dateB.getTime();
  //   } else if (typeof a[column] === "string" && typeof b[column] === "string") {
  //     comparison = a[column].localeCompare(b[column]);
  //   } else if (typeof a[column] === "number" && typeof b[column] === "number") {
  //     comparison = a[column] - b[column];
  //   }
  //
  //   return sortConfig.direction === "ascending" ? comparison : -comparison;
  // });

  const handleItemOnclick = (studentId: string) => {
    navigate(`${studentId}`, { replace: true });
  };

  return (
    <section className="h-full">
      <section className="w-full border-b-gray-200 p-4 border-b flex justify-between">
        {/* Search */}
        <section className="flex gap-2 items-center">
          <div className="flex rounded-sm border-gray-200 border h-fit items-center pr-2">
            <div className="p-2">
              <CiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              placeholder="Search student"
              className="text-xs focus:outline-none"
            />
          </div>
          {/* Filter */}
          <button className="p-2 rounded-xs border-gray-200 border text-gray-400 h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200">
            <CiFilter className="w-4 h-4" />
          </button>

          <section className="flex"></section>
        </section>
        {/* Create button */}
        <button
          className="flex gap-2 items-center justify-center py-3 px-4 bg-[var(--primary-green)]/90 rounded-sm text-white hover:cursor-pointer hover:bg-[var(--primary-green)] transition-all duration-200"
          onClick={onClickAddStudent}
        >
          <GoPlus className="w-4 h-4" />
          <p className="text-sm font-semibold">Add Student</p>
        </button>
      </section>

      {/* Table */}
      <div className="h-full">
        <div className="overflow-x-auto">
          {/* Headers */}
          <table className="font-primary table-auto w-full">
            <thead className="text-gray-400">
              <tr className="text-left">
                <th className="w-[15%]">LRN</th>
                <th
                  className="cursor-pointer w-[20%]"
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
                  className="cursor-pointer w-[15%]"
                  onClick={() => handleSort("sectionId")}
                >
                  <div
                    className={`flex items-center gap-2 ${sortConfig.key === "sectionId" ? "text-[var(--primary-black)]" : ""}`}
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
                  className="cursor-pointer w-[15%]"
                  onClick={() => handleSort("status")}
                >
                  <div
                    className={`flex items-center gap-2 ${sortConfig.key === "status" ? "text-[var(--primary-black)]" : ""}`}
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
                  className="cursor-pointer w-[15%]"
                  onClick={() => handleSort("createdAt")}
                >
                  <div
                    className={`flex items-center gap-2 ${sortConfig.key === "createdAt" ? "text-[var(--primary-black)]" : ""}`}
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
                  className="cursor-pointer w-[15%]"
                  onClick={() => handleSort("lastPlayed")}
                >
                  <div
                    className={`flex items-center gap-2 ${sortConfig.key === "lastPlayed" ? "text-[var(--primary-black)]" : ""}`}
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
                <th className="w-[5%]"></th>
              </tr>
            </thead>
          </table>
        </div>
        {/* student items/list */}
        <div className="h-[750px] overflow-y-auto">
          <table className="font-primary table-auto w-full">
            <tbody>
              {students.map((student) => (
                <StudentTableItem
                  student={student}
                  key={student.referenceNumber}
                  onClick={handleItemOnclick}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
