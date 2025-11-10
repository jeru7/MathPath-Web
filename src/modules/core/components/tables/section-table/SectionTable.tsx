import { type ReactElement, useState, useMemo, useEffect } from "react";
import SectionItem from "./SectionItem";
import { Section, SectionColor } from "../../../types/section/section.type";
import { Student } from "../../../../student/types/student.type";
import { Assessment } from "../../../types/assessment/assessment.type";
import { toast } from "react-toastify";
import { Teacher } from "../../../../teacher/types/teacher.type";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus, GoArchive } from "react-icons/go";
import { ChevronUp, ChevronDown } from "lucide-react";

export type SectionTableContext = {
  allStudents: Student[];
  onlineStudents: Student[];
  rawStudents: Student[];
  rawAssessments: Assessment[];
  teachers?: Teacher[];
  rawSections: Section[];
};

type SectionTableProps = {
  userType: "teacher" | "admin";
  context: SectionTableContext;
  sections: Section[];
  onShowForm: () => void;
  onSectionClick: (section: Section) => void;
  showArchive?: boolean;
  hideFab?: boolean;
};

export default function SectionTable({
  userType,
  context,
  sections,
  onShowForm,
  onSectionClick,
  showArchive = false,
  hideFab = false,
}: SectionTableProps): ReactElement {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState<SectionColor | "all">(
    "all",
  );
  const [showMobileFab, setShowMobileFab] = useState(!hideFab);
  const [expandFab, setExpandFab] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const navigate = useNavigate();

  const filteredSections = useMemo(() => {
    let filtered = sections;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((section) =>
        section.name?.toLowerCase().includes(term),
      );
    }

    if (selectedColor !== "all") {
      filtered = filtered.filter((section) => section.color === selectedColor);
    }

    return filtered;
  }, [sections, searchTerm, selectedColor]);

  const totalPages = Math.ceil(filteredSections.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSections.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedColor("all");
    setCurrentPage(1);
  };

  const handleCreateSection = () => {
    if (userType === "teacher") {
      onShowForm();
      return;
    }

    if (!context.teachers || context.teachers.length === 0) {
      toast.error(
        "You can't create a section if there's no teacher available.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      );
      return;
    }

    onShowForm();
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

  const hasActiveFilters = searchTerm !== "" || selectedColor !== "all";

  const colorOptions: {
    value: SectionColor | "all";
    label: string;
    color: string;
  }[] = [
      { value: "all", label: "All Colors", color: "bg-gray-400" },
      { value: "primary-green", label: "Green", color: "bg-green-500" },
      {
        value: "tertiary-green",
        label: "Light Green",
        color: "bg-green-400",
      },
      {
        value: "primary-orange",
        label: "Orange",
        color: "bg-orange-500",
      },
      {
        value: "primary-yellow",
        label: "Yellow",
        color: "bg-yellow-500",
      },
    ];

  useEffect(() => {
    if (hideFab) {
      setShowMobileFab(false);
      setExpandFab(false);
    } else {
      setShowMobileFab(true);
    }
  }, [hideFab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedColor]);

  const EmptyState = () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
          <CiSearch className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">No sections available</h3>
          <p className="text-muted-foreground mt-1">
            There are no sections to display at the moment.
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
            No sections match your search criteria.
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

  return (
    <Card className="flex flex-col rounded-sm shadow-none w-full">
      <CardHeader className="pb-4 shadow-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 shadow-none">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search section"
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
                  Filter Sections
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-3 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Colors</label>
                    <div className="max-h-fit mt-1">
                      {colorOptions.map((option) => (
                        <DropdownMenuCheckboxItem
                          key={option.value}
                          checked={selectedColor === option.value}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedColor(option.value);
                            } else if (option.value === "all") {
                              setSelectedColor("all");
                            } else {
                              setSelectedColor("all");
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`w-4 h-4 rounded-full ${option.color} border`}
                          />
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-3" />

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {filteredSections.length} of {sections.length} sections
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
            <Button
              size="sm"
              onClick={handleCreateSection}
              className="flex items-center gap-2"
            >
              <GoPlus className="h-4 w-4" />
              Create Section
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/20 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <CiFilter className="h-4 w-4" />
              <span className="text-sm">
                <Badge variant="secondary" className="mr-2">
                  {filteredSections.length}
                </Badge>
                section{filteredSections.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedColor !== "all" &&
                  ` with color: ${colorOptions.find((c) => c.value === selectedColor)?.label}`}
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 shadow-none flex-1">
        {sections.length === 0 ? (
          <div className="flex-1 min-h-[750px]">
            <EmptyState />
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="flex-1 min-h-[750px]">
            <NoResultsState />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
              <div className="p-2">
                <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 grid-rows-2">
                  {currentItems.map((section) => (
                    <SectionItem
                      key={section.id}
                      section={section}
                      onClick={() => onSectionClick(section)}
                      context={context}
                    />
                  ))}
                </div>

                <div className="sm:hidden space-y-2">
                  {currentItems.map((section) => (
                    <SectionListItem
                      key={section.id}
                      section={section}
                      onClick={() => onSectionClick(section)}
                      context={context}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>

            {filteredSections.length > 0 && (
              <div className="border-t rounded-b-sm bg-background p-2">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
                  <div className="text-sm text-muted-foreground text-nowrap">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, filteredSections.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredSections.length}
                    </span>{" "}
                    results
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

      <AnimatePresence>
        {!hideFab && showMobileFab && (
          <div className="md:hidden fixed bottom-30 right-6 z-50">
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

                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center w-14 h-14 bg-background rounded-full border border-border text-foreground hover:bg-muted shadow-sm"
                  onClick={() => {
                    handleCreateSection();
                    setShowMobileFab(false);
                  }}
                  title="Create Section"
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
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function SectionListItem({
  section,
  onClick,
  context,
}: {
  section: Section;
  onClick?: () => void;
  context: SectionTableContext;
}): ReactElement {
  const { onlineStudents, rawStudents, rawAssessments } = context;

  const studentCount = rawStudents.filter(
    (student) => student.sectionId === section.id,
  ).length;

  const assessmentCount = rawAssessments.filter((assessment) =>
    assessment?.sections?.includes(section.id),
  ).length;

  const onlineStudentCount = (): number => {
    const onlineInSection = onlineStudents.filter(
      (student) => student.sectionId === section.id,
    );
    return onlineInSection.length;
  };

  const onlinePercentage =
    studentCount > 0
      ? Math.round((onlineStudentCount() / studentCount) * 100)
      : 0;

  const getColorClass = (color: SectionColor) => {
    switch (color) {
      case "primary-green":
        return "bg-green-500";
      case "tertiary-green":
        return "bg-green-400";
      case "primary-orange":
        return "bg-orange-500";
      case "primary-yellow":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50"
      onClick={handleClick}
    >
      <div
        className={`${getColorClass(section.color)} w-3 h-12 rounded-full`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold truncate">{section.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {onlineStudentCount()}/{studentCount}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{studentCount} students</span>
          <span>{assessmentCount} assessments</span>
          <span>{onlinePercentage}% online</span>
        </div>
      </div>
    </div>
  );
}
