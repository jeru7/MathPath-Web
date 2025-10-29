import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import StudentTableItem from "./StudentTableItem";
import { useNavigate } from "react-router-dom";
import "../../../core/styles/customTable.css";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { Student } from "../../../student/types/student.type";
import { IoQrCodeOutline } from "react-icons/io5";
import { getSectionName } from "../../../teacher/pages/students/utils/student-table.util";
import { Section } from "../../types/section/section.type";

// context type to distinguish between teacher and admin
export type StudentTableContext = {
  students: Student[];
  sections: Section[];
  onlineStudents: Student[];
};

type StudentTableProps = {
  onClickAddStudent: () => void;
  onStudentClick: (studentId: string) => void;
  context: StudentTableContext;
  registrationCodesPath?: string;
  showRegistrationCodes?: boolean;
};

export default function StudentTable({
  onClickAddStudent,
  onStudentClick,
  context,
  registrationCodesPath = "registration-codes",
  showRegistrationCodes = false,
}: StudentTableProps): ReactElement {
  const { students, sections, onlineStudents } = context;
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "online" | "offline" | null
  >(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student | "sectionName" | "statusComputed";
    direction: "ascending" | "descending";
  }>({ key: "statusComputed", direction: "descending" });

  const onlineStudentIds = useMemo(
    () => new Set(onlineStudents.map((s) => s.id)),
    [onlineStudents],
  );

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      const {
        firstName = "",
        lastName = "",
        middleName = "",
        referenceNumber = "",
        sectionId,
      } = student;

      const sectionName = getSectionName(sectionId, sections).toLowerCase();
      const query = searchQuery.toLowerCase();

      const safeFirstName = firstName || "";
      const safeLastName = lastName || "";
      const safeMiddleName = middleName || "";
      const safeReferenceNumber = referenceNumber || "";

      const fullName1 =
        `${safeLastName} ${safeFirstName} ${safeMiddleName}`.toLowerCase();
      const fullName2 = `${safeFirstName} ${safeLastName}`.toLowerCase();

      const matchesSearch =
        safeReferenceNumber.toLowerCase().includes(query) ||
        sectionName.includes(query) ||
        fullName1.includes(query) ||
        fullName2.includes(query) ||
        safeFirstName.toLowerCase().includes(query) ||
        safeLastName.toLowerCase().includes(query) ||
        safeMiddleName.toLowerCase().includes(query);

      const matchesSection =
        selectedSections.length === 0 || selectedSections.includes(sectionId);

      const status = onlineStudentIds.has(student.id) ? "online" : "offline";
      const matchesStatus = !selectedStatus || status === selectedStatus;

      return matchesSearch && matchesSection && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      const column = sortConfig.key;
      let comparison = 0;

      if (column === "sectionName") {
        // sort by section name
        const sectionA = getSectionName(a.sectionId, sections);
        const sectionB = getSectionName(b.sectionId, sections);
        comparison = sectionA.localeCompare(sectionB);
      } else if (column === "statusComputed") {
        // sort by online status
        const statusA = onlineStudentIds.has(a.id) ? "online" : "offline";
        const statusB = onlineStudentIds.has(b.id) ? "online" : "offline";
        comparison = statusA.localeCompare(statusB);
      } else {
        const valueA = a[column as keyof Student];
        const valueB = b[column as keyof Student];

        if (valueA instanceof Date && valueB instanceof Date) {
          comparison = valueA.getTime() - valueB.getTime();
        } else if (typeof valueA === "string" && typeof valueB === "string") {
          comparison = valueA.localeCompare(valueB);
        } else if (typeof valueA === "number" && typeof valueB === "number") {
          comparison = valueA - valueB;
        } else if (valueA && valueB) {
          comparison = valueA.toString().localeCompare(valueB.toString());
        }
      }

      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });

    return sorted;
  }, [
    students,
    sections,
    onlineStudentIds,
    searchQuery,
    selectedSections,
    selectedStatus,
    sortConfig,
  ]);

  const handleSort = (
    column: keyof Student | "sectionName" | "statusComputed",
  ) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: column, direction });
  };

  const handleSearchStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleItemOnclick = (studentId: string) => {
    onStudentClick(studentId);
  };

  // clear filters
  const handleClearAllFilters = () => {
    setSelectedSections([]);
    setSelectedStatus(null);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedSections.length > 0 ||
    selectedStatus !== null ||
    searchQuery !== "";

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
      <section className="w-full border-b-gray-200 dark:border-b-gray-700 p-4 border-b flex justify-between transition-colors duration-200 h-20 items-center">
        {/* search and filters */}
        <section className="flex gap-2 items-center w-full md:w-fit">
          <div className="flex rounded-sm border-gray-200 dark:border-gray-600 border h-fit items-center pr-2 w-full bg-white dark:bg-gray-800 transition-colors duration-200">
            <div className="p-2">
              <CiSearch className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              placeholder="Search student"
              className="text-xs focus:outline-none flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={handleSearchStudent}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1"
              >
                ×
              </button>
            )}
          </div>

          {/* filter dropdown */}
          <div className="relative">
            <button
              className={`p-2 rounded-xs border h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200 ${hasActiveFilters
                  ? "bg-[var(--primary-green)] text-white border-[var(--primary-green)]"
                  : "border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800"
                }`}
              onClick={() => setShowFilterDropdown((prev) => !prev)}
            >
              <CiFilter className="w-4 h-4" />
            </button>

            {showFilterDropdown && (
              <div
                className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm shadow-lg z-30 w-64 p-4 transition-colors duration-200"
                ref={filterDropdownRef}
              >
                {hasActiveFilters && (
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={handleClearAllFilters}
                      className="text-xs text-[var(--primary-green)] dark:text-green-400 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* sections checkbox */}
                <div className="mb-4">
                  <p className="font-semibold mb-2 text-sm text-gray-700 dark:text-gray-300">
                    Sections
                  </p>
                  <div className="flex flex-col max-h-32 overflow-y-auto gap-1">
                    {sections.map((section) => {
                      const isSelected = selectedSections.includes(section.id);

                      return (
                        <div
                          key={section.id}
                          className={`cursor-pointer px-2 py-1 rounded text-sm border w-fit transition-colors duration-200 ${isSelected
                              ? "bg-[var(--primary-green)] text-white border-[var(--primary-green)]"
                              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
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

                {/* status */}
                <div className="mb-2">
                  <p className="font-semibold mb-2 text-sm text-gray-700 dark:text-gray-300">
                    Status
                  </p>
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
                          className={`cursor-pointer px-2 py-1 rounded border text-sm text-center transition-colors duration-200 ${isSelected
                              ? "bg-[var(--primary-green)] text-white border-[var(--primary-green)]"
                              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
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

                {/* results */}
                <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                  Showing {filteredAndSortedStudents.length} of{" "}
                  {students.length} students
                </div>
              </div>
            )}
          </div>
        </section>

        {/* registration codes button: only for teachers */}
        <div className="hidden md:flex gap-2 items-center">
          {showRegistrationCodes && (
            <button
              className="p-2 rounded-xs border-gray-200 dark:border-gray-600 border text-gray-400 dark:text-gray-500 h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200 bg-white dark:bg-gray-800"
              type="button"
              onClick={() => navigate(registrationCodesPath)}
            >
              <IoQrCodeOutline />
            </button>
          )}
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

      {/* results info */}
      {hasActiveFilters && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredAndSortedStudents.length} student
            {filteredAndSortedStudents.length !== 1 ? "s" : ""} found
            {searchQuery && ` for "${searchQuery}"`}
            {(selectedSections.length > 0 || selectedStatus !== null) &&
              " with filters applied"}
          </div>
        </div>
      )}

      {students.length > 0 ? (
        <div className="flex flex-col flex-1 overflow-x-auto">
          <div className="flex flex-col w-full min-w-[1000px] flex-1">
            {/* headers */}
            <table className="font-primary table-auto w-full">
              <thead className="text-gray-400 dark:text-gray-500 text-sm xl:text-base transition-colors duration-200">
                <tr className="text-left">
                  <th className="w-[15%]">LRN</th>
                  <th
                    className="cursor-pointer w-[20%]"
                    onClick={() => handleSort("lastName")}
                  >
                    <div
                      className={`flex items-center justify-start gap-2 transition-colors duration-200 ${sortConfig.key === "lastName"
                          ? "text-[var(--primary-black)] dark:text-gray-200"
                          : ""
                        }`}
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
                    onClick={() => handleSort("sectionName")}
                  >
                    <div
                      className={`flex items-center gap-2 transition-colors duration-200 ${sortConfig.key === "sectionName"
                          ? "text-[var(--primary-black)] dark:text-gray-200"
                          : ""
                        }`}
                    >
                      Section
                      {sortConfig.key === "sectionName" ? (
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
                    onClick={() => handleSort("statusComputed")}
                  >
                    <div
                      className={`flex items-center gap-2 transition-colors duration-200 ${sortConfig.key === "statusComputed"
                          ? "text-[var(--primary-black)] dark:text-gray-200"
                          : ""
                        }`}
                    >
                      Status
                      {sortConfig.key === "statusComputed" ? (
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
                      className={`flex items-center gap-2 transition-colors duration-200 ${sortConfig.key === "createdAt"
                          ? "text-[var(--primary-black)] dark:text-gray-200"
                          : ""
                        }`}
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
                      className={`flex items-center gap-2 justify-center transition-colors duration-200 ${sortConfig.key === "lastOnline"
                          ? "text-[var(--primary-black)] dark:text-gray-200"
                          : ""
                        }`}
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
                </tr>
              </thead>
            </table>

            {/* student items/list */}
            <div className="flex-1 overflow-y-auto">
              <table className="font-primary table-auto w-full text-sm xl:text-base">
                <tbody>
                  {filteredAndSortedStudents.length > 0 ? (
                    filteredAndSortedStudents.map((student) => (
                      <StudentTableItem
                        student={student}
                        key={student.referenceNumber}
                        onClick={handleItemOnclick}
                        sections={sections}
                        onlineStudentIds={onlineStudentIds}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-400 dark:text-gray-500"
                      >
                        <div className="text-center">
                          <p className="text-gray-400 dark:text-gray-500 mb-2">
                            No students match your search criteria
                          </p>
                          {hasActiveFilters && (
                            <button
                              onClick={handleClearAllFilters}
                              className="text-sm text-[var(--primary-green)] dark:text-green-400 hover:underline"
                            >
                              Clear filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 w-full items-center justify-center">
          <p className="text-gray-300 dark:text-gray-600 italic">
            No data available
          </p>
        </div>
      )}

      {/* floating action button for mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          className="flex items-center justify-center w-14 h-14 bg-[var(--primary-green)] rounded-full text-white shadow-lg hover:bg-[var(--primary-green)] hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          onClick={onClickAddStudent}
        >
          <GoPlus className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
