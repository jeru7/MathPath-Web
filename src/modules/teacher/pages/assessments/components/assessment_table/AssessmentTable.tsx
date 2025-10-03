import { type ReactElement, useState, useMemo, useRef, useEffect } from "react";
import "../../../../../core/styles/customTable.css";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { NavigateFunction } from "react-router-dom";
import AssessmentTableItem from "./AssessmentTableItem";
import {
  Assessment,
  AssessmentStatus,
} from "../../../../../core/types/assessment/assessment.type";

type AssessmentTableProps = {
  navigate: NavigateFunction;
  assessments: Assessment[] | [];
};

export default function AssessmentTable({
  navigate,
  assessments,
}: AssessmentTableProps): ReactElement {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    AssessmentStatus | "all"
  >("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const uniqueTopics = useMemo(() => {
    const topics = assessments
      .map((assessment) => assessment.topic)
      .filter((topic): topic is string => topic !== null);
    return Array.from(new Set(topics));
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

      const matchesStatus =
        selectedStatus === "all" || assessment.status === selectedStatus;

      const matchesTopic =
        selectedTopic === "all" || assessment.topic === selectedTopic;

      return matchesSearch && matchesStatus && matchesTopic;
    });
  }, [assessments, searchTerm, selectedStatus, selectedTopic]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedTopic("all");
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasActiveFilters =
    selectedStatus !== "all" || selectedTopic !== "all" || searchTerm !== "";

  return (
    <section className="flex flex-col flex-1">
      <section className="w-full border-b-gray-200 p-4 border-b flex justify-between">
        {/* search and filters */}
        <section className="flex gap-2 items-center w-full md:w-fit">
          <div className="flex rounded-sm border-gray-200 border h-fit items-center pr-2 w-full">
            <div className="p-2">
              <CiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              placeholder="Search assessment"
              className="text-xs focus:outline-none flex-1"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
              >
                ×
              </button>
            )}
          </div>

          {/* filter dropdown */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              className={`p-2 rounded-xs border h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200 ${
                hasActiveFilters
                  ? "bg-[var(--primary-green)] text-white border-[var(--primary-green)]"
                  : "border-gray-200 text-gray-400"
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <CiFilter className="w-4 h-4" />
            </button>

            {showFilters && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-30 w-64 p-4">
                {hasActiveFilters && (
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-[var(--primary-green)] hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(
                        e.target.value as AssessmentStatus | "all",
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)]"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="in-progress">In Progress</option>
                    <option value="published">Published</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>

                {uniqueTopics.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)]"
                    >
                      <option value="all">All Topics</option>
                      {uniqueTopics.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="text-xs text-gray-500 border-t pt-2">
                  Showing {filteredAssessments.length} of {assessments.length}{" "}
                  assessments
                </div>
              </div>
            )}
          </div>
        </section>

        {/* create button */}
        <button
          className="hidden md:flex gap-2 items-center justify-center py-3 px-4 bg-[var(--primary-green)]/90 rounded-sm text-white hover:cursor-pointer hover:bg-[var(--primary-green)] transition-all duration-200"
          onClick={() => navigate("new")}
        >
          <GoPlus className="w-4 h-4" />
          <p className="text-sm font-semibold">Create assessment</p>
        </button>
      </section>

      {hasActiveFilters && (
        <div className="px-4 py-2 bg-blue-50 border-b">
          <div className="text-sm text-gray-600">
            {filteredAssessments.length} assessment
            {filteredAssessments.length !== 1 ? "s" : ""} found
            {searchTerm && ` for "${searchTerm}"`}
            {(selectedStatus !== "all" || selectedTopic !== "all") &&
              " with filters applied"}
          </div>
        </div>
      )}

      {/* table */}
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="min-h-full flex flex-col flex-1 min-w-[1000px]">
          {/* assessment items/list */}
          {assessments.length === 0 ? (
            <div className="flex-1 min-h-full items-center justify-center flex">
              <p className="text-gray-300">No assessments available</p>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="flex-1 min-h-full items-center justify-center flex">
              <div className="text-center">
                <p className="text-gray-400 mb-2">
                  No assessments match your search criteria
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-[var(--primary-green)] hover:underline"
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
                <thead className="text-gray-400 text-sm xl:text-base">
                  <tr className="text-left">
                    <th className="bg-white sticky top-0 z-20 w-[15%] xl:w-[20%]">
                      Title
                    </th>
                    <th className="bg-white sticky top-0 z-20 w-[15%] xl:w-[20%]">
                      Topic
                    </th>
                    <th className="bg-white sticky top-0 z-20 w-[15%] text-center">
                      Sections
                    </th>
                    <th className="bg-white sticky top-0 z-20 w-[10%] text-center">
                      Status
                    </th>
                    <th className="bg-white sticky top-0 z-20 w-[10%] text-center">
                      Deadline
                    </th>
                    <th className="bg-white sticky top-0 z-20 w-[5%]"></th>
                  </tr>
                </thead>
              </table>
              <table className="font-primary table-auto w-full">
                <tbody>
                  {filteredAssessments.map((assessment) => (
                    <AssessmentTableItem
                      key={assessment.id}
                      assessment={assessment}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
