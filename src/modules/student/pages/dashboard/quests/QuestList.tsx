import { useState, type ReactElement } from "react";
import QuestItem from "./QuestItem";
import { filterOptions } from "../../../../core/types/select.type";
import { QuestListItem } from "../../../../core/types/quest/quest.type";
import { useStudentContext } from "../../../contexts/student.context";
import { useStudentQuestListTracker } from "../../../services/student-tracker.service";
import QuestChests from "./QuestChests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuestList(): ReactElement {
  const { student } = useStudentContext();
  const { data: questList } = useStudentQuestListTracker(
    student ? student?.id : "",
  );
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredQuestList = questList?.quests.filter((quest: QuestListItem) => {
    if (selectedFilter === "all") return true;
    const isCompleted = quest.req === quest.reqCompleted;

    if (selectedFilter === "completed") return isCompleted;
    if (selectedFilter === "ongoing") return !isCompleted;

    return true;
  });

  return (
    <Card className="flex-2 h-full flex flex-col">
      <CardHeader className="pb-1 px-3 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-semibold">Quests</CardTitle>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-1 flex-1 overflow-hidden p-3 pt-0">
        <QuestChests quest={questList} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 h-full overflow-y-auto no-scrollbar">
          {filteredQuestList?.map((quest, index) => (
            <QuestItem key={index} quest={quest} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
