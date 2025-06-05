import { type ReactElement } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import BadgeItem from "./BadgeItem";

export default function BadgeList(): ReactElement {
  return (
    <section className="w-[40%] h-full bg-white rounded-md drop-shadow-sm flex flex-col px-4 py-2">
      <div className="w-full flex justify-between items-start pb-1 border-b-2 border-gray-300 hover:cursor-pointer">
        <p className="font-semibold">Badges</p>
        <div className="flex items-center self-center">
          <p className="text-xs">Achieved</p>
          <RiArrowDropDownLine className="w-5 h-5" />
        </div>
      </div>

      <section className="grid grid-cols-3 auto-rows-min overflow-y-auto gap-2 h-[400px] p-2 bg-white">
        <BadgeItem />
      </section>
    </section>
  );
}
