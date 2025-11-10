import { type ReactElement, useMemo, useState } from "react";
import { CiSearch, CiFilter } from "react-icons/ci";
import {
  Request,
  RequestType,
} from "../../../../../core/types/requests/request.type";
import RequestTableItem from "./RequestTableItem";
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

type RequestTableProps = {
  requests: Request[];
  onRequestClick: (request: Request) => void;
};

export default function RequestTable({
  requests,
  onRequestClick,
}: RequestTableProps): ReactElement {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<RequestType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredRequests = useMemo(() => {
    if (!searchTerm && selectedType === "all" && selectedStatus === "all") {
      return requests;
    }

    return requests.filter((request) => {
      const matchesSearch =
        !searchTerm ||
        (
          request.accountInfo?.originalData?.firstName?.toLowerCase() || ""
        ).includes(searchTerm.toLowerCase()) ||
        (
          request.accountInfo?.originalData?.lastName?.toLowerCase() || ""
        ).includes(searchTerm.toLowerCase()) ||
        (
          request.accountInfo?.originalData?.email?.toLowerCase() || ""
        ).includes(searchTerm.toLowerCase()) ||
        (request.type?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ) ||
        (request.status?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        );

      const matchesType =
        selectedType === "all" || request.type === selectedType;

      const matchesStatus =
        selectedStatus === "all" || request.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [requests, searchTerm, selectedType, selectedStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(
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
    setSelectedType("all");
    setSelectedStatus("all");
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTypeLabel = (type: RequestType): string => {
    switch (type) {
      case "account-information":
        return "Account Information";
      default:
        return type;
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasActiveFilters =
    selectedType !== "all" || selectedStatus !== "all" || searchTerm !== "";

  const EmptyState = () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
          <CiSearch className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">No requests available</h3>
          <p className="text-muted-foreground mt-1">
            There are no requests to display at the moment.
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
            No requests match your search criteria.
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
    <Card className="flex flex-col rounded-sm shadow-none w-full h-full flex-1">
      <CardHeader className="pb-4 shadow-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 shadow-none">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests"
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
                  Filter Requests
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-3 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Request Type</label>
                    <Select
                      value={selectedType}
                      onValueChange={(value: RequestType | "all") =>
                        setSelectedType(value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="account-information">
                          Account Information
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DropdownMenuSeparator className="my-3" />

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {filteredRequests.length} of {requests.length} requests
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
                  {filteredRequests.length}
                </Badge>
                request{filteredRequests.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedType !== "all" && ` with type: ${selectedType}`}
                {selectedStatus !== "all" && ` with status: ${selectedStatus}`}
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 shadow-none flex flex-1 flex-col">
        {requests.length === 0 ? (
          <div className="flex-1 min-h-[400px]">
            <EmptyState />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex-1 min-h-[400px]">
            <NoResultsState />
          </div>
        ) : (
          <div className="flex flex-col flex-1 h-full w-full">
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="bg-muted/50 h-14">
                  <TableRow>
                    <TableHead className="font-medium w-[20%]">Name</TableHead>
                    <TableHead className="font-medium w-[20%]">Type</TableHead>
                    <TableHead className="font-medium w-[20%]">Email</TableHead>
                    <TableHead className="font-medium w-[20%] text-center">
                      Status
                    </TableHead>
                    <TableHead className="font-medium w-[20%] text-center">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((request) => (
                    <RequestTableItem
                      key={request.id}
                      request={request}
                      getStatusColor={getStatusColor}
                      getTypeLabel={getTypeLabel}
                      formatDate={formatDate}
                      onRequestClick={onRequestClick}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredRequests.length > 0 && (
              <div className="border-t rounded-b-sm bg-background p-2">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-sm text-muted-foreground text-nowrap">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, filteredRequests.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredRequests.length}
                    </span>{" "}
                    requests
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
  );
}
