import { type ReactElement } from "react";
import {
  FaStar,
  FaHourglassHalf,
  FaSkull,
  FaTrophy,
  FaTimes,
  FaMagic,
} from "react-icons/fa";
import { useStudentPlayerCard } from "../../../services/student-stats.service";
import { useStudentContext } from "../../../contexts/student.context";

export default function PlayerInfo(): ReactElement {
  const { studentId } = useStudentContext();
  const { data: playerCardStats } = useStudentPlayerCard(studentId);

  const allStats = [
    {
      icon: FaStar,
      label: "Player Level",
      value: playerCardStats?.playerLevel ?? "???",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      icon: FaHourglassHalf,
      label: "Playtime",
      value: playerCardStats?.totalPlaytime
        ? `${playerCardStats.totalPlaytime}hrs`
        : "???",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: FaSkull,
      label: "Stages Completed",
      value: playerCardStats?.completedStagesCount ?? "???",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      icon: FaTrophy,
      label: "Favorite Stage",
      value: playerCardStats?.mostPlayedStage ?? "???",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      icon: FaTimes,
      label: "Most Failed",
      value: playerCardStats?.mostFailedStage ?? "???",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/30",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      icon: FaMagic,
      label: "Top Skill",
      value: playerCardStats?.mostUsedSkill ?? "???",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      <h3 className="text-gray-900 dark:text-gray-100 font-bold text-sm transition-colors duration-200">
        Stats Overview
      </h3>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allStats.map((stat) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center text-center p-4 rounded-sm border-1 ${stat.bgColor} ${stat.borderColor} min-h-[120px] justify-between transition-colors duration-200`}
          >
            <div className="flex flex-col items-center gap-2">
              <stat.icon className={`text-2xl ${stat.color}`} />
              <div className="flex-1">
                <div className="text-gray-900 dark:text-gray-100 font-bold text-lg mb-1 transition-colors duration-200">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wide transition-colors duration-200">
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
