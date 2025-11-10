import { useState, useMemo, type ReactElement } from "react";
import { FaGamepad, FaSearch } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import AttemptHistoryItem from "./AttemptHistoryItem";
import { Student } from "../../../../../../student/types/student.type";
import { useStudentAttempts } from "../../../../../../student/services/student.service";
import { StageAttempt } from "../../../../../types/stage-attempt/stage-attempt.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useStages } from "../../../../../services/stage/stage.service";
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

type AttemptHistoryProps = {
  student: Student;
};

const getResultLabel = (attempt: StageAttempt) => {
  if (attempt.completed) return "completed";
  if (attempt.fled) return "fled";
  if (attempt.died) return "died";
  return "incomplete";
};

export default function AttemptHistory({
  student,
}: AttemptHistoryProps): ReactElement {
  const { data: studentAttempts, isLoading } = useStudentAttempts(student.id);
  const { data: stages } = useStages();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const attempts = useMemo(() => {
    const rawAttempts = studentAttempts ?? [];
    const sorted = [...rawAttempts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const stats = { completed: 0, fled: 0, died: 0 };
    sorted.forEach((a) => {
      if (a.completed) stats.completed++;
      else if (a.fled) stats.fled++;
      else if (a.died) stats.died++;
    });
    console.log("Attempt stats:", stats);

    return sorted;
  }, [studentAttempts]);

  const filteredAttempts = useMemo(() => {
    return attempts.filter((attempt) => {
      const stage = stages?.find((s) => s.id === attempt.stageId);
      const stageNumber = stage?.stage?.toString() || "";
      const result = getResultLabel(attempt).toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        stageNumber.includes(searchTerm) ||
        stage?.topic?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesResult =
        selectedResults.length === 0 || selectedResults.includes(result);
      return matchesSearch && matchesResult;
    });
  }, [attempts, stages, searchTerm, selectedResults]);

  const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage);
  const paginatedAttempts = filteredAttempts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedResults([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== "" || selectedResults.length > 0;

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaGamepad className="w-5 h-5" />
            Stage Attempts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading stage attempts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FaGamepad className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Stage Attempts</CardTitle>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stages or topics..."
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
                  Filter by Result
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-3 space-y-2">
                  {["completed", "fled", "died"].map((result) => (
                    <DropdownMenuCheckboxItem
                      key={result}
                      checked={selectedResults.includes(result)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedResults([...selectedResults, result]);
                        } else {
                          setSelectedResults(
                            selectedResults.filter((r) => r !== result),
                          );
                        }
                        setCurrentPage(1);
                      }}
                    >
                      {result.charAt(0).toUpperCase() + result.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <div className="p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {filteredAttempts.length} of {attempts.length} attempts
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
              <CiFilter className="h-4 w-4" />
              <span className="text-sm">
                <Badge variant="secondary" className="mr-2">
                  {filteredAttempts.length}
                </Badge>
                attempt{filteredAttempts.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedResults.length > 0 &&
                  ` with result: ${selectedResults.join(", ")}`}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-2 md:p-4">
        {attempts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                <FaGamepad className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="text-base font-semibold">
                No stage attempts found
              </h4>
              <p className="text-sm text-muted-foreground">
                This student hasn't attempted any stages yet.
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
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-medium w-24 text-center">
                      Stage
                    </TableHead>
                    <TableHead className="font-medium w-48">Topic</TableHead>
                    <TableHead className="font-medium w-48">Date</TableHead>
                    <TableHead className="font-medium w-24 text-center">
                      Score
                    </TableHead>
                    <TableHead className="font-medium w-24 text-center">
                      Time
                    </TableHead>
                    <TableHead className="font-medium w-24 text-center">
                      Result
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAttempts.map((attempt: StageAttempt) => (
                    <AttemptHistoryItem attempt={attempt} key={attempt.id} />
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="border-t p-4">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
