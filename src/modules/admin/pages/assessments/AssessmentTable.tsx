import { type ReactElement, useState, useMemo, useRef, useEffect } from "react";
import { CiSearch, CiFilter } from "react-icons/ci";
import { GoPlus, GoArchive } from "react-icons/go";
import { NavigateFunction } from "react-router-dom";
import AssessmentTableItem from "./AssessmentTableItem";
import {
  Assessment,
  AssessmentStatus,
} from "../../../core/types/assessment/assessment.type";
import { Teacher } from "../../../teacher/types/teacher.type";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AssessmentDetailsModal from "@/modules/core/components/assessment-details/AssessesmentDetailsModal";
import { useAdminContext } from "../../context/admin.context";
import AssessmentStatusBadge from "@/modules/teacher/pages/assessments/components/assessment_table/AssessmentStatus";

type AssessmentTableProps = {
  navigate: NavigateFunction;
  assessments: Assessment[];
  teachers: Teacher[];
  onDeleteAssessment: (assessment: Assessment) => void;
  getTeacherName: (assessment: Assessment) => string;
  onArchiveAssessment?: (assessment: Assessment) => void;
  showArchive?: boolean;
  hideFab?: boolean;
};

export default function AssessmentTable({
  navigate,
  assessments,
  teachers,
  onDeleteAssessment,
  getTeacherName,
  onArchiveAssessment,
  showArchive = false,
  hideFab = false,
}: AssessmentTableProps): ReactElement {
  const { adminId } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    AssessmentStatus | "all"
  >("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMobileFab, setShowMobileFab] = useState(!hideFab);
  const [expandFab, setExpandFab] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const mobileFabRef = useRef<HTMLDivElement>(null);

  const selectedAssessmentTeacher = useMemo(() => {
    if (!selectedAssessment) return undefined;
    return teachers.find(
      (teacher) =>
        `${teacher.firstName} ${teacher.lastName}` ===
        getTeacherName(selectedAssessment),
    );
  }, [selectedAssessment, teachers, getTeacherName]);

  const uniqueTopics = useMemo(() => {
    const topics = assessments
      .map((assessment) => assessment.topic)
      .filter((topic): topic is string => topic !== null);
    return Array.from(new Set(topics));
  }, [assessments]);

  const uniqueTeachers = useMemo(() => {
    const teacherNames = assessments.map((assessment) =>
      getTeacherName(assessment),
    );
    return Array.from(new Set(teacherNames)).filter(
      (teacherName): teacherName is string => teacherName !== "",
    );
  }, [assessments, getTeacherName]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const matchesSearch =
        searchTerm === "" ||
        assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        getTeacherName(assessment)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || assessment.status === selectedStatus;

      const matchesTopic =
        selectedTopic === "all" || assessment.topic === selectedTopic;

      const matchesTeacher =
        selectedTeacher === "all" ||
        getTeacherName(assessment) === selectedTeacher;

      return matchesSearch && matchesStatus && matchesTopic && matchesTeacher;
    });
  }, [
    assessments,
    searchTerm,
    selectedStatus,
    selectedTopic,
    selectedTeacher,
    getTeacherName,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssessments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleAssessmentClick = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedAssessment(null);
  };

  const handleCreateAssessment = () => {
    // Navigate to create assessment page
    navigate("new/create");
  };

  const handleArchiveClick = () => {
    // Navigate to archive page
    navigate("archives");
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
    setSelectedStatus("all");
    setSelectedTopic("all");
    setSelectedTeacher("all");
    setSearchTerm("");
    setCurrentPage(1);
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

  useEffect(() => {
    if (hideFab) {
      setShowMobileFab(false);
      setExpandFab(false);
    } else {
      setShowMobileFab(true);
    }
  }, [hideFab]);

  const hasActiveFilters =
    selectedStatus !== "all" ||
    selectedTopic !== "all" ||
    selectedTeacher !== "all" ||
    searchTerm !== "";

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

  const MobileAssessmentCard = ({ assessment }: { assessment: Assessment }) => {
    const teacherName = getTeacherName(assessment);

    return (
      <Card
        className="cursor-pointer transition-all hover:shadow-md  mb-3 shadow-sm"
        onClick={() => handleAssessmentClick(assessment)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 mr-2">
              <h3 className="font-semibold text-base mb-1 line-clamp-1">
                {assessment.title}
              </h3>
              {assessment.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {assessment.description}
                </p>
              )}
            </div>
            <AssessmentStatusBadge status={assessment.status} />
          </div>

          <div className="space-y-2 text-sm">
            {assessment.topic && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground min-w-[60px]">
                  Topic:
                </span>
                <span className="font-medium text-foreground">
                  {assessment.topic}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground min-w-[60px]">
                Teacher:
              </span>
              <span className="font-medium text-foreground">{teacherName}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground min-w-[60px]">
                Sections:
              </span>
              <span className="font-medium text-foreground">
                {assessment.sections?.length || 0}
              </span>
            </div>

            {assessment.date.end && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground min-w-[60px]">
                  Deadline:
                </span>
                <span className="font-medium text-foreground">
                  {new Date(assessment.date.end).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Card className="flex flex-col rounded-lg shadow-sm w-full h-full flex-1 border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assessments..."
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
                  className={`h-9 px-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-inherit hover:bg-accent hover:text-accent-foreground ${hasActiveFilters ? "bg-primary text-primary-foreground" : ""
                    }`}
                >
                  <div className="flex items-center gap-2">
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
                        onValueChange={(value: AssessmentStatus | "all") =>
                          setSelectedStatus(value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="finished">Finished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {uniqueTopics.length > 0 && (
                      <div>
                        <label className="text-sm font-medium">Topic</label>
                        <Select
                          value={selectedTopic}
                          onValueChange={setSelectedTopic}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select topic" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            <SelectItem value="all">All Topics</SelectItem>
                            {uniqueTopics.map((topic) => (
                              <SelectItem key={topic} value={topic}>
                                {topic}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {uniqueTeachers.length > 0 && (
                      <div>
                        <label className="text-sm font-medium">Teacher</label>
                        <Select
                          value={selectedTeacher}
                          onValueChange={setSelectedTeacher}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            <SelectItem value="all">All Teachers</SelectItem>
                            {uniqueTeachers.map((teacherName) => (
                              <SelectItem key={teacherName} value={teacherName}>
                                {teacherName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

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

            <div className="hidden sm:flex gap-2 items-center">
              {showArchive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleArchiveClick}
                  className="flex items-center gap-2"
                >
                  <GoArchive className="h-4 w-4" />
                  Archive
                </Button>
              )}
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
                  {selectedStatus !== "all" &&
                    ` with status: ${selectedStatus}`}
                  {selectedTopic !== "all" && ` with topic: ${selectedTopic}`}
                  {selectedTeacher !== "all" &&
                    ` with teacher: ${selectedTeacher}`}
                </span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 flex flex-1 flex-col">
          {assessments.length === 0 ? (
            <div className="flex-1 min-h-[400px]">
              <EmptyState />
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="flex-1 min-h-[400px]">
              <NoResultsState />
            </div>
          ) : (
            <div className="flex flex-col flex-1 h-full w-full">
              {/* desktop table view */}
              <div className="hidden lg:flex flex-col flex-1">
                <div className="flex-1 overflow-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-medium">Title</TableHead>
                        <TableHead className="font-medium">Topic</TableHead>
                        <TableHead className="font-medium">Teacher</TableHead>
                        <TableHead className="font-medium text-center">
                          Sections
                        </TableHead>
                        <TableHead className="font-medium text-center">
                          Status
                        </TableHead>
                        <TableHead className="font-medium text-center">
                          Deadline
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((assessment) => (
                        <AssessmentTableItem
                          key={assessment.id}
                          assessment={assessment}
                          teacherName={getTeacherName(assessment)}
                          onAssessmentClick={handleAssessmentClick}
                          onDeleteAssessment={onDeleteAssessment}
                          onArchiveAssessment={onArchiveAssessment}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* mobile card view */}
              <div className="block lg:hidden p-4 min-h-[480px] flex-1">
                {currentItems.map((assessment) => (
                  <MobileAssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                  />
                ))}
              </div>

              {/* pagination */}
              {filteredAssessments.length > 0 && (
                <div className="border-t bg-background p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground text-nowrap">
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
                      <div>
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
      </Card>

      {/* floating action buttons for mobile */}
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
                    className="flex items-center justify-center w-14 h-14 bg-background rounded-full border border-border text-foreground hover:bg-muted shadow-lg"
                    onClick={() => {
                      handleArchiveClick();
                      setShowMobileFab(false);
                    }}
                    title="Archive"
                  >
                    <GoArchive className="w-5 h-5" />
                  </motion.button>
                )}

                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center w-14 h-14 bg-background rounded-full border border-border text-foreground hover:bg-muted shadow-lg"
                  onClick={() => {
                    handleCreateAssessment();
                    setShowMobileFab(false);
                  }}
                  title="Create Assessment"
                >
                  <GoPlus className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90`}
              onClick={() => setExpandFab(!expandFab)}
              title={expandFab ? "Close" : "Menu"}
            >
              {expandFab ? (
                <IoChevronDown className="h-5 w-5" />
              ) : (
                <IoChevronUp className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* assessment details modal */}
      {selectedAssessment && (
        <AssessmentDetailsModal
          userType="admin"
          userId={adminId}
          isOpen={showDetailsModal}
          assessment={selectedAssessment}
          teacher={selectedAssessmentTeacher}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
