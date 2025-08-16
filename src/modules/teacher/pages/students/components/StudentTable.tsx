import { useState, type ReactElement } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import StudentTableItem from "./StudentTableItem";
import { useNavigate } from "react-router-dom";
import "../../../../core/styles/customTable.css";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { useTeacherContext } from "../../../context/teacher.context";
import { Student } from "../../../../student/types/student.type";
import { AnimatePresence, motion } from "framer-motion";

type StudentTableProps = {
  onClickAddStudent: () => void;
  showAddButton: boolean;
};
export default function StudentTable({
  onClickAddStudent,
  showAddButton,
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
    <section className="flex flex-col flex-1 overflow-x-hidden">
      <AnimatePresence>
        {showAddButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 100, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-full h-16 w-16 bg-[var(--primary-green)]/90 fixed z-5 right-5 bottom-5 flex items-center justify-center md:hidden"
            type="button"
            onClick={onClickAddStudent}
          >
            <GoPlus className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <section className="w-full border-b-gray-200 p-4 border-b flex gap-2 justify-center md:items-center md:justify-between">
        {/* search */}
        <section className="flex gap-2 items-center w-full md:w-fit">
          <div className="flex rounded-sm border-gray-200 border h-fit items-center pr-2 w-full">
            <div className="p-2">
              <CiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              placeholder="Search student"
              className="text-xs focus:outline-none"
            />
          </div>

          {/* filter */}
          <button className="p-2 rounded-xs border-gray-200 border text-gray-400 h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200">
            <CiFilter className="w-4 h-4" />
          </button>

          <section className="flex"></section>
        </section>

        {/* create button */}
        <button
          className="hidden md:flex gap-2 items-center justify-center py-3 px-4 bg-[var(--primary-green)]/90 rounded-sm text-white hover:cursor-pointer hover:bg-[var(--primary-green)] transition-all duration-200"
          onClick={onClickAddStudent}
        >
          <GoPlus className="w-4 h-4" />
          <p className="text-sm font-semibold">Add Student</p>
        </button>
      </section>

      {/* table */}
      <div className="flex flex-col flex-1 overflow-x-auto">
        <div className="w-full min-w-[1000px] flex-1">
          {/* headers */}
          <table className="font-primary table-auto w-full">
            <thead className="text-gray-400 text-sm xl:text-base">
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
                    <p className="text-nowrap">Date Created</p>
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
                    <p className="text-nowrap">Last Played</p>
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

          {/* student items/list */}
          <div className="flex-1 overflow-y-auto">
            <table className="font-primary table-auto w-full text-sm xl:text-base">
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
      </div>
    </section>
  );
}
