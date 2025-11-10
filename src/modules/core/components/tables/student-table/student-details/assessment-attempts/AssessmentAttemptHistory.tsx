import { useMemo, type ReactElement, useState } from "react";
import { FaFileAlt, FaSearch } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import AssessmentAttemptItem from "./AssessmentAttemptItem";
import { AttemptWithAssessment } from "../StudentDetailsModal";
import { Student } from "../../../../../../student/types/student.type";
import { useStudentAssessments } from "../../../../../../student/services/student-assessment.service";
import { useAssessmentsAttempts } from "../../../../../../student/services/student-assessment-attempt.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CiFilter } from "react-icons/ci";

type AssessmentAttemptHistoryProps = {
  student: Student;
};

const ITEMS_PER_PAGE = 5;

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "paused":
      return "Paused";
    case "abandoned":
      return "Abandoned";
    case "failed":
      return "Failed";
    default:
      return "Unknown";
  }
};

export default function AssessmentAttemptHistory({
  student,
}: AssessmentAttemptHistoryProps): ReactElement {
  const { data: assessments = [], isLoading: isLoadingAssessments } =
    useStudentAssessments(student?.id || "");
  const { data: attempts = [], isLoading: isLoadingAttempts } =
    useAssessmentsAttempts(student?.id || "");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const allAttempts = useMemo((): AttemptWithAssessment[] => {
    return attempts.map((attempt) => {
      const assessment = assessments.find((a) => a.id === attempt.assessmentId);
      return {
        ...attempt,
        assessmentTitle: assessment?.title || "Untitled Assessment",
        assessmentPassingScore: assessment?.passingScore || 0,
        assessmentData: assessment || null,
      };
    });
  }, [attempts, assessments]);

  const sortedAttempts = useMemo(() => {
    return [...allAttempts].sort((a, b) => {
      const dateA = new Date(a.dateCompleted || a.dateUpdated);
      const dateB = new Date(b.dateCompleted || b.dateUpdated);
      return dateB.getTime() - dateA.getTime();
    });
  }, [allAttempts]);

  const filteredAttempts = useMemo(() => {
    return sortedAttempts.filter((attempt) => {
      const matchesSearch =
        searchTerm === "" ||
        attempt.assessmentTitle
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        attempt.score?.toString().includes(searchTerm);

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(attempt.status);

      return matchesSearch && matchesStatus;
    });
  }, [sortedAttempts, searchTerm, selectedStatuses]);

  const totalPages = Math.ceil(filteredAttempts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAttempts = filteredAttempts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatuses([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== "" || selectedStatuses.length > 0;
  const statusOptions = ["completed", "paused", "abandoned", "failed"];

  const isLoading = isLoadingAssessments || isLoadingAttempts;

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
              <FaFileAlt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Assessment Attempts</CardTitle>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
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
                  Filter by Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-3 space-y-2">
                  {statusOptions.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStatuses([...selectedStatuses, status]);
                        } else {
                          setSelectedStatuses(
                            selectedStatuses.filter((s) => s !== status),
                          );
                        }
                        setCurrentPage(1);
                      }}
                    >
                      {getStatusLabel(status)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <div className="p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {filteredAttempts.length} of {sortedAttempts.length}{" "}
                      attempts
                    </span>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
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
              <span className="text-sm">
                <Badge variant="secondary" className="mr-2">
                  {filteredAttempts.length}
                </Badge>
                attempt{filteredAttempts.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedStatuses.length > 0 &&
                  ` with status: ${selectedStatuses.map(getStatusLabel).join(", ")}`}
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
              <p className="text-muted-foreground">Loading assessments...</p>
            </div>
          </div>
        ) : sortedAttempts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                <FaFileAlt className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="text-base font-semibold">
                No assessment attempts found
              </h4>
              <p className="text-sm text-muted-foreground">
                This student hasn't attempted any assessments yet.
              </p>
            </div>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                <FaSearch className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="text-base font-semibold">No attempts found</h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                No attempts match your search criteria.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedAttempts.map((attempt) => (
                <AssessmentAttemptItem
                  key={attempt.id}
                  attempt={attempt}
                  student={student}
                />
              ))}
            </div>

            {filteredAttempts.length > ITEMS_PER_PAGE && (
              <div className="border-t pt-4 mt-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                      {startIndex + 1}-
                      {Math.min(
                        startIndex + ITEMS_PER_PAGE,
                        filteredAttempts.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredAttempts.length}
                    </span>{" "}
                    attempts
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          size="sm"
                          onClick={handlePrevious}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        >
                          <IoChevronBack className="w-4 h-4 mr-1" />
                          Prev
                        </PaginationPrevious>
                      </PaginationItem>

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

                      <PaginationItem>
                        <PaginationNext
                          size="sm"
                          onClick={handleNext}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        >
                          Next
                          <IoChevronForward className="w-4 h-4 ml-1" />
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
