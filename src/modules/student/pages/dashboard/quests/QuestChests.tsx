import { type ReactElement } from "react";
import chestIcon from "../../../../../assets/icons/chest.png";
import { QuestList } from "../../../../core/types/quest/quest.type";

export default function QuestChests({
  quest,
}: {
  quest: QuestList | undefined;
}): ReactElement {
  const percentage = quest?.percentage ?? 0;

  return (
    <div className="w-full p-8 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm transition-colors duration-200">
      <div className="relative">
        {/* fill container */}
        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-600 transition-colors duration-200">
          {/* progress fill */}
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="absolute top-0 w-full h-full">
          {/* first */}
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              percentage >= 25 ? "scale-110" : "scale-100 opacity-60"
            } transition-transform duration-200`}
            style={{ left: "25%" }}
          >
            <div className="flex flex-col items-center">
              <img
                src={chestIcon}
                alt="Chest 1"
                className="h-6 w-6 drop-shadow-sm"
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-1 transition-colors duration-200">
                25%
              </span>
            </div>
            {percentage >= 25 && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-2 h-2 border border-white"></div>
            )}
          </div>

          {/* second */}
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              percentage >= 50 ? "scale-110" : "scale-100 opacity-60"
            } transition-transform duration-200`}
            style={{ left: "50%" }}
          >
            <div className="flex flex-col items-center">
              <img
                src={chestIcon}
                alt="Chest 2"
                className="h-6 w-6 drop-shadow-sm"
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-1 transition-colors duration-200">
                50%
              </span>
            </div>
            {percentage >= 50 && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-2 h-2 border border-white"></div>
            )}
          </div>

          {/* third */}
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              percentage >= 100 ? "scale-110" : "scale-100 opacity-60"
            } transition-transform duration-200`}
            style={{ left: "100%" }}
          >
            <div className="flex flex-col items-center -translate-x-1/2">
              <img
                src={chestIcon}
                alt="Chest 3"
                className="h-6 w-6 drop-shadow-sm"
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-1 transition-colors duration-200">
                100%
              </span>
            </div>
            {percentage >= 100 && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-2 h-2 border border-white"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
