import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { useAdminContext } from "../../context/admin.context";
import { Teacher } from "../../../teacher/types/teacher.type";
import TeacherTableItem from "./TeacherTableItem";
import "../../../core/styles/customTable.css";

type TeacherTableProps = {
  onTeacherClick: (teacherId: string) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onAddTeacher: () => void;
};

export default function TeacherTable({
  onTeacherClick,
  onAddTeacher,
}: TeacherTableProps): ReactElement {
  const { teachers } = useAdminContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVerification, setSelectedVerification] = useState<
    "verified" | "unverified" | null
  >(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Teacher | "fullName" | "verificationStatus";
    direction: "ascending" | "descending";
  }>({ key: "lastName", direction: "ascending" });

  const filteredAndSortedTeachers = useMemo(() => {
    const filtered = teachers.filter((teacher) => {
      const {
        firstName = "",
        lastName = "",
        middleName = "",
        email = "",
      } = teacher;

      const query = searchQuery.toLowerCase();

      const safeFirstName = firstName || "";
      const safeLastName = lastName || "";
      const safeMiddleName = middleName || "";
      const safeEmail = email || "";

      const fullName1 =
        `${safeLastName} ${safeFirstName} ${safeMiddleName}`.toLowerCase();
      const fullName2 = `${safeFirstName} ${safeLastName}`.toLowerCase();

      const matchesSearch =
        safeEmail.toLowerCase().includes(query) ||
        fullName1.includes(query) ||
        fullName2.includes(query) ||
        safeFirstName.toLowerCase().includes(query) ||
        safeLastName.toLowerCase().includes(query) ||
        safeMiddleName.toLowerCase().includes(query);

      const verificationStatus = teacher.verified.verified
        ? "verified"
        : "unverified";
      const matchesVerification =
        !selectedVerification || verificationStatus === selectedVerification;

      return matchesSearch && matchesVerification;
    });

    const sorted = [...filtered].sort((a, b) => {
      const column = sortConfig.key;
      let comparison = 0;

      if (column === "fullName") {
        const nameA =
          `${a.lastName} ${a.firstName} ${a.middleName || ""}`.toLowerCase();
        const nameB =
          `${b.lastName} ${b.firstName} ${b.middleName || ""}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
      } else if (column === "verificationStatus") {
        const statusA = a.verified.verified ? "verified" : "unverified";
        const statusB = b.verified.verified ? "verified" : "unverified";
        comparison = statusA.localeCompare(statusB);
      } else {
        const valueA = a[column as keyof Teacher];
        const valueB = b[column as keyof Teacher];

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
  }, [teachers, searchQuery, selectedVerification, sortConfig]);

  const handleSort = (
    column: keyof Teacher | "fullName" | "verificationStatus",
  ) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: column, direction });
  };

  const handleSearchTeacher = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleItemOnclick = (teacherId: string) => {
    onTeacherClick(teacherId);
  };

  const handleClearAllFilters = () => {
    setSelectedVerification(null);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedVerification !== null || searchQuery !== "";

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
              placeholder="Search teacher"
              className="text-xs focus:outline-none flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={handleSearchTeacher}
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

                {/* verification status */}
                <div className="mb-2">
                  <p className="font-semibold mb-2 text-sm text-gray-700 dark:text-gray-300">
                    Verification Status
                  </p>
                  <div className="flex gap-1 text-sm">
                    {["all", "verified", "unverified"].map((status) => {
                      const isSelected =
                        (status === "all" && selectedVerification === null) ||
                        (status === "verified" &&
                          selectedVerification === "verified") ||
                        (status === "unverified" &&
                          selectedVerification === "unverified");

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
                              setSelectedVerification(null);
                            } else {
                              setSelectedVerification(
                                status as "verified" | "unverified",
                              );
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
                  Showing {filteredAndSortedTeachers.length} of{" "}
                  {teachers.length} teachers
                </div>
              </div>
            )}
          </div>
        </section>

        {/* add teacher button */}
        <div className="hidden md:flex gap-2 items-center">
          <button
            className="flex gap-2 items-center justify-center py-3 px-4 bg-[var(--primary-green)]/90 rounded-sm text-white hover:cursor-pointer hover:bg-[var(--primary-green)] transition-all duration-200"
            onClick={onAddTeacher}
          >
            <GoPlus className="w-4 h-4" />
            <p className="text-sm font-semibold">Add Teacher</p>
          </button>
        </div>
      </section>

      {/* results info */}
      {hasActiveFilters && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredAndSortedTeachers.length} teacher
            {filteredAndSortedTeachers.length !== 1 ? "s" : ""} found
            {searchQuery && ` for "${searchQuery}"`}
            {selectedVerification !== null && " with filters applied"}
          </div>
        </div>
      )}

      {teachers.length > 0 ? (
        <div className="flex flex-col flex-1 overflow-x-auto">
          <div className="flex flex-col w-full min-w-[800px] flex-1">
            {/* headers */}
            <table className="font-primary table-auto w-full">
              <thead className="text-gray-400 dark:text-gray-500 text-sm xl:text-base transition-colors duration-200">
                <tr className="text-left">
                  <th className="w-[30%]">Email</th>
                  <th
                    className="cursor-pointer w-[30%]"
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
                    className="cursor-pointer w-[20%]"
                    onClick={() => handleSort("gender")}
                  >
                    <div
                      className={`flex items-center gap-2 transition-colors duration-200 ${sortConfig.key === "gender"
                          ? "text-[var(--primary-black)] dark:text-gray-200"
                          : ""
                        }`}
                    >
                      Gender
                      {sortConfig.key === "gender" ? (
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
                    className="cursor-pointer w-[20%]"
                    onClick={() => handleSort("verificationStatus")}
                  >
                    <div
                      className={`flex items-center gap-2 transition-colors duration-200 ${sortConfig.key === "verificationStatus"
                          ? "text-[var(--primary-black)] dark:text-gray-200"
                          : ""
                        }`}
                    >
                      Status
                      {sortConfig.key === "verificationStatus" ? (
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

            {/* teacher items/list */}
            <div className="flex-1 overflow-y-auto">
              <table className="font-primary table-auto w-full text-sm xl:text-base">
                <tbody>
                  {filteredAndSortedTeachers.length > 0 ? (
                    filteredAndSortedTeachers.map((teacher) => (
                      <TeacherTableItem
                        teacher={teacher}
                        key={teacher.id}
                        onClick={handleItemOnclick}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-gray-400 dark:text-gray-500"
                      >
                        <div className="text-center">
                          <p className="text-gray-400 dark:text-gray-500 mb-2">
                            No teachers match your search criteria
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
            No teachers available
          </p>
        </div>
      )}
    </section>
  );
}
