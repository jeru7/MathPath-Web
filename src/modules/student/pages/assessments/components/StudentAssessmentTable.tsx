import { type ReactElement, useState, useMemo } from "react";
import { CiSearch, CiFilter } from "react-icons/ci";
import { NavigateFunction } from "react-router-dom";
import StudentAssessmentTableItem from "./StudentAssessmentTableItem";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import { Student } from "../../../types/student.type";
import { getAssessmentStatus } from "../../../utils/assessments/assessment.util";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

type StudentAssessmentTableProps = {
  navigate: NavigateFunction;
  assessments: Assessment[];
  student: Student | null;
  onAssessmentClick: (assessment: Assessment) => void;
};

export default function StudentAssessmentTable({
  assessments,
  student,
  onAssessmentClick,
}: StudentAssessmentTableProps): ReactElement {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "available" | "expired"
  >("all");
  const [selectedDuration, setSelectedDuration] = useState<
    "all" | "<30" | "30-60" | ">60"
  >("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Get unique topics
  const topics = useMemo(() => {
    const uniqueTopics = Array.from(
      new Set(assessments.map((a) => a.topic || "No topic")),
    );
    return uniqueTopics;
  }, [assessments]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const matchesSearch =
        searchTerm === "" ||
        assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const assessmentStatus = getAssessmentStatus(assessment);
      const matchesStatus =
        selectedStatus === "all" || assessmentStatus === selectedStatus;

      const duration = assessment.timeLimit || 0;
      const matchesDuration =
        selectedDuration === "all" ||
        (selectedDuration === "<30" && duration < 30) ||
        (selectedDuration === "30-60" && duration >= 30 && duration <= 60) ||
        (selectedDuration === ">60" && duration > 60);

      const matchesTopic =
        selectedTopic === "all" || assessment.topic === selectedTopic;

      return matchesSearch && matchesStatus && matchesDuration && matchesTopic;
    });
  }, [
    assessments,
    searchTerm,
    selectedStatus,
    selectedDuration,
    selectedTopic,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssessments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const emptyRowCount = itemsPerPage - currentItems.length;
  const displayItems = [...currentItems];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedDuration("all");
    setSelectedTopic("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleAssessmentItemClick = (assessment: Assessment) => {
    onAssessmentClick(assessment);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const hasActiveFilters =
    selectedStatus !== "all" ||
    selectedDuration !== "all" ||
    selectedTopic !== "all" ||
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

  const EmptyState = () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
          <CiSearch className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">No assessments available</h3>
          <p className="text-muted-foreground mt-1">
            There are no assessments to display at the moment.
          </p>
        </div>
      </div>
    </div>
  );

  const NoResultsState = () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
          <CiFilter className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">No matches found</h3>
          <p className="text-muted-foreground mt-1">
            No assessments match your search criteria.
          </p>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="mt-4"
          >
            Clear all filters
          </Button>
        )}
      </div>
    </div>
  );

  // Mobile card
  const MobileAssessmentCard = ({ assessment }: { assessment: Assessment }) => {
    const totalQuestions = assessment.pages.reduce(
      (total, page) =>
        total + page.contents.filter((c) => c.type === "question").length,
      0,
    );
    const studentStatus = getAssessmentStatus(assessment);
    const getStatusVariant = (status: string) => {
      switch (status) {
        case "available":
          return "default";
        case "expired":
          return "destructive";
        default:
          return "secondary";
      }
    };
    const getStatusText = (status: string) => {
      switch (status) {
        case "available":
          return "Available";
        case "expired":
          return "Expired";
        case "not-available":
          return "Not Available";
        default:
          return "Not Available";
      }
    };

    return (
      <Card
        className="cursor-pointer transition-colors hover:bg-muted/50 mb-3 shadow-none"
        onClick={() => handleAssessmentItemClick(assessment)}
      >
        <CardContent className="p-4 shadow-none">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-base">
              {assessment.title || "Untitled Assessment"}
            </h3>
            <Badge variant={getStatusVariant(studentStatus)}>
              {getStatusText(studentStatus)}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Topic:</span>
              <span>{assessment.topic || "No topic"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Questions:</span>
              <span>{totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span>
                {assessment.timeLimit
                  ? `${assessment.timeLimit} mins`
                  : "No limit"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deadline:</span>
              <span className="text-right">
                {assessment.date.end
                  ? new Date(assessment.date.end).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyTableRow = ({ index }: { index: number }) => (
    <TableRow key={`empty-${index}`} className="h-17">
      <TableCell colSpan={7} className="text-center text-muted-foreground">
        &nbsp;
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="flex flex-col rounded-sm shadow-none h-full">
      {/* header */}
      <CardHeader className="pb-4 shadow-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 shadow-none">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assessment"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9 pr-8 h-9"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                >
                  ×
                </Button>
              )}
            </div>

            {/* filter button */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`h-9 px-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-inherit hover:bg-accent hover:text-accent-foreground ${hasActiveFilters ? "bg-primary text-primary-foreground" : ""}`}
              >
                <div className={`flex items-center gap-2`}>
                  <CiFilter className="h-4 w-4" />
                  Filter
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <CiFilter className="h-4 w-4" />
                  Filter Assessments
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-3 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={selectedStatus}
                      onValueChange={(value: "all" | "available" | "expired") =>
                        setSelectedStatus(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="not-available">
                          Not Available
                        </SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* topic */}
                  <div>
                    <label className="text-sm font-medium">Topic</label>
                    <Select
                      value={selectedTopic}
                      onValueChange={(value) => setSelectedTopic(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        <SelectItem value="all">All Topics</SelectItem>
                        {topics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <DropdownMenuSeparator className="my-3" />

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {filteredAssessments.length} of {assessments.length}{" "}
                      assessments
                    </span>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-auto p-2 text-primary hover:bg-transparent text-xs"
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
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/20 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <CiFilter className="h-4 w-4" />
              <span className="text-sm">
                <Badge variant="secondary" className="mr-2">
                  {filteredAssessments.length}
                </Badge>
                assessment{filteredAssessments.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedStatus !== "all" && ` with status: ${selectedStatus}`}
                {selectedDuration !== "all" &&
                  ` with duration: ${selectedDuration}`}
                {selectedTopic !== "all" && ` in topic: ${selectedTopic}`}
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 shadow-none">
        {assessments.length === 0 ? (
          <div className="flex-1 min-h-[750px]">
            <EmptyState />
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="flex-1 min-h-[750px]">
            <NoResultsState />
          </div>
        ) : (
          <div className="flex flex-col">
            {/* desktop table view */}
            <div className="hidden lg:block">
              <div className="min-h-[480px]">
                <Table>
                  <TableHeader className="bg-muted/50 h-16">
                    <TableRow>
                      <TableHead className="font-semibold min-w-[200px]">
                        Title
                      </TableHead>
                      <TableHead className="font-semibold min-w-[150px]">
                        Topic
                      </TableHead>
                      <TableHead className="text-center font-semibold whitespace-nowrap">
                        Deadline
                      </TableHead>
                      <TableHead className="text-center font-semibold whitespace-nowrap">
                        Duration
                      </TableHead>
                      <TableHead className="text-center font-semibold whitespace-nowrap">
                        Status
                      </TableHead>
                      <TableHead className="text-center font-semibold whitespace-nowrap">
                        Questions
                      </TableHead>
                      <TableHead className="text-center font-semibold whitespace-nowrap">
                        Attempts
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {displayItems.map((assessment, index) => (
                      <StudentAssessmentTableItem
                        key={assessment.id}
                        assessment={assessment}
                        student={student}
                        onAssessmentClick={handleAssessmentItemClick}
                        isLastItem={
                          index === displayItems.length - 1 &&
                          emptyRowCount === 0
                        }
                      />
                    ))}
                    {Array.from({ length: emptyRowCount }).map((_, index) => (
                      <EmptyTableRow key={`empty-row-${index}`} index={index} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* mobile card view */}
            <div className="block lg:hidden p-4 min-h-[480px]">
              {currentItems.map((assessment) => (
                <MobileAssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                />
              ))}
              {emptyRowCount > 0 && (
                <div
                  className="flex items-center justify-center text-muted-foreground py-8"
                  style={{ height: `${emptyRowCount * 60}px` }}
                />
              )}
            </div>

            {/* pagination */}
            {filteredAssessments.length > 0 && (
              <div className="border-t rounded-b-sm bg-background px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, filteredAssessments.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredAssessments.length}
                    </span>{" "}
                    assessments
                  </div>

                  {totalPages > 1 && (
                    <div className="w-full sm:w-auto">
                      <Pagination>
                        <PaginationContent className="w-full sm:w-auto justify-between sm:justify-normal">
                          <PaginationItem className="sm:flex-1 sm:text-left">
                            <PaginationPrevious
                              size="sm"
                              onClick={handlePrevPage}
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

                          {/* Hide page numbers on mobile, show on desktop */}
                          <div className="hidden sm:flex items-center gap-1">
                            {getPageNumbers().map((pageNumber) => (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                  size="sm"
                                  onClick={() => handlePageClick(pageNumber)}
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
                              onClick={handleNextPage}
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

                      {/* Mobile page indicator - show current page and total */}
                      <div className="sm:hidden text-center text-sm text-muted-foreground mt-2">
                        Page {currentPage} of {totalPages}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
