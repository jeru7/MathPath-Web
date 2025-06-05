import { type ReactElement } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import ActivityItem from "./ActivityItem";

export default function ActivityList(): ReactElement {
  return (
    <article className="w-[20%] py-2 px-4 flex flex-col h-full bg-white rounded-md drop-shadow-sm gap-2">
      <div className="w-full flex items-start justify-between border-b-gray-300 border-b-2 pb-1">
        <p className="font-semibold">Recent Activity</p>
        <div className="flex items-center self-center hover:cursor-pointer">
          <p className="text-xs">Today</p>
          <RiArrowDropDownLine className="w-5 h-5" />
        </div>
      </div>

      <div className="h-full max-h-[350px] overflow-scroll pr-4">
        <div className="relative flex flex-col w-full h-fit">
          {/* Vertical Line */}
          <div
            className="absolute left-2 top-0 w-1 rounded-full bg-[var(--secondary-green)]"
            style={{ height: "calc(100% - 2rem)" }}
          ></div>

          {/* Activity List */}
          <div className="flex-col flex pl-8 h-fit">
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
            <ActivityItem />
          </div>
        </div>
      </div>
      <p className="ml-auto text-sm underline text-gray-400 hover:cursor-pointer hover:text-gray-500 transition-colors duration-200">
        View all
      </p>
    </article>
  );
}
