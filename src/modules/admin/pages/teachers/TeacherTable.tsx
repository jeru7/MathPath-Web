import { useMemo, useRef, useState, type ReactElement } from "react";
import { Teacher } from "../../../teacher/types/teacher.type";
import { useAdminContext } from "../../context/admin.context";
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
} from "@/components/ui/table";
import { CiSearch, CiFilter } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import TeacherTableItem from "./TeacherTableItem";

type TeacherTableProps = {
  onTeacherClick: (teacherId: string) => void;
  onAddTeacher: () => void;
};

export default function TeacherTable({
  onTeacherClick,
  onAddTeacher,
}: TeacherTableProps): ReactElement {
  const { teachers } = useAdminContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVerification, setSelectedVerification] =
    useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Teacher | "fullName" | "verificationStatus";
    direction: "asc" | "desc";
  }>({ key: "lastName", direction: "asc" });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showMobileFab, setShowMobileFab] = useState(true);
  const [expandFab, setExpandFab] = useState(false);
  const mobileFabRef = useRef<HTMLDivElement | null>(null);

  const filteredAndSortedTeachers = useMemo(() => {
    const filtered = teachers.filter((teacher) => {
      const {
        firstName = "",
        lastName = "",
        middleName = "",
        email = "",
      } = teacher;

      const query = searchTerm.toLowerCase();

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
        selectedVerification === "all" ||
        verificationStatus === selectedVerification;

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

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [teachers, searchTerm, selectedVerification, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedTeachers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedTeachers.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleSort = (
    column: keyof Teacher | "fullName" | "verificationStatus",
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
    setSelectedVerification("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleTeacherClick = (teacherId: string) => {
    onTeacherClick(teacherId);
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

  const hasActiveFilters = selectedVerification !== "all" || searchTerm !== "";

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
          <h3 className="text-lg font-semibold">No teachers available</h3>
          <p className="text-muted-foreground mt-1">
            There are no teachers to display at the moment.
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
            No teachers match your search criteria.
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

  const MobileTeacherCard = ({ teacher }: { teacher: Teacher }) => {
    const status = teacher.verified.verified ? "Verified" : "Unverified";

    return (
      <Card
        className="cursor-pointer transition-colors hover:bg-muted/50 mb-3 shadow-none"
        onClick={() => handleTeacherClick(teacher.id)}
      >
        <CardContent className="p-4 shadow-none">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-base">{teacher.email}</h3>
              <p className="text-sm text-muted-foreground">
                {teacher.lastName}, {teacher.firstName} {teacher.middleName}
              </p>
            </div>
            <Badge
              variant={status === "Verified" ? "default" : "secondary"}
              className={
                status === "Verified"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {status}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender:</span>
              <span className="capitalize">{teacher.gender}</span>
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
    column: keyof Teacher | "fullName" | "verificationStatus";
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
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
                placeholder="Search teacher"
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
                  Filter Teachers
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-3 space-y-3">
                  <div>
                    <label className="text-sm font-medium">
                      Verification Status
                    </label>
                    <Select
                      value={selectedVerification}
                      onValueChange={setSelectedVerification}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DropdownMenuSeparator className="my-3" />

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {filteredAndSortedTeachers.length} of {teachers.length}{" "}
                      teachers
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
            <Button
              size="sm"
              onClick={onAddTeacher}
              className="flex items-center gap-2"
            >
              <GoPlus className="h-4 w-4" />
              Add Teacher
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/20 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <CiFilter className="h-4 w-4" />
              <span className="text-sm">
                <Badge variant="secondary" className="mr-2">
                  {filteredAndSortedTeachers.length}
                </Badge>
                teacher{filteredAndSortedTeachers.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedVerification !== "all" &&
                  ` with status: ${selectedVerification}`}
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 shadow-none flex flex-1 flex-col">
        {teachers.length === 0 ? (
          <div className="flex-1 min-h-[750px]">
            <EmptyState />
          </div>
        ) : filteredAndSortedTeachers.length === 0 ? (
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
                      <SortableHeader column="email">Email</SortableHeader>
                      <SortableHeader column="lastName">Name</SortableHeader>
                      <SortableHeader column="gender">Gender</SortableHeader>
                      <SortableHeader column="verificationStatus">
                        Status
                      </SortableHeader>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {currentItems.map((teacher) => (
                      <TeacherTableItem
                        key={teacher.id}
                        teacher={teacher}
                        onClick={handleTeacherClick}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="block lg:hidden p-4 min-h-[480px] flex-1">
              {currentItems.map((teacher) => (
                <MobileTeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>

            {filteredAndSortedTeachers.length > 0 && (
              <div className="border-t rounded-b-sm bg-background p-2">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
                  <div className="text-sm text-muted-foreground text-nowrap">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstItem + 1}-
                      {Math.min(
                        indexOfLastItem,
                        filteredAndSortedTeachers.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredAndSortedTeachers.length}
                    </span>{" "}
                    results
                  </div>

                  {totalPages > 1 && (
                    <div className="">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              size="sm"
                              onClick={handlePrevPage}
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>

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

                          <PaginationItem>
                            <PaginationNext
                              size="sm"
                              onClick={handleNextPage}
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <AnimatePresence>
        {showMobileFab && (
          <div
            className="md:hidden fixed bottom-6 right-6 z-50"
            ref={mobileFabRef}
          >
            {expandFab && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="flex flex-col gap-3 mb-3"
              >
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center w-14 h-14 bg-background rounded-full border border-border text-foreground hover:bg-muted shadow-sm"
                  onClick={() => {
                    onAddTeacher();
                    setShowMobileFab(false);
                  }}
                  title="Add Teacher"
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
