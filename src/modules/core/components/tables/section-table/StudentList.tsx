import { type ReactElement, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Student } from "../../../../student/types/student.type";
import StudentItem from "./StudentItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type StudentListProps = {
  students: Student[];
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onStudentClick: (student: Student) => void;
  isLoading?: boolean;
};

export default function StudentList({
  students,
  searchTerm,
  onClearSearch,
  onStudentClick,
  isLoading = false,
}: StudentListProps): ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return students;
    }

    const term = searchTerm.toLowerCase().trim();
    return students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term),
    );
  }, [students, searchTerm]);

  // Student pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastItem = currentPage * studentsPerPage;
  const indexOfFirstItem = indexOfLastItem - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading student data...
          </p>
        </div>
      </div>
    );
  }

  if (filteredStudents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
            <CiSearch className="w-6 h-6 text-muted-foreground" />
          </div>
          <h4 className="text-base font-semibold">
            {searchTerm ? "No students found" : "No students enrolled"}
          </h4>
          <p className="text-sm text-muted-foreground max-w-sm">
            {searchTerm
              ? `No students match "${searchTerm}". Try a different search term.`
              : "No students are currently assigned to this section."}
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSearch}
              className="mt-2"
            >
              Clear search
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-fit max-h-[1000px] pb-4">
        <div className="space-y-2">
          {currentStudents.map((student, index) => (
            <StudentItem
              key={student.id}
              student={student}
              index={indexOfFirstItem + index}
              onStudentClick={onStudentClick}
            />
          ))}
        </div>
      </ScrollArea>

      {/* student pagination */}
      {filteredStudents.length > studentsPerPage && (
        <div className="border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-8">
            <div className="text-sm text-muted-foreground text-nowrap">
              Showing{" "}
              <span className="font-medium">
                {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredStudents.length)}
              </span>{" "}
              of <span className="font-medium">{filteredStudents.length}</span>{" "}
              students
            </div>

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

              <div className="sm:hidden text-center text-sm text-muted-foreground mt-2">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
