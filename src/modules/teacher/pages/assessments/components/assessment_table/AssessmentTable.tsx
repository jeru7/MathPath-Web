import { type ReactElement, useState, useMemo, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { GoPlus, GoArchive } from "react-icons/go";
import { NavigateFunction } from "react-router-dom";
import AssessmentTableItem from "./AssessmentTableItem";
import {
  Assessment,
  AssessmentStatus,
} from "../../../../../core/types/assessment/assessment.type";
import DraftDecisionModal from "../DraftDecisionModal";
import { useDeleteAssessment } from "../../../../services/teacher-assessment.service";
import { useTeacherContext } from "../../../../context/teacher.context";
import { motion, AnimatePresence } from "framer-motion";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

type AssessmentTableProps = {
  navigate: NavigateFunction;
  assessments: Assessment[] | [];
  onAssessmentClick: (assessment: Assessment) => void;
  onArchiveAssessment?: (assessment: Assessment) => void;
  showArchive?: boolean;
  hideFab?: boolean;
};

export default function AssessmentTable({
  navigate,
  assessments,
  onAssessmentClick,
  onArchiveAssessment,
  showArchive = false,
  hideFab = false,
}: AssessmentTableProps): ReactElement {
  const { teacherId } = useTeacherContext();
  const { mutate: deleteAssessment } = useDeleteAssessment(teacherId ?? "");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    AssessmentStatus | "all"
  >("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showDraftDecision, setShowDraftDecision] = useState(false);
  const [existingDraft, setExistingDraft] = useState<Assessment | null>(null);
  const [showMobileFab, setShowMobileFab] = useState(!hideFab);
  const [expandFab, setExpandFab] = useState(false);

  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const mobileFabRef = useRef<HTMLDivElement>(null);

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

  const handleCreateAssessment = () => {
    const draftAssessments = assessments.filter(
      (assessment: Assessment) => assessment.status === "draft",
    );

    if (draftAssessments.length > 0) {
      const existingDraft = draftAssessments[0];
      setExistingDraft(existingDraft);
      setShowDraftDecision(true);
    } else {
      navigate("new/create");
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
          navigate("new/create");
        },
        onError: (error) => {
          console.error("Failed to delete draft:", error);
        },
      });
    } else {
      navigate("new/create");
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

  useEffect(() => {
    if (hideFab) {
      setShowMobileFab(false);
      setExpandFab(false);
    } else {
      setShowMobileFab(true);
    }
  }, [hideFab]);

  const hasActiveFilters =
    selectedStatus !== "all" || selectedTopic !== "all" || searchTerm !== "";

  const showNoDataAvailable =
    assessments.length === 0 || filteredAssessments.length === 0;

  return (
    <>
      <section className="flex flex-col flex-1">
        <section className="w-full border-b-gray-200 dark:border-b-gray-700 p-4 border-b flex justify-between transition-colors duration-200 h-20 items-center">
          {/* search and filters */}
          <section className="relative flex gap-2 items-center w-full md:w-fit">
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
              <div
                className="absolute w-full top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm shadow-lg z-30 p-4 transition-colors duration-200"
                ref={filterDropdownRef}
              >
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
          </section>

          {/* archive button and create button */}
          <div className="hidden md:flex gap-2 items-center">
            {/* archive button */}
            {showArchive && (
              <button
                className="p-2 rounded-xs border-gray-200 dark:border-gray-600 border text-gray-400 dark:text-gray-500 h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200 bg-white dark:bg-gray-800"
                onClick={() => navigate("archives")}
              >
                <GoArchive className="w-4 h-4" />
              </button>
            )}

            {/* create button */}
            <button
              className="hidden md:flex gap-2 items-center justify-center py-3 px-4 bg-[var(--primary-green)]/90 rounded-sm text-white hover:cursor-pointer hover:bg-[var(--primary-green)] transition-all duration-200"
              onClick={handleCreateAssessment}
            >
              <GoPlus className="w-4 h-4" />
              <p className="text-sm font-semibold">Create assessment</p>
            </button>
          </div>
        </section>

        {/* results info */}
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

        {!showNoDataAvailable ? (
          <div className="flex-1 flex flex-col overflow-auto">
            <div className="min-h-full flex flex-col flex-1 min-w-[1000px]">
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
                        onAssessmentClick={onAssessmentClick}
                        onArchiveAssessment={onArchiveAssessment}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 w-full items-center justify-center">
            <div className="text-center">
              <p className="text-gray-300 dark:text-gray-600 italic mb-2">
                No data available
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
        )}
      </section>

      {/* floating action buttons for mobile */}
      <AnimatePresence>
        {!hideFab && showMobileFab && (
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
                {/* archive button */}
                {showArchive && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center w-14 h-14 bg-inherit dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
                    onClick={() => {
                      navigate("archives");
                      setShowMobileFab(false);
                    }}
                    title="Archive"
                  >
                    <GoArchive className="w-5 h-5" />
                  </motion.button>
                )}

                {/* create assessment button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center w-14 h-14 bg-inherit dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
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

            {/* main fab toggle button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`flex items-center justify-center w-14 h-14 rounded-full shadow-sm bg-[var(--primary-green)] text-white`}
              onClick={() => setExpandFab(!expandFab)}
              title={expandFab ? "Close" : "Menu"}
            >
              {expandFab ? <FaCaretDown /> : <FaCaretUp />}
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* draft decision modal */}
      <DraftDecisionModal
        isOpen={showDraftDecision}
        draft={existingDraft}
        onContinue={handleContinueDraft}
        onCreateNew={handleCreateNew}
        onClose={handleCloseDraftModal}
      />
    </>
  );
}
