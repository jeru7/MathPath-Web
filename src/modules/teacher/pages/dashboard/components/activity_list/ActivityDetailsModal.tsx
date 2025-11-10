import { useEffect, useState, type ReactElement } from "react";
import { AdminTeacherStudentActivity } from "../../../../../core/types/activity/activity.type";
import { subDays, startOfDay, isToday, isWithinInterval } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../../../components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CiSearch } from "react-icons/ci";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import AdminTeacherActivity from "@/modules/core/components/activity/AdminTeacherActivity";

type ActivityDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  allActivities: AdminTeacherStudentActivity[];
};

type TimeFilter = "today" | "7days" | "14days" | "all";

export default function ActivityDetailsModal({
  isOpen,
  onClose,
  allActivities,
}: ActivityDetailsModalProps): ReactElement {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [filteredActivities, setFilteredActivities] = useState<
    AdminTeacherStudentActivity[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let filtered = allActivities;

    // Apply time filter with proper date handling
    if (timeFilter !== "all") {
      const now = new Date();

      filtered = filtered.filter((activity) => {
        try {
          const activityDate = new Date(activity.date);

          switch (timeFilter) {
            case "today": {
              // Show activities from the current calendar day
              return isToday(activityDate);
            }
            case "7days": {
              // Show activities from last 7 days (including today)
              const sevenDaysAgo = subDays(now, 6); // 6 days ago to include today + 6 previous days
              return isWithinInterval(activityDate, {
                start: startOfDay(sevenDaysAgo),
                end: now,
              });
            }
            case "14days": {
              // Show activities from last 14 days (including today)
              const fourteenDaysAgo = subDays(now, 13); // 13 days ago to include today + 13 previous days
              return isWithinInterval(activityDate, {
                start: startOfDay(fourteenDaysAgo),
                end: now,
              });
            }
            default:
              return true;
          }
        } catch (error) {
          console.error("Error filtering activity:", error, activity);
          return false;
        }
      });
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (activity) =>
          activity.firstName.toLowerCase().includes(term) ||
          activity.lastName.toLowerCase().includes(term) ||
          (activity.highlight as string).toLowerCase().includes(term) ||
          activity.type.toLowerCase().includes(term),
      );
    }

    setFilteredActivities(filtered);
    setCurrentPage(1);
  }, [timeFilter, allActivities, isOpen, searchTerm]);

  useEffect(() => {
    if (isOpen) {
      setFilteredActivities(allActivities);
      setCurrentPage(1);
      setSearchTerm("");
    } else {
      setTimeFilter("all");
    }
  }, [isOpen, allActivities]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredActivities.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[100dvw] h-[100dvh] max-w-4xl flex flex-col sm:w-full sm:max-w-4xl sm:h-[85dvh]">
        <DialogHeader className="flex-shrink-0 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold">
                Activity History
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredActivities.length} activities found
                {searchTerm && ` for "${searchTerm}"`}
                {timeFilter !== "all" &&
                  ` in ${timeFilter.replace("days", " days")}`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-48">
                <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-9 pr-8 h-9 text-sm"
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

              <Select
                value={timeFilter}
                onValueChange={(value: TimeFilter) => setTimeFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[140px] h-9">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="14days">Last 14 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto">
            {currentItems.length > 0 ? (
              <div className="space-y-3 p-1">
                {currentItems.map((activity) => (
                  <AdminTeacherActivity
                    key={activity.activityId}
                    activity={activity}
                    dialog={true}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <CiSearch className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold">
                    {allActivities.length === 0
                      ? "No activities available"
                      : "No activities found"}
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {allActivities.length === 0
                      ? "There are no activities to display."
                      : searchTerm || timeFilter !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "No activities match your current filters."}
                  </p>
                  {(searchTerm || timeFilter !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setTimeFilter("all");
                      }}
                      className="mt-2"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="border-t p-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground text-center sm:text-left text-nowrap">
                Showing{" "}
                <span className="font-medium">
                  {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredActivities.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredActivities.length}</span>{" "}
                activities
              </p>

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
      </DialogContent>
    </Dialog>
  );
}
