import { type ReactElement } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import SectionCard from "./SectionCard";
import { Section } from "../../../../../core/types/section/section.type";

type SectionTableProps = {
  sections: Section[];
  onShowForm: () => void;
};

export default function SectionTable({
  sections,
  onShowForm,
}: SectionTableProps): ReactElement {
  return (
    <section className="h-full flex flex-col">
      <section className="w-full border-b-gray-200 p-4 border-b flex justify-between">
        {/* search */}
        <section className="flex gap-2 items-center w-full md:w-fit">
          <div className="flex rounded-sm border-gray-200 border h-fit items-center pr-2 w-full">
            <div className="p-2">
              <CiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              placeholder="Search student"
              className="text-xs focus:outline-none"
            />
          </div>

          {/* filter */}
          <button className="p-2 rounded-xs border-gray-200 border text-gray-400 h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200">
            <CiFilter className="w-4 h-4" />
          </button>
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
      <div className="h-[800px] overflow-y-auto">
        {sections.length > 0 ? (
          <section className="h-full w-full grid items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 grid-rows-[380px] gap-2 overflow-y-auto p-2">
            {sections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </section>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="italic text-gray-300">No data available</p>
          </div>
        )}
      </div>
    </section>
  );
}
