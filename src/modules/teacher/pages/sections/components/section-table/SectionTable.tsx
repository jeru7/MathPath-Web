import { type ReactElement, useState, useMemo, useRef, useEffect } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import SectionCard from "./SectionCard";
import {
  Section,
  SectionColor,
} from "../../../../../core/types/section/section.type";

type SectionTableProps = {
  sections: Section[];
  onShowForm: () => void;
};

export default function SectionTable({
  sections,
  onShowForm,
}: SectionTableProps): ReactElement {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState<SectionColor | "all">(
    "all",
  );
  const [showFilters, setShowFilters] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

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

  const hasActiveFilters = searchTerm !== "" || selectedColor !== "all";

  const colorOptions: { value: SectionColor | "all"; color: string }[] = [
    { value: "all", color: "bg-gray-400" },
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

  return (
    <section className="h-full flex flex-col">
      <section className="w-full border-b-gray-200 p-4 border-b flex justify-between">
        {/* search and filters */}
        <section className="flex gap-2 items-center w-full md:w-fit">
          <div className="flex rounded-sm border-gray-200 border h-fit items-center pr-2 w-full">
            <div className="p-2">
              <CiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              placeholder="Search section by name"
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
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-30 w-48 p-4">
                {/* clear all filters */}
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

                {/* color filter with color chips only */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Colors
                  </label>
                  <div className="flex flex-wrap justify-center gap-3">
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`w-8 h-8 rounded-full ${option.color} border-2 transition-all duration-200 hover:scale-110 ${
                          selectedColor === option.value
                            ? "border-[var(--primary-green)] ring-2 ring-[var(--primary-green)] ring-opacity-50"
                            : "border-gray-300 hover:border-gray-400"
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
                <div className="text-xs text-gray-500 border-t pt-2 text-center">
                  {filteredSections.length} of {sections.length} sections
                </div>
              </div>
            )}
          </div>
        </section>

        {/* create button */}
        <button
          className="hidden md:flex gap-2 items-center justify-center py-3 px-4 bg-[var(--primary-green)]/90 rounded-sm text-white hover:cursor-pointer hover:bg-[var(--primary-green)] transition-all duration-200"
          onClick={onShowForm}
        >
          <GoPlus className="w-4 h-4" />
          <p className="text-sm font-semibold">Create section</p>
        </button>
      </section>

      {/* results info - enhanced banner */}
      {hasActiveFilters && (
        <div className="px-4 py-2 bg-blue-50 border-b">
          <div className="text-sm text-gray-600">
            {filteredSections.length} section
            {filteredSections.length !== 1 ? "s" : ""} found
            {searchTerm && ` for "${searchTerm}"`}
            {selectedColor !== "all" && " with filters applied"}
          </div>
        </div>
      )}

      <div className="h-[800px] overflow-y-auto">
        {sections.length > 0 ? (
          filteredSections.length > 0 ? (
            <section className="h-full w-full grid items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 grid-rows-[380px] gap-2 overflow-y-auto p-2">
              {filteredSections.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </section>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 mb-2">
                  No sections match your search criteria
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
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="italic text-gray-300">No data available</p>
          </div>
        )}
      </div>
    </section>
  );
}
