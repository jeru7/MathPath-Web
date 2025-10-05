import { type ReactElement } from "react";
import {
  FaStar,
  FaHourglassHalf,
  FaSkull,
  FaTrophy,
  FaTimes,
  FaMagic,
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

  const stats = [
    {
      title: "Player Level",
      value: playerCard?.playerLevel || 0,
      icon: FaStar,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Total Attempts",
      value: attempts?.totalAttempts || 0,
      icon: FaSkull,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Win Rate",
      value: attempts?.winRate ? `${attempts.winRate}%` : "0%",
      icon: FaTrophy,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Playtime",
      value: playerCard?.totalPlaytime
        ? `${playerCard.totalPlaytime}hrs`
        : "0hrs",
      icon: FaHourglassHalf,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Most Failed",
      value: playerCard?.mostFailedStage
        ? `Stage ${playerCard.mostFailedStage}`
        : "None",
      icon: FaTimes,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Most Played",
      value: playerCard?.mostPlayedStage
        ? `Stage ${playerCard.mostPlayedStage}`
        : "None",
      icon: FaTrophy,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Top Skill",
      value: playerCard?.mostUsedSkill || "None",
      icon: FaMagic,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <article className="bg-white flex flex-col gap-4 w-full h-full p-3 rounded-sm">
      <header className="">
        <p className="font-semibold text-lg text-gray-800">Overview</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {student?.characterName
            ? `Player Name: ${student.characterName}`
            : "Player Stats"}
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-3 rounded-md border ${stat.bgColor} ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {stat.value}
                </p>
              </div>
              <stat.icon
                className={`text-lg ml-2 flex-shrink-0 ${stat.color}`}
              />
            </div>
          </div>
        ))}
      </section>
    </article>
  );
}
