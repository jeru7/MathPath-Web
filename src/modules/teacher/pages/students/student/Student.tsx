import { useEffect, useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "../../../../core/types/section/section.type";
import AttemptHistory from "./components/AttemptHistory";
import { useStudent } from "../../../../student/services/student.service";
import {
  useStudentAttemptStats,
  useStudentDifficultyFrequency,
} from "../../../../student/services/student-stats.service";
import { StudentStage } from "../../../../student/types/student.type";
import StudentHeatmap from "../../../../student/pages/statistics/components/StudentHeatmap";
import DifficultyFrequencyCard from "../../../../student/pages/statistics/components/DifficultyFrequencyCard";
import { useTeacherContext } from "../../../context/teacher.context";
import StudentQuestionStats from "../../../../student/pages/statistics/components/StudentQuestionStats";

export default function Student(): ReactElement {
  const navigate = useNavigate();
  const { sections } = useTeacherContext();
  const { studentId } = useParams();

  const { data: studentData, isLoading: studentDataLoading } = useStudent(
    studentId || "",
  );
  const { data: studentAttempt } = useStudentAttemptStats(studentId || "");
  const { data: difficultyFrequency, isLoading: difficultyLoading } =
    useStudentDifficultyFrequency(studentId || "");

  const [studentSection, setStudentSection] = useState<string>("");
  const [currentStage, setCurrentStage] = useState<number | undefined>(
    undefined,
  );

  const assessmentTakenCount =
    studentData?.assessments.filter(
      (assessment) => assessment.attempts.length > 0,
    ).length || 0;

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

  if (difficultyLoading || studentDataLoading || !studentId) {
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
        <DifficultyFrequencyCard data={difficultyFrequency} />

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
          <StudentQuestionStats studentId={studentId} />
        </section>

        {/* Heatmap section */}
        <section className="col-span-full rounded-sm bg-white shadow-sm">
          <StudentHeatmap studentId={studentId} />
        </section>

        {/* Recent attempt history section */}
        <section className="col-span-full rounded-sm flex flex-col bg-white h-[600px] shadow-sm">
          <AttemptHistory />
        </section>
      </main>
    </div>
  );
}
