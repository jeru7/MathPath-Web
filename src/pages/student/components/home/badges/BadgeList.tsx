import { useState, type ReactElement } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { filterOptions, FilterOption } from "../../../../../types/select.type";
import BadgeItem from "./BadgeItem";
import { getCustomSelectColor } from "../../../../../styles/selectStyles";

// DONE: Badge Tracker (Achievements)
export default function BadgeList(): ReactElement {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  const customStyles: StylesConfig<FilterOption> =
    getCustomSelectColor<FilterOption>({
      borderRadius: "0.5rem",
      minHeight: "12px",
    });

  return (
    <section className="w-[40%] h-full bg-white rounded-md drop-shadow-sm flex flex-col px-4 py-2">
      <div className="w-full flex justify-between items-center pb-1 border-b-2 border-gray-300 hover:cursor-pointer">
        <p className="font-semibold">Badges</p>
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

      <section className="grid grid-cols-3 auto-rows-min overflow-y-auto gap-2 h-[350px] p-2 bg-white">
        <BadgeItem />
      </section>
    </section>
  );
}
