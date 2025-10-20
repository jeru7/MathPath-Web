import { type ReactElement, useMemo } from "react";
import { CiSearch, CiFilter } from "react-icons/ci";
import {
  Request,
  RequestType,
} from "../../../../../core/types/requests/request.type";
import RequestTableItem from "./RequestTableItem";

type RequestTableProps = {
  requests: Request[];
  searchTerm: string;
  selectedType: RequestType | "all";
  selectedStatus: string;
  showFilters: boolean;
  filterDropdownRef: React.RefObject<HTMLDivElement>;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onTypeChange: (type: RequestType | "all") => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
  onShowFiltersChange: (show: boolean) => void;
  onRequestClick: (request: Request) => void;
};

export default function RequestTable({
  requests,
  searchTerm,
  selectedType,
  selectedStatus,
  showFilters,
  filterDropdownRef,
  onSearchChange,
  onClearSearch,
  onTypeChange,
  onStatusChange,
  onClearFilters,
  onShowFiltersChange,
  onRequestClick,
}: RequestTableProps): ReactElement {
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        searchTerm === "" ||
        request.accountInfo?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.accountInfo?.lastname
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.accountInfo?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.type?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" || request.type === selectedType;

      const matchesStatus =
        selectedStatus === "all" || request.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [requests, searchTerm, selectedType, selectedStatus]);

  const handleClearAllFilters = () => {
    onClearFilters();
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

  return (
    <section className="bg-white border border-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 rounded-sm overflow-y-hidden shadow-sm w-full flex-1 flex flex-col">
      <div className="flex flex-col flex-1">
        <section className="w-full border-b-gray-200 dark:border-b-gray-700 p-4 border-b flex justify-between transition-colors duration-200 h-20 items-center">
          <section className="flex gap-2 items-center w-full md:w-fit">
            <div className="flex rounded-sm border-gray-200 dark:border-gray-600 border h-fit items-center pr-2 w-full bg-white dark:bg-gray-800 transition-colors duration-200">
              <div className="p-2">
                <CiSearch className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                placeholder="Search requests"
                className="text-xs focus:outline-none flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={onSearchChange}
              />
              {searchTerm && (
                <button
                  onClick={onClearSearch}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1"
                >
                  ×
                </button>
              )}
            </div>

            <div className="relative" ref={filterDropdownRef}>
              <button
                className={`p-2 rounded-xs border h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200 ${
                  hasActiveFilters
                    ? "bg-[var(--primary-green)] text-white border-[var(--primary-green)]"
                    : "border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800"
                }`}
                onClick={() => onShowFiltersChange(!showFilters)}
              >
                <CiFilter className="w-4 h-4" />
              </button>

              {showFilters && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm shadow-lg z-30 w-64 p-4 transition-colors duration-200">
                  {hasActiveFilters && (
                    <div className="flex justify-end mb-3">
                      <button
                        onClick={handleClearAllFilters}
                        className="text-xs text-[var(--primary-green)] dark:text-green-400 hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Request Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) =>
                        onTypeChange(e.target.value as RequestType | "all")
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
                    >
                      <option value="all">All Types</option>
                      <option value="account-information">
                        Account Information
                      </option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => onStatusChange(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                    Showing {filteredRequests.length} of {requests.length}{" "}
                    requests
                  </div>
                </div>
              )}
            </div>
          </section>
        </section>

        {hasActiveFilters && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredRequests.length} request
              {filteredRequests.length !== 1 ? "s" : ""} found
              {searchTerm && ` for "${searchTerm}"`}
              {(selectedType !== "all" || selectedStatus !== "all") &&
                " with filters applied"}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-auto">
          <div className="min-h-full flex flex-col flex-1 min-w-[1000px]">
            {requests.length === 0 ? (
              <div className="flex-1 min-h-full items-center justify-center flex">
                <p className="text-gray-300 dark:text-gray-600">
                  No requests available
                </p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex-1 min-h-full items-center justify-center flex">
                <div className="text-center">
                  <p className="text-gray-400 dark:text-gray-500 mb-2">
                    No requests match your search criteria
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearAllFilters}
                      className="text-sm text-[var(--primary-green)] dark:text-green-400 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className={`max-h-[780px] overflow-y-auto pb-4 flex-1`}>
                {/* headers */}
                <table className="font-primary table-auto w-full">
                  <thead className="text-gray-400 dark:text-gray-500 text-sm xl:text-base transition-colors duration-200">
                    <tr className="text-left">
                      <th className="bg-white dark:bg-gray-800 sticky top-0 z-20 w-[20%] py-3 border-b border-gray-200 dark:border-gray-700">
                        Name
                      </th>
                      <th className="bg-white dark:bg-gray-800 sticky top-0 z-20 w-[20%] py-3 border-b border-gray-200 dark:border-gray-700">
                        Type
                      </th>
                      <th className="bg-white dark:bg-gray-800 sticky top-0 z-20 w-[20%] py-3 border-b border-gray-200 dark:border-gray-700">
                        Email
                      </th>
                      <th className="bg-white dark:bg-gray-800 sticky top-0 z-20 w-[20%] py-3 border-b border-gray-200 dark:border-gray-700">
                        Status
                      </th>
                      <th className="bg-white dark:bg-gray-800 sticky top-0 z-20 w-[20%] py-3 border-b border-gray-200 dark:border-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                </table>

                {/* request lists */}
                <table className="font-primary table-auto w-full">
                  <tbody>
                    {filteredRequests.map((request) => (
                      <RequestTableItem
                        key={request.id}
                        request={request}
                        getStatusColor={getStatusColor}
                        getTypeLabel={getTypeLabel}
                        formatDate={formatDate}
                        onRequestClick={onRequestClick}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
