import { type ReactElement } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import QuestChests from "./QuestChests";
import QuestItem from "./QuestItem";
import {
  useStudentContext,
  useStudentQuestList,
} from "../../../../../hooks/useStudent";
import { IStudentQuestListItem } from "../../../../../types/student.type";

export default function QuestList(): ReactElement {
  const { student } = useStudentContext();
  const { data: questList } = useStudentQuestList(student ? student?._id : "");
  console.log(questList);

  return (
    <section className="w-[40%] h-full bg-white rounded-md drop-shadow-sm px-4 py-2 gap-2 flex flex-col">
      <div className="w-full flex justify-between items-start pb-1 border-b-2 border-gray-300 hover:cursor-pointer">
        <p className="font-semibold">Quests</p>
        <div className="flex items-center">
          <p className="text-xs">Completed</p>
          <RiArrowDropDownLine className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-col gap-4 flex pb-2 pt-3 px-2 overflow-y-auto h-[390px]">
        {/* Quest Progress - Chest  */}
        <QuestChests questData={questList?.questProgress} />
        {/* Quest List - Grid */}
        <section className="grid grid-cols-3 auto-rows-min gap-2 w-full h-auto bg-white">
          {questList?.questList.map((quest: IStudentQuestListItem) => (
            <QuestItem quest={quest} />
          ))}
        </section>
      </div>
    </section>
  );
}
