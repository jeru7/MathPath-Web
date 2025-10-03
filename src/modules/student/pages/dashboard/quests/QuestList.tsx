import { useState, type ReactElement } from "react";
import Select, { SingleValue } from "react-select";
import QuestItem from "./QuestItem";
import {
  FilterOption,
  filterOptions,
} from "../../../../core/types/select.type";
import { QuestListItem } from "../../../../core/types/quest/quest.type";
import { getCustomSelectColor } from "../../../../core/styles/selectStyles";
import { useStudentContext } from "../../../contexts/student.context";
import { useStudentQuestListTracker } from "../../../services/student-tracker.service";
import QuestChests from "./QuestChests";

export default function QuestList(): ReactElement {
  const { student } = useStudentContext();
  const { data: questList } = useStudentQuestListTracker(
    student ? student?.id : "",
  );
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  const filteredQuestList = questList?.quests.filter((quest: QuestListItem) => {
    if (selectedFilter.value === "all") return true;
    const isCompleted = quest.req === quest.reqCompleted;

    if (selectedFilter.value === "completed") return isCompleted;
    if (selectedFilter.value === "ongoing") return !isCompleted;

    return true;
  });

  return (
    <section className="flex-2 h-full bg-white rounded-sm shadow-sm p-3 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">Quests</h3>
        <Select
          options={filterOptions}
          value={selectedFilter}
          onChange={(option: SingleValue<FilterOption>) => {
            if (option) setSelectedFilter(option);
          }}
          styles={getCustomSelectColor<FilterOption>({
            borderRadius: "0.5rem",
            minHeight: "12px",
            menuWidth: "100%",
            menuBackgroundColor: "white",
          })}
          isMulti={false}
          className="w-32 text-xs"
          isSearchable={false}
          menuPlacement="auto"
        />
      </div>

      <div className="flex flex-col gap-2 flex-1 overflow-hidden">
        <QuestChests quest={questList} />
        <div className="grid grid-cols-2 gap-2 h-full overflow-y-auto no-scrollbar">
          {filteredQuestList?.map((quest, index) => (
            <QuestItem key={index} quest={quest} />
          ))}
        </div>
      </div>
    </section>
  );
}
