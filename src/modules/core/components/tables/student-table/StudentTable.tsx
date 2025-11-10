import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "../../../../student/types/student.type";
import { Section } from "../../../types/section/section.type";
import { getSectionName } from "../../../../teacher/pages/students/utils/student-table.util";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
} from "@/components/ui/table";
import { CiSearch, CiFilter } from "react-icons/ci";
import { GoArchive, GoPlus } from "react-icons/go";
import {
  IoQrCodeOutline,
  IoChevronUp,
  IoChevronDown,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import StudentTableItem from "./StudentTableItem";
import { cn } from "@/lib/utils";

export type StudentTableContext = {
  rawStudents: Student[];
  rawSections: Section[];
  onlineStudents: Student[];
};

type StudentTableProps = {
  onClickAddStudent: () => void;
  onStudentClick: (studentId: string) => void;
  context: StudentTableContext;
  showRegistrationCodes?: boolean;
  showArchive?: boolean;
  hideFab?: boolean;
};

export default function StudentTable({
  onClickAddStudent,
  onStudentClick,
  context,
  showRegistrationCodes = false,
  showArchive = false,
  hideFab = false,
}: StudentTableProps): ReactElement {
  const { rawStudents, rawSections, onlineStudents } = context;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student | "sectionName" | "statusComputed";
    direction: "asc" | "desc";
  }>({ key: "statusComputed", direction: "desc" });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showMobileFab, setShowMobileFab] = useState(!hideFab);
  const [expandFab, setExpandFab] = useState(false);
  const mobileFabRef = useRef<HTMLDivElement | null>(null);

  const onlineStudentIds = useMemo(
    () => new Set(onlineStudents.map((s) => s.id)),
    [onlineStudents],
  );

  useEffect(() => {
    if (hideFab) {
      setShowMobileFab(false);
      setExpandFab(false);
    } else {
      setShowMobileFab(true);
    }
  }, [hideFab]);

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = rawStudents.filter((student) => {
      const {
        firstName = "",
        lastName = "",
        middleName = "",
        referenceNumber = "",
        sectionId,
      } = student;

      const sectionName = getSectionName(sectionId, rawSections).toLowerCase();
      const query = searchTerm.toLowerCase();

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
      const matchesStatus =
        selectedStatus === "all" || status === selectedStatus;

      return matchesSearch && matchesSection && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      const column = sortConfig.key;
      let comparison = 0;

      if (column === "sectionName") {
        const sectionA = getSectionName(a.sectionId, rawSections);
        const sectionB = getSectionName(b.sectionId, rawSections);
        comparison = sectionA.localeCompare(sectionB);
      } else if (column === "statusComputed") {
        const statusA = onlineStudentIds.has(a.id) ? "online" : "offline";
        const statusB = onlineStudentIds.has(b.id) ? "online" : "offline";
        comparison = statusA.localeCompare(statusB);
      } else if (column === "lastOnline") {
        const dateA = a.lastOnline
          ? new Date(a.lastOnline).getTime()
          : -Infinity;
        const dateB = b.lastOnline
          ? new Date(b.lastOnline).getTime()
          : -Infinity;

        if (dateA === -Infinity && dateB === -Infinity) comparison = 0;
        else if (dateA === -Infinity) comparison = -1;
        else if (dateB === -Infinity) comparison = 1;
        else comparison = dateA - dateB;
      } else if (column === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        comparison = dateA - dateB;
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

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [
    rawStudents,
    rawSections,
    onlineStudentIds,
    searchTerm,
    selectedSections,
    selectedStatus,
    sortConfig,
  ]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedStudents.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleSort = (
    column: keyof Student | "sectionName" | "statusComputed",
  ) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedSections([]);
    setSelectedStatus("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleStudentClick = (studentId: string) => {
    onStudentClick(studentId);
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
    selectedSections.length > 0 ||
    selectedStatus !== "all" ||
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
          <h3 className="text-lg font-semibold">No students available</h3>
          <p className="text-muted-foreground mt-1">
            There are no students to display at the moment.
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
            No students match your search criteria.
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

  const MobileStudentCard = ({ student }: { student: Student }) => {
    const status = onlineStudentIds.has(student.id) ? "Online" : "Offline";
    const sectionName = getSectionName(student.sectionId, rawSections);

    return (
      <Card
        className="cursor-pointer transition-colors hover:bg-muted/50 mb-3 shadow-none"
        onClick={() => handleStudentClick(student.id)}
      >
        <CardContent className="p-4 shadow-none">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-base">
                {student.referenceNumber}
              </h3>
              <p className="text-sm text-muted-foreground">
                {student.lastName}, {student.firstName} {student.middleName}
              </p>
            </div>
            <Badge
              variant={status === "Online" ? "default" : "secondary"}
              className={cn(
                status === "Online"
                  ? "bg-green-500 text-background  hover:bg-green-600"
                  : "bg-red-500 text-background hover:bg-red-600",
              )}
            >
              {status}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Section:</span>
              <span>{sectionName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date Created:</span>
              <span>
                {student.createdAt
                  ? new Date(student.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Played:</span>
              <span className="text-right">
                {student.lastOnline
                  ? new Date(student.lastOnline).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: keyof Student | "sectionName" | "statusComputed";
    children: React.ReactNode;
  }) => (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${column === "lastOnline" ? "text-center" : ""
        }`}
      onClick={() => handleSort(column)}
    >
      <div
        className={`flex items-center gap-2 ${column === "lastOnline" ? "justify-center" : ""
          }`}
      >
        {children}
        {sortConfig.key === column ? (
          sortConfig.direction === "asc" ? (
            <IoChevronUp className="h-4 w-4" />
          ) : (
            <IoChevronDown className="h-4 w-4" />
          )
        ) : (
          <IoChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </TableHead>
  );

  return (
    <Card className="flex flex-col rounded-sm shadow-none w-full h-full flex-1">
      <CardHeader className="pb-4 shadow-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 shadow-none">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student"
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

            <DropdownMenu>
              <DropdownMenuTrigger
                className={`h-9 px-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-inherit hover:bg-accent hover:text-accent-foreground ${hasActiveFilters ? "bg-primary text-primary-foreground" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <CiFilter className="h-4 w-4" />
                  Filter
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <CiFilter className="h-4 w-4" />
                  Filter Students
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-3 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Sections</label>
                    <div className="max-h-32 overflow-y-auto border rounded-md mt-1">
                      {rawSections.map((section) => (
                        <DropdownMenuCheckboxItem
                          key={section.id}
                          checked={selectedSections.includes(section.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSections([
                                ...selectedSections,
                                section.id,
                              ]);
                            } else {
                              setSelectedSections(
                                selectedSections.filter(
                                  (id) => id !== section.id,
                                ),
                              );
                            }
                          }}
                        >
                          {section.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DropdownMenuSeparator className="my-3" />

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {filteredAndSortedStudents.length} of {rawStudents.length}{" "}
                      students
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

          <div className="hidden sm:flex gap-2 items-center">
            {showArchive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("archives")}
                className="flex items-center gap-2"
              >
                <GoArchive className="h-4 w-4" />
                Archive
              </Button>
            )}
            {showRegistrationCodes && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("registration-codes")}
                className="flex items-center gap-2"
              >
                <IoQrCodeOutline className="h-4 w-4" />
                Codes
              </Button>
            )}
            <Button
              size="sm"
              onClick={onClickAddStudent}
              className="flex items-center gap-2"
            >
              <GoPlus className="h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/20 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <CiFilter className="h-4 w-4" />
              <span className="text-sm">
                <Badge variant="secondary" className="mr-2">
                  {filteredAndSortedStudents.length}
                </Badge>
                student{filteredAndSortedStudents.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedSections.length > 0 && ` in selected sections`}
                {selectedStatus !== "all" && ` with status: ${selectedStatus}`}
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 shadow-none flex flex-1 flex-col">
        {rawStudents.length === 0 ? (
          <div className="flex-1 min-h-[750px]">
            <EmptyState />
          </div>
        ) : filteredAndSortedStudents.length === 0 ? (
          <div className="flex-1 min-h-[750px]">
            <NoResultsState />
          </div>
        ) : (
          <div className="flex flex-col flex-1 h-full w-full">
            <div className="hidden lg:flex flex-col flex-1">
              <div className="min-h-0 flex-1">
                <Table className="w-full table-fixed h-full">
                  <TableHeader className="bg-muted/50 h-14">
                    <TableRow>
                      <SortableHeader column="referenceNumber">
                        LRN
                      </SortableHeader>
                      <SortableHeader column="lastName">Name</SortableHeader>
                      <SortableHeader column="sectionName">
                        Section
                      </SortableHeader>
                      <SortableHeader column="statusComputed">
                        Status
                      </SortableHeader>
                      <SortableHeader column="createdAt">
                        Date Created
                      </SortableHeader>
                      <SortableHeader column="lastOnline">
                        Last Played
                      </SortableHeader>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {currentItems.map((student) => (
                      <StudentTableItem
                        key={student.id}
                        student={student}
                        onClick={handleStudentClick}
                        sections={rawSections}
                        onlineStudentIds={onlineStudentIds}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="block lg:hidden p-4 min-h-[480px] flex-1">
              {currentItems.map((student) => (
                <MobileStudentCard key={student.id} student={student} />
              ))}
            </div>

            {filteredAndSortedStudents.length > 0 && (
              <div className="border-t rounded-b-sm bg-background p-2">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
                  <div className="text-sm text-muted-foreground text-nowrap">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstItem + 1}-
                      {Math.min(
                        indexOfLastItem,
                        filteredAndSortedStudents.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredAndSortedStudents.length}
                    </span>{" "}
                    students
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

      <AnimatePresence>
        {!hideFab && showMobileFab && (
          <div
            className="md:hidden fixed bottom-30 right-6 z-50"
            ref={mobileFabRef}
          >
            {expandFab && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="flex flex-col gap-3 mb-3"
              >
                {showArchive && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center w-14 h-14 bg-background rounded-full border border-border text-foreground hover:bg-muted shadow-sm"
                    onClick={() => {
                      navigate("archives");
                      setShowMobileFab(false);
                    }}
                    title="Archive"
                  >
                    <GoArchive className="w-5 h-5" />
                  </motion.button>
                )}

                {showRegistrationCodes && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center w-14 h-14 bg-background rounded-full border border-border text-foreground hover:bg-muted shadow-sm"
                    onClick={() => {
                      navigate("registration-codes");
                      setShowMobileFab(false);
                    }}
                    title="Registration Codes"
                  >
                    <IoQrCodeOutline className="w-5 h-5" />
                  </motion.button>
                )}

                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center w-14 h-14 bg-background rounded-full border border-border text-foreground hover:bg-muted shadow-sm"
                  onClick={() => {
                    onClickAddStudent();
                    setShowMobileFab(false);
                  }}
                  title="Add Student"
                >
                  <GoPlus className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`flex items-center justify-center w-14 h-14 rounded-full shadow-sm bg-primary text-white`}
              onClick={() => setExpandFab(!expandFab)}
              title={expandFab ? "Close" : "Menu"}
            >
              {expandFab ? (
                <IoChevronDown className="w-5 h-5" />
              ) : (
                <IoChevronUp className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}
