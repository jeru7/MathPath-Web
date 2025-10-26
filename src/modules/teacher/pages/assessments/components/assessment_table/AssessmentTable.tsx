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
import DraftDecisionModal from "../DraftDecisionModal";
import { useDeleteAssessment } from "../../../../services/teacher-assessment.service";
import { useTeacherAssessmentAttempts } from "../../../../services/teacher-assessment-attempt.service";
import { useTeacherContext } from "../../../../context/teacher.context";
import AssessmentDetailsModal from "../assessment-details/AssessmentDetailsModal";

type AssessmentTableProps = {
  navigate: NavigateFunction;
  assessments: Assessment[] | [];
  onDeleteAssessment: (assessment: Assessment) => void;
};

export default function AssessmentTable({
  navigate,
  assessments,
  onDeleteAssessment,
}: AssessmentTableProps): ReactElement {
  const { teacherId, students } = useTeacherContext();
  const { mutate: deleteAssessment } = useDeleteAssessment(teacherId ?? "");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    AssessmentStatus | "all"
  >("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showDraftDecision, setShowDraftDecision] = useState(false);
  const [existingDraft, setExistingDraft] = useState<Assessment | null>(null);

  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // fetch attempts for the selected assessment
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const { data: studentAttempts = [], isLoading: isLoadingAttempts } =
    useTeacherAssessmentAttempts(teacherId, selectedAssessmentId);

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

  const handleAssessmentClick = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setSelectedAssessmentId(assessment.id);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedAssessment(null);
    setSelectedAssessmentId("");
  };

  const handleCreateAssessment = () => {
    const draftAssessments = assessments.filter(
      (assessment: Assessment) => assessment.status === "draft",
    );

    if (draftAssessments.length > 0) {
      const existingDraft = draftAssessments[0];
      setExistingDraft(existingDraft);
      setShowDraftDecision(true);
    } else {
      navigate("new");
    }
  };

  const handleContinueDraft = () => {
    if (existingDraft?.id) {
      navigate(`${existingDraft.id}/configure`);
    }
    setShowDraftDecision(false);
  };

  const handleCreateNew = () => {
    if (existingDraft?.id) {
      deleteAssessment(existingDraft.id, {
        onSuccess: () => {
          navigate("new");
        },
        onError: (error) => {
          console.error("Failed to delete draft:", error);
        },
      });
    } else {
      navigate("new");
    }
    setShowDraftDecision(false);
  };

  const handleCloseDraftModal = () => {
    setShowDraftDecision(false);
    setExistingDraft(null);
  };

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
    <>
      <section className="flex flex-col flex-1">
        <section className="w-full border-b-gray-200 dark:border-b-gray-700 p-4 border-b flex justify-between transition-colors duration-200 h-20 items-center">
          {/* search and filters */}
          <section className="flex gap-2 items-center w-full md:w-fit">
            <div className="flex rounded-sm border-gray-200 dark:border-gray-600 border h-fit items-center pr-2 w-full bg-white dark:bg-gray-800 transition-colors duration-200">
              <div className="p-2">
                <CiSearch className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                placeholder="Search assessment"
                className="text-xs focus:outline-none flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1"
                >
                  ×
                </button>
              )}
            </div>

            {/* filter dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                className={`p-2 rounded-xs border h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200 ${hasActiveFilters
                    ? "bg-[var(--primary-green)] text-white border-[var(--primary-green)]"
                    : "border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800"
                  }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <CiFilter className="w-4 h-4" />
              </button>

              {showFilters && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm shadow-lg z-30 w-64 p-4 transition-colors duration-200">
                  {hasActiveFilters && (
                    <div className="flex justify-end mb-3">
                      <button
                        onClick={handleClearFilters}
                        className="text-xs text-[var(--primary-green)] dark:text-green-400 hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(
                          e.target.value as AssessmentStatus | "all",
                        )
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Topic
                      </label>
                      <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
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

                  <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
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
            onClick={handleCreateAssessment}
          >
            <GoPlus className="w-4 h-4" />
            <p className="text-sm font-semibold">Create assessment</p>
          </button>
        </section>

        {hasActiveFilters && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="text-sm text-gray-600 dark:text-gray-400">
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
                <p className="text-gray-300 dark:text-gray-600">
                  No assessments available
                </p>
              </div>
            ) : filteredAssessments.length === 0 ? (
              <div className="flex-1 min-h-full items-center justify-center flex">
                <div className="text-center">
                  <p className="text-gray-400 dark:text-gray-500 mb-2">
                    No assessments match your search criteria
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
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
                      <th className="bg-white dark:bg-gray-800 sticky top-0 z-20 w-[15%] xl:w-[20%] py-3 border-b border-gray-200 dark:border-gray-700">
                        Title
                      </th>
                      <th className="bg-white dark:bg-gray-800 sticky top-0 z-20 w-[15%] xl:w-[20%] py-3 border-b border-gray-200 dark:border-gray-700">
                        Topic
                      </th>
                      <th className="bg-white dark:bg-gray-800 sticky top-0 z-20 w-[15%] py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                        Sections
                      </th>
                      <th className="bg-white dark:bg-gray-800 sticky top-0 z-20 w-[10%] py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                        Status
                      </th>
                      <th className="bg-white dark:bg-gray-800 sticky top-0 z-20 w-[10%] py-3 border-b border-gray-200 dark:border-gray-700 text-center">
                        Deadline
                      </th>
                    </tr>
                  </thead>
                </table>
                <table className="font-primary table-auto w-full">
                  <tbody>
                    {filteredAssessments.map((assessment) => (
                      <AssessmentTableItem
                        key={assessment.id}
                        assessment={assessment}
                        onAssessmentClick={handleAssessmentClick}
                        onDeleteAssessment={onDeleteAssessment}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* draft decision modal */}
      <DraftDecisionModal
        isOpen={showDraftDecision}
        draft={existingDraft}
        onContinue={handleContinueDraft}
        onCreateNew={handleCreateNew}
        onClose={handleCloseDraftModal}
      />

      {/* assessment details modal */}
      {selectedAssessment && (
        <AssessmentDetailsModal
          isOpen={showDetailsModal}
          assessment={selectedAssessment}
          onClose={handleCloseModal}
          studentAttempts={studentAttempts}
          students={students}
          isLoadingAttempts={isLoadingAttempts}
        />
      )}
    </>
  );
}
