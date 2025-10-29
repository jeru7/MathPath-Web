import { type ReactElement } from "react";
import {
  FaStar,
  FaHourglassHalf,
  FaSkull,
  FaTrophy,
  FaTimes,
  FaMagic,
  FaGamepad,
} from "react-icons/fa";
import {
  useStudentAttemptStats,
  useStudentPlayerCard,
} from "../../../services/student-stats.service";
import { Student } from "../../../types/student.type";

type StatsOverviewCardProps = {
  student: Student;
};

export default function StatsOverviewCard({
  student,
}: StatsOverviewCardProps): ReactElement {
  const { data: attempts } = useStudentAttemptStats(student.id);
  const { data: playerCard } = useStudentPlayerCard(student.id);

  const formatPlaytime = (seconds?: number): string => {
    if (!seconds || isNaN(seconds)) return "0mins";

    const minutes = Math.floor(seconds / 60);
    const hours = seconds / 3600;

    if (minutes < 60) {
      return `${minutes}min${minutes !== 1 ? "s" : ""}`;
    }

    return `${hours.toFixed(1)}hrs`;
  };

  const stats = [
    {
      title: "Player Level",
      value: playerCard?.playerLevel || 0,
      icon: FaStar,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      title: "Total Attempts",
      value: attempts?.totalAttempts || 0,
      icon: FaSkull,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: "Win Rate",
      value: attempts?.winRate ? `${attempts.winRate}%` : "0%",
      icon: FaTrophy,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      title: "Playtime",
      value: formatPlaytime(playerCard?.totalPlaytime),
      icon: FaHourglassHalf,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Most Failed",
      value: playerCard?.mostFailedStage
        ? `Stage ${playerCard.mostFailedStage}`
        : "None",
      icon: FaTimes,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/30",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      title: "Most Played",
      value: playerCard?.mostPlayedStage
        ? `Stage ${playerCard.mostPlayedStage}`
        : "None",
      icon: FaGamepad,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
      borderColor: "border-indigo-200 dark:border-indigo-800",
    },
    {
      title: "Top Skill",
      value: playerCard?.mostUsedSkill || "None",
      icon: FaMagic,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <article className="bg-white dark:bg-gray-800 flex flex-col gap-4 w-full h-full p-3 rounded-sm transition-colors duration-200">
      <header>
        <p className="font-semibold text-lg text-gray-800 dark:text-gray-100 transition-colors duration-200">
          Overview
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 transition-colors duration-200">
          {student?.characterName
            ? `Player Name: ${student.characterName}`
            : "Player Stats"}
        </p>
      </header>

      <section className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-3 rounded-md border ${stat.bgColor} ${stat.borderColor} transition-colors duration-200`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 transition-colors duration-200">
                  {stat.title}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                  {stat.value}
                </p>
              </div>
              <stat.icon
                className={`text-lg ml-2 flex-shrink-0 ${stat.color} transition-colors duration-200`}
              />
            </div>
          </div>
        ))}
      </section>
    </article>
  );
}
