import { useState, type ReactElement } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { FilterOption, filterOptions } from "../../types/select.types";
import { getCustomSelectColor } from "../../styles/selectStyles";
import Activity from "./Activity";

interface IActivityListProps {
  classes?: string;
  type: "Student" | "Teacher";
}

export default function ActivityList({
  classes,
  type,
}: IActivityListProps): ReactElement {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const customStyles: StylesConfig<FilterOption> =
    getCustomSelectColor<FilterOption>({
      borderRadius: "0.5rem",
      minHeight: "12px",
    });

  return (
    <article
      className={`${classes} w-[20%] py-2 px-4 flex flex-col h-full bg-white rounded-md drop-shadow-sm gap-2`}
    >
      <div className="w-full flex items-center justify-between border-b-gray-300 border-b-2 pb-1">
        <p className="font-semibold">Recent Activity</p>
        <Select
          options={filterOptions}
          value={selectedFilter}
          onChange={(option: SingleValue<FilterOption>) => {
            if (option) setSelectedFilter(option);
          }}
          isMulti={false}
          styles={customStyles}
          className="w-32 text-xs"
          isSearchable={false}
          menuPlacement="auto"
        />{" "}
      </div>

      <div
        className="h-full overflow-scroll pr-4"
        style={{
          maxHeight: `${type === "Teacher" ? "600px" : "350px"}`,
        }}
      >
        <div className="relative flex flex-col w-full h-fit">
          {/* Vertical Line */}
          <div
            className="absolute left-2 top-0 w-1 rounded-full bg-[var(--secondary-green)]"
            style={{ height: "calc(100% - 2rem)" }}
          ></div>

          {/* Activity List */}
          <div className="flex-col flex pl-8 h-fit">
            <Activity />
            <Activity />
            <Activity />
            <Activity />
            <Activity />
            <Activity />
            <Activity />
            <Activity />
            <Activity />
            <Activity />
            <Activity />
            <Activity />
            <Activity />
          </div>
        </div>
      </div>
      <p className="ml-auto text-sm underline text-gray-400 hover:cursor-pointer hover:text-gray-500 transition-colors duration-200">
        View all
      </p>
    </article>
  );
}
