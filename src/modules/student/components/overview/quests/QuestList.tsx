import { useState, type ReactElement } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { getCustomSelectColor } from "../../../../../styles/selectStyles";
import QuestChests from "./QuestChests";
import QuestItem from "./QuestItem";
import {
  useStudentContext,
  useStudentQuestList,
} from "../../../../../hooks/useStudent";
import { QuestListItem } from "../../../../../types/quest/quest.types";
import { filterOptions, FilterOption } from "../../../../../types/select.types";

export default function QuestList(): ReactElement {
  const { student } = useStudentContext();
  const { data: questList } = useStudentQuestList(student ? student?.id : "");
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const filteredQuestList = questList?.questList.filter(
    (quest: QuestListItem) => {
      if (selectedFilter.value === "all") return true;
      const isCompleted = quest.req === quest.reqCompleted;

      if (selectedFilter.value === "completed") return isCompleted;
      if (selectedFilter.value === "ongoing") return !isCompleted;

      return true;
    },
  );

  const customStyles: StylesConfig<FilterOption> =
    getCustomSelectColor<FilterOption>({
      borderRadius: "0.5rem",
      minHeight: "12px",
    });

  return (
    <section className="w-[40%] h-full bg-white rounded-md drop-shadow-sm px-4 py-2 gap-2 flex flex-col">
      <div className="w-full flex justify-between items-center pb-1 border-b-2 border-gray-300 hover:cursor-pointer">
        <p className="font-semibold">Quests</p>
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

      <div className="relative flex-col items-start flex pb-2 pt-16 px-2 overflow-y-auto overflow-x-hidden h-[360px]">
        {/* Quest Progress - Chest  */}
        <QuestChests quest={questList} />
        {/* Quest List - Grid */}
        <section className="grid grid-cols-3 gap-3 auto-rows-min w-full h-auto bg-white">
          {filteredQuestList?.map((quest: QuestListItem) => (
            <QuestItem key={quest.questName} quest={quest} />
          ))}
        </section>{" "}
      </div>
    </section>
  );
}
