import { useState, type ReactElement } from "react";
import Select, { SingleValue } from "react-select";
import BadgeItem from "./BadgeItem";
import {
  FilterOption,
  filterOptions,
} from "../../../../core/types/select.type";
import { getCustomSelectColor } from "../../../../core/styles/selectStyles";

export default function BadgeList(): ReactElement {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  return (
    <article className="w-full h-full bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm flex flex-col p-3 overflow-hidden transition-colors duration-200">
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Badges
        </h3>
        <Select
          options={filterOptions}
          value={selectedFilter}
          onChange={(option: SingleValue<FilterOption>) => {
            if (option) setSelectedFilter(option);
          }}
          isMulti={false}
          styles={getCustomSelectColor<FilterOption>({
            borderRadius: "0.5rem",
            minHeight: "12px",
            menuWidth: "100%",
            dark: {
              backgroundColor: "#374151",
              textColor: "#f9fafb",
              borderColor: "#4b5563",
              borderFocusColor: "#10b981",
              optionHoverColor: "#374151",
              optionSelectedColor: "#059669",
              menuBackgroundColor: "#1f2937",
              placeholderColor: "#9ca3af",
            },
          })}
          className="w-32 text-xs"
          isSearchable={false}
          menuPlacement="auto"
        />
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 h-full">
          <div className="flex gap-3 items-start h-full w-full">
            <BadgeItem />
            <BadgeItem />
          </div>
        </div>
      </div>
    </article>
  );
}
