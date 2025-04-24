import { useEffect, useState, type ReactElement } from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import StudentChart from "./StudentChart"
import { useNavigate, useParams } from "react-router-dom"
import { useStudentData, useStudentDifficultyFrequency, useStudentTotalGameAttempt } from "../../../../hooks/useStudent"
import { useTeacherSections } from "../../../../hooks/useTeacher"
import { ISection } from "../../../../types/section.type"
import { IDifficultyFrequency } from "../../../../types/student.type"
import StudentHeatmap from "./StudentHeatmap"
import StudentAttemptHistory from "./StudentAttemptHistory"

const getDifficultyFrequency = (data: IDifficultyFrequency | undefined) => {
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
  const { data: studentData, isLoading: studentDataLoading } = useStudentData(studentId || "")
  const { data: studentAttempt } = useStudentTotalGameAttempt(studentId || "")
  const { data: difficultyFrequency, isLoading: difficultyLoading } = useStudentDifficultyFrequency(studentId || "")
  const { data: sections } = useTeacherSections(teacherId || "")

  const [studentSection, setStudentSection] = useState<string>("")
  const [currentGameLevel, setCurrentGameLevel] = useState<number | undefined>(undefined)

  const difficultyFrequencyData = getDifficultyFrequency(difficultyFrequency)

  useEffect(() => {
    const getCurrentGameLevel = () => {
      const allLevels = studentData?.gameLevels ?? [];

      console.log("all:", allLevels)

      const unlockedLevels = allLevels.filter(level => level.unlocked);

      console.log("unlocked:", unlockedLevels)

      const latest = unlockedLevels.length
        ? unlockedLevels[unlockedLevels.length - 1]
        : undefined;

      console.log("latest", studentData?.gameLevels)
      setCurrentGameLevel(latest?.level);
    };

    const getStudentSection = () => {
      const currentSection: ISection | undefined = sections?.find(section => section._id === studentData?.section);

      if (currentSection) {
        setStudentSection(currentSection.name);
      }
    }

    if (!studentDataLoading) {
      getCurrentGameLevel();
      getStudentSection();
    }

  }, [studentData, sections, studentDataLoading])

  const handleOnClickBackBtn = () => {
    navigate("..")
  }

  if (difficultyLoading || studentDataLoading) {
    return <p>loading..</p>
  }


  return <div className="flex h-fit min-h-full w-full flex-col gap-4 bg-inherit p-4">
    <div>
      <button
        onClick={handleOnClickBackBtn}
        className="border-1 px-4 py-1 opacity-80 rounded-sm transition-opacity duration-200 hover:cursor-pointer hover:opacity-100">
        Back
      </button>
    </div>
    <main className="grid h-fit w-full auto-rows-auto grid-cols-4 gap-4 px-32">

      {/* Student info section */}
      <section className="col-span-3 flex gap-4 rounded-sm bg-white p-8 drop-shadow-sm">
        {/* TODO: */}
        <div className="w-fit">
          <div className="h-56 w-56 rounded-sm bg-black"></div>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Full Name:</p>
            <p>{`${studentData?.lastName}, ${studentData?.firstName
              // capitalize lang first letter each word
              .split(' ')
              .map(word => word[0].toUpperCase() + word.slice(1))
              .join(' ')}`}</p>
          </div>

          {/* Student No. */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Student No:</p>
            <p>{studentData?.studentNumber}</p>
          </div>

          {/* Username */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Username:</p>
            <p>{studentData?.username}</p>
          </div>

          {/* Current Game Level */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Current Game Level:</p>
            <p>{currentGameLevel}</p>
          </div>

          {/* Section */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Section:</p>
            <p>{studentSection}</p>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Email:</p>
            <p>{studentData?.email}</p>
          </div>

          {/* Player level */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Player Level:</p>
            <p>{studentData?.level}</p>
          </div>
        </div>
      </section>

      {/* Radar section - difficulty frequency */}
      <section className="flex flex-col p-8 items-center rounded-sm bg-white drop-shadow-sm relative">
        <header><p className="font-semibold">Chosen difficulty frequency</p></header>
        <ResponsiveContainer className="w-full h-full">
          <RadarChart cx="50%" cy="60%" outerRadius="80%" data={difficultyFrequencyData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="frequency" />
            <Radar dataKey="value" stroke="#f09319" fill="#ffa725" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-2 w-full text-gray-400 text-xs absolute bottom-6">
          <p>Easy: {difficultyFrequencyData[0].value}%</p>
          <p>Medium: {difficultyFrequencyData[1].value}%</p>
          <p>Hard: {difficultyFrequencyData[2].value}%</p>
        </div>
      </section>

      {/* Stats section */}
      <section className="col-span-full flex h-fit w-full gap-4">
        {/* TODO: */}
        {/* Total attempts */}
        <div className="flex w-full flex-col items-center justify-center rounded-sm bg-white py-4 drop-shadow-sm">
          <p className="text-xl">Total Attempts</p>
          <p className="text-2xl font-bold">{studentAttempt?.totalAttempts ?? 0}</p>
        </div>
        {/* Current Game Level */}
        <div className="flex w-full flex-col items-center justify-center rounded-sm bg-white py-4 drop-shadow-sm">
          <p className="text-xl">Win Rate</p>
          <p className="text-2xl font-bold">{studentAttempt?.winRate ?? 0}%</p>
        </div>
        {/* Assessments taken */}
        <div className="flex w-full flex-col items-center justify-center rounded-sm bg-white py-4 drop-shadow-sm">
          <p className="text-xl">Assessments Taken</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        {/* Streak */}
        <div className="flex w-full flex-col items-center justify-center rounded-sm bg-white py-4 drop-shadow-sm">
          <p className="text-xl">Streak</p>
          <p className="text-2xl font-bold">{studentData?.streak}</p>
        </div>
      </section>

      {/* Charts section */}
      <section className="col-span-full row-span-2 rounded-sm bg-white drop-shadow-sm">
        <StudentChart classNames="w-full h-full" />
      </section>

      {/* Heatmap section */}
      <section className="col-span-full rounded-sm bg-white drop-shadow-sm">
        <StudentHeatmap />
      </section>

      {/* Recent attempt history section */}
      <section className="col-span-full rounded-sm bg-white drop-shadow-sm">
        <StudentAttemptHistory />
      </section>
    </main>
  </div>
}
