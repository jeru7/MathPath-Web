import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import StudentTableItem from "./StudentTableItem";
import { useNavigate } from "react-router-dom";
import "../../../../core/styles/customTable.css";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { useTeacherContext } from "../../../context/teacher.context";
import { Student } from "../../../../student/types/student.type";
import { getSectionName } from "../utils/student-table.util";
import { IoQrCodeOutline } from "react-icons/io5";

type StudentTableProps = {
  onClickAddStudent: () => void;
};

export default function StudentTable({
  onClickAddStudent,
}: StudentTableProps): ReactElement {
  const { students, sections, onlineStudents } = useTeacherContext();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "online" | "offline" | null
  >(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

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
  //

  const onlineStudentIds = useMemo(
    () => new Set(onlineStudents.map((s) => s.id)),
    [onlineStudents],
  );

  const filteredStudents = students
    .filter((student) => {
      const {
        firstName,
        lastName,
        middleName = "",
        referenceNumber,
        sectionId,
      } = student;

      const sectionName = getSectionName(sectionId, sections).toLowerCase();
      const query = searchQuery.toLowerCase();
      const fullName1 = `${lastName} ${firstName} ${middleName}`.toLowerCase();
      const fullName2 = `${firstName} ${lastName}`.toLowerCase();

      // Search filter
      return (
        referenceNumber.toLowerCase().includes(query) ||
        sectionName.includes(query) ||
        fullName1.includes(query) ||
        fullName2.includes(query) ||
        firstName.toLowerCase().includes(query) ||
        lastName.toLowerCase().includes(query) ||
        middleName.toLowerCase().includes(query)
      );
    })
    .filter((student) => {
      // Section filter
      if (selectedSections.length === 0) return true;
      return selectedSections.includes(student.sectionId);
    })
    .filter((student) => {
      // Status filter: compute from onlineStudentIds
      if (!selectedStatus) return true; // "All" selected
      const status = onlineStudentIds.has(student.id) ? "online" : "offline";
      return status === selectedStatus;
    });

  const handleSearchStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleItemOnclick = (studentId: string) => {
    navigate(`${studentId}`, { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="flex flex-col flex-1 overflow-x-hidden">
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
              value={searchQuery}
              onChange={handleSearchStudent}
            />
          </div>

          {/* filter */}
          <div className="relative">
            <button
              className="p-2 rounded-xs border-gray-200 border text-gray-400 h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200"
              onClick={() => setShowFilterDropdown((prev) => !prev)}
            >
              <CiFilter className="w-4 h-4" />
            </button>

            {showFilterDropdown && (
              <div
                className="absolute top-full left-0 bg-white border border-gray-300 rounded-sm p-4 shadow-lg z-10 w-64 mt-1 flex flex-col gap-4"
                ref={filterDropdownRef}
              >
                {/* Sections - multi-select checkboxes */}
                <div className="">
                  <p className="font-semibold mb-1">Sections</p>
                  <div className="flex flex-col max-h-32 overflow-y-auto gap-1">
                    {sections.map((section) => {
                      const isSelected = selectedSections.includes(section.id);

                      return (
                        <div
                          key={section.id}
                          className={`cursor-pointer px-2 py-1 rounded text-sm border w-fit ${
                            isSelected
                              ? "bg-[var(--primary-green)] text-white border-[var(--primary-green)]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSections((prev) =>
                                prev.filter((id) => id !== section.id),
                              );
                            } else {
                              setSelectedSections((prev) => [
                                ...prev,
                                section.id,
                              ]);
                            }
                          }}
                        >
                          {section.name}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status - radio buttons */}
                <div className="">
                  <p className="font-semibold mb-1">Status</p>
                  <div className="flex gap-1 text-sm">
                    {["all", "online", "offline"].map((status) => {
                      const isSelected =
                        (status === "all" && selectedStatus === null) ||
                        (status === "online" && selectedStatus === "online") ||
                        (status === "offline" && selectedStatus === "offline");

                      const displayText =
                        status === "all"
                          ? "All"
                          : status.charAt(0).toUpperCase() + status.slice(1);

                      return (
                        <div
                          key={status}
                          className={`cursor-pointer px-2 py-1 rounded border text-sm text-center ${
                            isSelected
                              ? "bg-[var(--primary-green)] text-white border-[var(--primary-green)]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            if (status === "all") {
                              setSelectedStatus(null);
                            } else {
                              setSelectedStatus(status as "online" | "offline");
                            }
                          }}
                        >
                          {displayText}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* registration codes button */}
        <div className="hidden md:flex gap-2 items-center">
          <button
            className="p-2 rounded-xs border-gray-200 border text-gray-400 h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200"
            type="button"
            onClick={() => navigate("registration-codes")}
          >
            <IoQrCodeOutline />
          </button>
          {/* create button */}
          <button
            className="flex gap-2 items-center justify-center py-3 px-4 bg-[var(--primary-green)]/90 rounded-sm text-white hover:cursor-pointer hover:bg-[var(--primary-green)] transition-all duration-200"
            onClick={onClickAddStudent}
          >
            <GoPlus className="w-4 h-4" />
            <p className="text-sm font-semibold">Add Student</p>
          </button>
        </div>
      </section>

      {students.length > 0 ? (
        <div className="flex flex-col flex-1 overflow-x-auto">
          <div className="flex flex-col w-full min-w-[1000px] flex-1">
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
                    onClick={() => handleSort("lastOnline")}
                  >
                    <div
                      className={`flex items-center gap-2 justify-center ${sortConfig.key === "lastOnline" ? "text-[var(--primary-black)]" : ""}`}
                    >
                      <p className="text-nowrap">Last Played</p>
                      {sortConfig.key === "lastOnline" ? (
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
                  {filteredStudents.map((student) => (
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
      ) : (
        <div className="flex flex-1 w-full items-center justify-center">
          <p className="text-gray-300 italic">No data available</p>
        </div>
      )}
    </section>
  );
}
