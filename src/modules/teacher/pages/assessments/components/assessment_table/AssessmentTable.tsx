import { type ReactElement } from "react";
import "../../../../../core/styles/customTable.css";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { NavigateFunction } from "react-router-dom";
import AssessmentTableItem from "./AssessmentTableItem";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";

type AssessmentTableProps = {
  navigate: NavigateFunction;
  assessments: Assessment[] | [];
};

export default function AssessmentTable({
  navigate,
  assessments,
}: AssessmentTableProps): ReactElement {
  return (
    <section className="h-full">
      <section className="w-full border-b-gray-200 p-4 border-b flex justify-between">
        {/* Search */}{" "}
        <section className="flex gap-2 items-center">
          <div className="flex rounded-sm border-gray-200 border h-fit items-center pr-2">
            <div className="p-2">
              <CiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              placeholder="Search assessment"
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
          onClick={() => navigate("create")}
        >
          <GoPlus className="w-4 h-4" />
          <p className="text-sm font-semibold">Create assessment</p>
        </button>
      </section>
      {/* table */}
      <div className="h-full">
        <div className="overflow-x-auto min-h-full flex flex-col">
          {/* headers */}
          <table className="font-primary table-auto w-full">
            <thead className="text-gray-400">
              <tr className="text-left">
                <th className="bg-white sticky top-0 z-20 w-[30%]">Title</th>
                <th className="bg-white sticky top-0 z-20 w-[30%]">Topic</th>
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
          {/* assessment items/list */}
          <div
            className={`max-h-[800px] overflow-y-auto pb-4 ${assessments.length === 0 ? "flex-1 flex" : ""}`}
          >
            {assessments.length === 0 ? (
              <div className="flex-1 min-h-full items-center justify-center flex">
                <p className="text-gray-300">No data available</p>
              </div>
            ) : (
              <table className="font-primary table-auto w-full">
                <tbody>
                  {assessments.map((assessment) => (
                    <AssessmentTableItem assessment={assessment} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
