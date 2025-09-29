import { useEffect, useState, type ReactElement } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "../../../../core/types/section/section.type";
import AttemptHistory from "./components/AttemptHistory";
import StudentHeatmap from "./components/StudentHeatmap";
import { useTeacherSections } from "../../../services/teacher.service";
import { useStudent } from "../../../../student/services/student.service";
import {
  useStudentAttemptStats,
  useStudentDifficultyFrequency,
} from "../../../../student/services/student-stats.service";
import { DifficultyFrequency } from "../../../../student/types/student-stats.type";
import { StudentStage } from "../../../../student/types/student.type";
import QuestionStatsChart from "./components/QuestionStatsChart";

const getDifficultyFrequency = (data: DifficultyFrequency | undefined) => {
  if (!data) {
    return (["easy", "medium", "hard"] as const).map((level) => ({
      frequency: level,
      value: 0,
    }));
  }

  return (["easy", "medium", "hard"] as const).map((level) => ({
    frequency: level,
    value: data[level].percentage,
  }));
};

export default function Student(): ReactElement {
  const navigate = useNavigate();
  const { studentId, teacherId } = useParams();
  const { data: studentData, isLoading: studentDataLoading } = useStudent(
    studentId || "",
  );
  const { data: studentAttempt } = useStudentAttemptStats(studentId || "");
  const { data: difficultyFrequency, isLoading: difficultyLoading } =
    useStudentDifficultyFrequency(studentId || "");
  const { data: sections } = useTeacherSections(teacherId || "");

  const [studentSection, setStudentSection] = useState<string>("");
  const [currentStage, setCurrentStage] = useState<number | undefined>(
    undefined,
  );

  const assessmentTakenCount = studentData?.assessments.filter((assessment) =>
    assessment.attempts.some((attempt) => attempt.status === "completed"),
  ).length;

  const difficultyFrequencyData = getDifficultyFrequency(difficultyFrequency);

  useEffect(() => {
    const getCurrentStage = () => {
      const allStages = studentData?.stages ?? [];

      const unlockedLevels = allStages
        .filter((stage: StudentStage) => stage.unlocked)
        .sort((a, b) => a.stage - b.stage);

      const latest = unlockedLevels.length
        ? unlockedLevels[unlockedLevels.length - 1]
        : undefined;

      setCurrentStage(latest?.stage);
    };

    const getStudentSection = () => {
      const currentSection: Section | undefined = sections?.find(
        (section) => section.id === studentData?.sectionId,
      );

      if (currentSection) {
        setStudentSection(currentSection.name);
      }
    };

    if (!studentDataLoading) {
      getCurrentStage();
      getStudentSection();
    }
  }, [studentData, sections, studentDataLoading]);

  const handleOnClickBackBtn = () => {
    navigate("..");
  };

  if (difficultyLoading || studentDataLoading) {
    return <p>loading..</p>;
  }

  return (
    <div className="flex h-fit min-h-full w-full flex-col gap-2 xl:gap-4 bg-inherit p-4">
      <div className="">
        <button
          onClick={handleOnClickBackBtn}
          className="border-1 px-4 py-1 opacity-80 rounded-sm transition-opacity duration-200 hover:cursor-pointer hover:opacity-100"
        >
          Back
        </button>
      </div>

      <main className="flex flex-col lg:grid h-fit min-h-full w-full auto-rows-auto grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {/* student info section */}
        <section className="lg:col-span-2 xl:col-span-3 flex flex-col items-center xl:flex-row gap-4 rounded-sm bg-white p-4 shadow-sm">
          <div className="w-fit">
            <div className="h-36 w-36 md:h-48 md:w-48 xl:h-56 xl:w-56 rounded-sm bg-black"></div>
          </div>
          <div className="flex flex-col w-fit sm:grid sm:grid-cols-2 gap-2 sm:gap-x-16 md:gap-x-32 xl:w-full xl:gap-4 xl:h-full">
            {/* Full Name */}
            <div className="flex items-center gap-1 xl:gap-2 text-base xl:text-xl">
              <p className="font-bold">Full Name:</p>
              <p className="truncate">{`${studentData?.lastName}, ${studentData?.firstName
                .split(" ")
                .map((word: string) => word[0].toUpperCase() + word.slice(1))
                .join(" ")}`}</p>
            </div>

            {/* Student No. */}
            <div className="flex items-center gap-1 xl:gap-2 text-base xl:text-xl">
              <p className="font-bold">LRN:</p>
              <p className="truncate">{studentData?.referenceNumber}</p>
            </div>

            {/* Current Stage */}
            <div className="flex items-center gap-1 xl:gap-2 text-base xl:text-xl">
              <p className="font-bold">Current Stage:</p>
              <p>{currentStage}</p>
            </div>

            {/* Section */}
            <div className="flex items-center gap-1 xl:gap-2 text-base xl:text-xl">
              <p className="font-bold">Section:</p>
              <p>{studentSection}</p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-1 xl:gap-2 text-base xl:text-xl">
              <p className="font-bold">Email:</p>
              <p className="truncate">{studentData?.email}</p>
            </div>

            {/* Player level */}
            <div className="flex items-center gap-1 xl:gap-2 text-base xl:text-xl">
              <p className="font-bold">Player Level:</p>
              <p>{studentData?.level}</p>
            </div>
          </div>
        </section>

        {/* radar section - difficulty frequency */}
        <section className="flex flex-col p-4 items-center rounded-sm bg-white shadow-sm relative">
          <header>
            <p className="font-semibold">Chosen difficulty frequency</p>
          </header>
          <ResponsiveContainer className="w-full h-full min-h-[200px] min-w-[200px]">
            <RadarChart
              cx="50%"
              cy="60%"
              outerRadius="80%"
              data={difficultyFrequencyData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="frequency" />
              <Radar
                dataKey="value"
                stroke="#f09319"
                fill="#ffa725"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-2 w-full text-gray-400 text-xs absolute bottom-6">
            <p>Easy: {difficultyFrequencyData[0].value}%</p>
            <p>Medium: {difficultyFrequencyData[1].value}%</p>
            <p>Hard: {difficultyFrequencyData[2].value}%</p>
          </div>
        </section>

        {/* Stats section */}
        <section className="col-span-full flex flex-col md:flex-row h-fit w-full gap-2">
          {/* Total attempts */}
          <div className="flex w-full gap-2 md:gap-0 md:flex-col items-center justify-center rounded-sm bg-white p-4 shadow-sm">
            <p className="text-lg xl:text-xl">
              Total Attempts<span className="md:hidden">:</span>
            </p>
            <p className="text-xl xl:text-2xl font-bold">
              {studentAttempt?.totalAttempts ?? 0}
            </p>
          </div>
          {/* Current Game Level */}
          <div className="flex w-full gap-2 md:gap-0 md:flex-col items-center justify-center rounded-sm bg-white p-4 shadow-sm">
            <p className="text-lg xl:text-xl">
              Win Rate<span className="md:hidden">:</span>
            </p>
            <p className="text-xl xl:text-2xl font-bold">
              {studentAttempt?.winRate ?? 0}%
            </p>
          </div>
          {/* Assessments taken */}
          <div className="flex w-full gap-2 md:gap-0 md:flex-col items-center justify-center rounded-sm bg-white p-4 shadow-sm">
            <p className="text-lg xl:text-xl text-nowrap">
              Assessments Taken<span className="md:hidden">:</span>
            </p>
            <p className="text-xl xl:text-2xl font-bold">
              {assessmentTakenCount}
            </p>
          </div>
          {/* Streak */}
          <div className="flex w-full gap-2 md:gap-0 md:flex-col items-center justify-center rounded-sm bg-white p-4 shadow-sm">
            <p className="text-lg xl:text-xl">
              Streak<span className="md:hidden">:</span>
            </p>
            <p className="text-xl xl:text-2xl font-bold">
              {studentData?.streak ?? 0}
            </p>
          </div>
        </section>

        {/* Charts section */}
        <section className="col-span-full row-span-2 rounded-sm bg-white shadow-sm">
          <QuestionStatsChart classNames="w-full h-full" />
        </section>

        {/* Heatmap section */}
        <section className="col-span-full rounded-sm bg-white shadow-sm">
          <StudentHeatmap />
        </section>

        {/* Recent attempt history section */}
        <section className="col-span-full rounded-sm flex flex-col bg-white h-[600px] shadow-sm">
          <AttemptHistory />
        </section>
      </main>
    </div>
  );
}
