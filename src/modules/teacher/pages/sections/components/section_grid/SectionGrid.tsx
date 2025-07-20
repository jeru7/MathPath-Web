import { type ReactElement } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import SectionCard from "./SectionCard";
import { Section } from "../../../../../core/types/section/section.type";

interface ISectionGridProps {
  sections: Section[];
  setShowForm: (show: boolean) => void;
}

export default function SectionGrid({
  sections,
  setShowForm,
}: ISectionGridProps): ReactElement {
  return (
    <section className="h-full flex flex-col">
      <section className="w-full border-b-gray-200 p-4 border-b flex justify-between">
        {/* Search */}
        <section className="flex gap-2 items-center">
          <div className="flex rounded-sm border-gray-200 border h-fit items-center pr-2">
            <div className="p-2">
              <CiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              placeholder="Search section"
              className="text-xs focus:outline-none"
            />
          </div>
          {/* Filter */}
          <button className="p-2 rounded-xs border-gray-200 border text-gray-400 h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200">
            <CiFilter className="w-4 h-4" />
          </button>

          <section className="flex"></section>
        </section>
        {/* Create button */}
        <button
          className="flex gap-2 items-center justify-center py-3 px-4 bg-[var(--primary-green)]/90 rounded-sm text-white hover:cursor-pointer hover:bg-[var(--primary-green)] transition-all duration-200"
          onClick={() => setShowForm(true)}
        >
          <GoPlus className="w-4 h-4" />
          <p className="text-sm font-semibold">Create section</p>
        </button>
      </section>
      <div className="h-[800px] overflow-y-auto">
        <section className="h-full w-full grid grid-cols-5 grid-rows-[380px] gap-2 overflow-y-auto p-2">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </section>
      </div>
    </section>
  );
}
