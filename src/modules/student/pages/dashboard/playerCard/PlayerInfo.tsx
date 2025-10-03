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
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      icon: FaHourglassHalf,
      label: "Playtime",
      value: playerCardStats?.totalPlaytime
        ? `${playerCardStats.totalPlaytime}hrs`
        : "???",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: FaSkull,
      label: "Stages Completed",
      value: playerCardStats?.completedStagesCount ?? "???",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: FaTrophy,
      label: "Favorite Stage",
      value: playerCardStats?.mostPlayedStage ?? "???",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      icon: FaTimes,
      label: "Most Failed",
      value: playerCardStats?.mostFailedStage ?? "???",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      icon: FaMagic,
      label: "Top Skill",
      value: playerCardStats?.mostUsedSkill ?? "???",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      <h3 className="text-gray-900 font-bold text-sm">Stats Overview</h3>
      <div className="flex-1 grid grid-cols-2 gap-3">
        {allStats.map((stat) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center text-center p-4 rounded-sm border-1 ${stat.bgColor} ${stat.borderColor} min-h-[120px] justify-between`}
          >
            <div className="flex flex-col items-center gap-2">
              <stat.icon className={`text-2xl ${stat.color}`} />
              <div className="flex-1">
                <div className="text-gray-900 font-bold text-lg mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-xs font-medium uppercase tracking-wide">
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
