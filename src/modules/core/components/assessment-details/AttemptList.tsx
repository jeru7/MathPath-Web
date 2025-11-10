import { useMemo, useState, type ReactElement } from "react";
import { FaUserGraduate, FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import AttemptItem from "./AttemptItem";
import { format } from "date-fns-tz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Student,
  StudentAssessment,
} from "@/modules/student/types/student.type";
import { Assessment } from "../../types/assessment/assessment.type";
import { AssessmentAttempt } from "../../types/assessment-attempt/assessment-attempt.type";
import { useAdminAssessmentAttempts } from "@/modules/admin/services/admin-assessment-attempt.service";
import { useTeacherAssessmentAttempts } from "@/modules/teacher/services/teacher-assessment-attempt.service";

type AttemptWithStudent = AssessmentAttempt & {
  student: Student;
};

type FilterOptions = {
  status: "all" | "passed" | "failed";
  sortBy: "newest" | "oldest" | "highest" | "lowest";
};

type AttemptListProps = {
  userType: "admin" | "teacher";
  userId: string;
  students: Student[];
  assessment: Assessment;
  onReview: (attempt: AttemptWithStudent) => void;
};

export default function AttemptList({
  userType,
  userId,
  students,
  assessment,
  onReview,
}: AttemptListProps): ReactElement {
  const useAssessmentAttempt =
    userType === "teacher"
      ? useTeacherAssessmentAttempts
      : useAdminAssessmentAttempts;
  const { data: assessmentAttempts, isLoading } = useAssessmentAttempt(
    userId,
    assessment.id,
  );

  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    sortBy: "newest",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const safeStudentAttempts = useMemo(() => {
    if (!assessmentAttempts) return [];
    if (Array.isArray(assessmentAttempts)) return assessmentAttempts;
    return [];
  }, [assessmentAttempts]);

  const safeSectionStudents = useMemo(() => {
    if (!students) return [];
    if (Array.isArray(students)) return students;
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

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FaUserGraduate className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Student Attempts</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <div className="animate-pulse bg-muted h-4 w-48 rounded"></div>
                ) : (
                  `${assignedStudents.length} ${assignedStudents.length > 1 ? "students" : "student"} • ${filteredAttempts.length} total attempts`
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-8 h-9"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                >
                  ×
                </Button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={`h-9 px-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-inherit hover:bg-accent hover:text-accent-foreground ${hasActiveFilters ? "bg-primary text-primary-foreground" : ""
                  }`}
              >
                <div className="flex items-center gap-2">
                  <CiFilter className="h-4 w-4" />
                  Filter
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <CiFilter className="h-4 w-4" />
                  Filter Attempts
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* status filter */}
                <div className="p-3">
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Attempts" },
                      { value: "passed", label: "Passed" },
                      { value: "failed", label: "Failed" },
                    ].map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={filters.status === option.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleFilterChange("status", option.value);
                          }
                        }}
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </div>

                <DropdownMenuSeparator />

                <div className="p-3">
                  <label className="text-sm font-medium mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Score</option>
                    <option value="lowest">Lowest Score</option>
                  </select>
                </div>

                <DropdownMenuSeparator />
                <div className="p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {filteredAttempts.length} of {attemptsWithStudents.length}{" "}
                      attempts
                    </span>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-auto p-1 text-primary hover:bg-transparent text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/20 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <CiFilter className="h-4 w-4" />
              <span className="text-sm">
                <Badge variant="secondary" className="mr-2">
                  {filteredAttempts.length}
                </Badge>
                attempt{filteredAttempts.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {filters.status !== "all" && ` with status: ${filters.status}`}
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                Loading student attempts...
              </p>
            </div>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                <FaSearch className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="text-base font-semibold">
                {searchTerm || hasActiveFilters
                  ? "No attempts match your search criteria"
                  : "No Attempt Data"}
              </h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchTerm || hasActiveFilters
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "No students have attempted this assessment yet."}
              </p>
              {(searchTerm || hasActiveFilters) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Clear search and filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="h-fit max-h-[1000px]">
              <div className="space-y-3">
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
            </ScrollArea>

            {/* pagination */}
            {totalPages > 1 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground text-nowrap">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredAttempts.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredAttempts.length}
                    </span>{" "}
                    attempts
                  </div>

                  <div className="w-full sm:w-auto">
                    <Pagination>
                      <PaginationContent className="w-full sm:w-auto justify-between sm:justify-normal">
                        <PaginationItem className="sm:flex-1 sm:text-left">
                          <PaginationPrevious
                            size="sm"
                            onClick={() =>
                              setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          >
                            <IoChevronBack className="w-4 h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Prev</span>
                          </PaginationPrevious>
                        </PaginationItem>

                        <div className="hidden sm:flex items-center gap-1">
                          {getPageNumbers().map((pageNumber) => (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                size="sm"
                                onClick={() => setCurrentPage(pageNumber)}
                                isActive={currentPage === pageNumber}
                                className="cursor-pointer"
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                        </div>

                        <PaginationItem className="sm:flex-1 sm:text-right">
                          <PaginationNext
                            size="sm"
                            onClick={() =>
                              setCurrentPage((p) => Math.min(p + 1, totalPages))
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          >
                            <span className="hidden sm:inline">Next</span>
                            <IoChevronForward className="w-4 h-4 sm:ml-1" />
                          </PaginationNext>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>

                    <div className="sm:hidden text-center text-sm text-muted-foreground mt-2">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
