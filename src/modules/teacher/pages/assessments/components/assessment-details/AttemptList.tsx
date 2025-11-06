import { useMemo, useState, type ReactElement } from "react";
import { FaUserGraduate, FaSearch, FaFilter } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import AttemptItem from "./AttemptItem";
import { AssessmentAttempt } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import {
  Student,
  StudentAssessment,
} from "../../../../../student/types/student.type";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { format } from "date-fns-tz";
import { useTeacherContext } from "../../../../context/teacher.context";
import { useTeacherAssessmentAttempts } from "../../../../services/teacher-assessment-attempt.service";

type AttemptListProps = {
  students?: Student[];
  assessment: Assessment;
  onReview: (attempt: AttemptWithStudent) => void;
};

type AttemptWithStudent = AssessmentAttempt & {
  student: Student;
};

type FilterOptions = {
  status: "all" | "passed" | "failed";
  sortBy: "newest" | "oldest" | "highest" | "lowest";
};

export default function AttemptList({
  students,
  assessment,
  onReview,
}: AttemptListProps): ReactElement {
  const { teacherId } = useTeacherContext();
  const { data: attempts, isLoading } = useTeacherAssessmentAttempts(
    teacherId,
    assessment.id,
  );
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    sortBy: "newest",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 5 lang per page

  const safeStudentAttempts = useMemo(() => {
    if (!attempts) return [];
    if (Array.isArray(attempts)) return attempts;
    return [];
  }, [attempts]);

  const safeSectionStudents = useMemo(() => {
    if (!students) return [];
    if (Array.isArray(students)) return students;
    console.warn("students is not an array:", students);
    return [];
  }, [students]);

  const assignedStudents = useMemo(() => {
    return safeSectionStudents.filter((student) =>
      student.assessments?.some(
        (studentAssessment: StudentAssessment) =>
          studentAssessment.assessmentId === assessment.id,
      ),
    );
  }, [safeSectionStudents, assessment.id]);

  const attemptsWithStudents = useMemo((): AttemptWithStudent[] => {
    if (isLoading) return [];
    return safeStudentAttempts
      .map((attempt) => {
        const student = safeSectionStudents.find(
          (s) => s.id === attempt.studentId,
        );
        return student ? { ...attempt, student } : null;
      })
      .filter(Boolean) as AttemptWithStudent[];
  }, [safeStudentAttempts, safeSectionStudents, isLoading]);

  const filteredAttempts = useMemo(() => {
    if (isLoading) return [];

    const filtered = attemptsWithStudents.filter((attempt) => {
      const matchesSearch =
        searchTerm === "" ||
        attempt.student?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        attempt.student?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        attempt.student?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filters.status !== "all") {
        const isPassed = attempt.score >= (assessment.passingScore || 0);
        if (filters.status === "passed" && !isPassed) return false;
        if (filters.status === "failed" && isPassed) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.dateUpdated).getTime() -
            new Date(a.dateUpdated).getTime()
          );
        case "oldest":
          return (
            new Date(a.dateUpdated).getTime() -
            new Date(b.dateUpdated).getTime()
          );
        case "highest":
          return (b.score || 0) - (a.score || 0);
        case "lowest":
          return (a.score || 0) - (b.score || 0);
        default:
          return (
            new Date(b.dateUpdated).getTime() -
            new Date(a.dateUpdated).getTime()
          );
      }
    });

    return filtered;
  }, [
    attemptsWithStudents,
    searchTerm,
    filters,
    assessment.passingScore,
    isLoading,
  ]);

  const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage);
  const paginatedAttempts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAttempts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAttempts, currentPage, itemsPerPage]);

  const toggleAttempt = (attemptId: string) => {
    setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a", {
        timeZone: "Asia/Manila",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds || seconds === 0) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    } else if (remainingSeconds === 0) {
      return `${minutes}m`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  const formatTimeSpent = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      sortBy: "newest",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.sortBy !== "newest" ||
    searchTerm !== "";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-5 border-b border-gray-200 rounded-t-sm dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
              <FaUserGraduate className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Student Attempts
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-48 rounded"></div>
                ) : (
                  `${assignedStudents.length} ${assignedStudents.length > 1 ? "students" : "student"} • ${filteredAttempts.length} total attempts`
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* search input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="relative">
            {/* filter */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors border ${showFilters || hasActiveFilters
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
            >
              <FaFilter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">
                  !
                </span>
              )}
            </button>

            {/* filters panel */}
            {showFilters && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Filter Attempts
                    </h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* status filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: "all", label: "All" },
                          { value: "passed", label: "Passed" },
                          { value: "failed", label: "Failed" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleFilterChange("status", option.value)
                            }
                            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${filters.status === option.value
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* sort by filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          handleFilterChange("sortBy", e.target.value)
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Score</option>
                        <option value="lowest">Lowest Score</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 min-h-96 max-h-[800px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loading student attempts...
              </p>
            </div>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="flex flex-1 items-center justify-center h-full">
            <div className="text-center">
              <h4 className="text-sm text-gray-900 dark:text-gray-500 mb-2">
                {searchTerm || hasActiveFilters
                  ? "No attempts match your search criteria"
                  : "No Attempt Data"}
              </h4>
              {(searchTerm || hasActiveFilters) && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Clear search and filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {paginatedAttempts.map((attempt) => (
                <AttemptItem
                  key={`${attempt.id}`}
                  attempt={attempt}
                  passingScore={assessment.passingScore || 0}
                  formatDuration={formatDuration}
                  formatTimeSpent={formatTimeSpent}
                  formatDate={formatDate}
                  isExpanded={expandedAttempt === attempt.id}
                  onToggle={() => toggleAttempt(attempt.id || "")}
                  onReview={() => onReview(attempt)}
                />
              ))}
            </div>

            {/* pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                {/* page info */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span> •{" "}
                  <span className="font-medium">{filteredAttempts.length}</span>{" "}
                  total
                </div>

                {/* pagination buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <IoChevronBack className="w-4 h-4" />
                  </button>

                  {/* page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                            }`}
                        >
                          {pageNum}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <IoChevronForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
