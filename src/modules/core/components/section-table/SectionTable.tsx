import { type ReactElement, useState, useMemo, useRef, useEffect } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus, GoArchive } from "react-icons/go";
import SectionItem from "./SectionItem";
import { Section, SectionColor } from "../../types/section/section.type";
import { Student } from "../../../student/types/student.type";
import { Assessment } from "../../types/assessment/assessment.type";
import { toast } from "react-toastify";
import { Teacher } from "../../../teacher/types/teacher.type";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

export type SectionTableContext = {
  onlineStudents: Student[];
  students: Student[];
  assessments: Assessment[];
  teachers?: Teacher[];
  sections: Section[];
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
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFab, setShowMobileFab] = useState(!hideFab);
  const [expandFab, setExpandFab] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const mobileFabRef = useRef<HTMLDivElement>(null);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedColor("all");
  };

  const handleCreateSection = () => {
    if (userType === "teacher") {
      onShowForm();
      return;
    }

    // check if there are any teachers available
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

  const hasActiveFilters = searchTerm !== "" || selectedColor !== "all";

  const colorOptions: { value: SectionColor | "all"; color: string }[] = [
    { value: "all", color: "bg-gray-400 dark:bg-gray-600" },
    { value: "primary-green", color: "bg-[var(--primary-green)]" },
    { value: "tertiary-green", color: "bg-[var(--tertiary-green)]" },
    { value: "primary-orange", color: "bg-[var(--primary-orange)]" },
    { value: "primary-yellow", color: "bg-[var(--primary-yellow)]" },
  ];

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

  const showNoDataAvailable =
    sections.length === 0 || filteredSections.length === 0;

  return (
    <section className="flex flex-col flex-1">
      <section className="w-full border-b-gray-200 dark:border-b-gray-700 p-4 border-b flex justify-between transition-colors duration-200 h-20 items-center">
        {/* search and filters */}
        <section className="relative flex gap-2 items-center w-full md:w-fit">
          <div className="flex rounded-sm border-gray-200 dark:border-gray-600 border h-fit items-center pr-2 w-full bg-white dark:bg-gray-800 transition-colors duration-200">
            <div className="p-2">
              <CiSearch className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              placeholder="Search section"
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
              className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm shadow-lg z-30 p-4 transition-colors duration-200"
              ref={filterDropdownRef}
            >
              {/* clear all filters */}
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

              {/* color filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Colors
                </label>
                <div className="flex flex-wrap justify-center gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`w-8 h-8 rounded-full ${option.color} border-2 transition-all duration-200 hover:scale-110 ${selectedColor === option.value
                          ? "border-[var(--primary-green)] dark:border-green-400 ring-2 ring-[var(--primary-green)] dark:ring-green-400 ring-opacity-50 dark:ring-opacity-50"
                          : "border-gray-300 dark:border-gray-500 hover:border-gray-400 dark:hover:border-gray-400"
                        }`}
                      onClick={() => setSelectedColor(option.value)}
                      title={
                        option.value === "all"
                          ? "All colors"
                          : option.value.replace("-", " ")
                      }
                    />
                  ))}
                </div>
              </div>

              {/* results count */}
              <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2 text-center">
                {filteredSections.length} of {sections.length} sections
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
            className="flex gap-2 items-center justify-center py-3 px-4 bg-[var(--primary-green)]/90 rounded-sm text-white hover:cursor-pointer hover:bg-[var(--primary-green)] transition-all duration-200"
            onClick={handleCreateSection}
          >
            <GoPlus className="w-4 h-4" />
            <p className="text-sm font-semibold">Create section</p>
          </button>
        </div>
      </section>

      {/* results info */}
      {hasActiveFilters && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredSections.length} section
            {filteredSections.length !== 1 ? "s" : ""} found
            {searchTerm && ` for "${searchTerm}"`}
            {selectedColor !== "all" && " with filters applied"}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col max-h-[800px] overflow-auto">
        {!showNoDataAvailable ? (
          <section className="h-full w-full grid items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 grid-rows-[380px] gap-2 overflow-y-auto p-2">
            {filteredSections.map((section) => (
              <SectionItem
                key={section.id}
                section={section}
                onClick={() => onSectionClick(section)}
                context={context}
              />
            ))}
          </section>
        ) : (
          <div className="flex-1 flex w-full items-center justify-center">
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
      </div>

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

                {/* create section button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center w-14 h-14 bg-inherit dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
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
    </section>
  );
}
