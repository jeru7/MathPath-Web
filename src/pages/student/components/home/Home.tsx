import { useEffect, useState, type ReactElement } from "react";

import PlayerCard from "./playerCard/PlayerCard.tsx";
import Todo from "./Todo.tsx";
import StudentCalendar from "./StudentCalendar.tsx";
import QuestList from "./quests/QuestList.tsx";
import BadgeList from "./badges/BadgeList.tsx";
import ProgressCard from "./progressCards/ProgressCard.tsx";
import ActivityList from "./activities/ActivityList.tsx";
import { useStudentContext } from "../../../../hooks/useStudent.ts";
import { capitalizeWord } from "../../../../utils/string.utils.ts";
import { getSection } from "../../../../services/section.service.ts";
import { ISection } from "../../../../types/section.type.ts";

export default function Home(): ReactElement {
  const { student } = useStudentContext();
  const [section, setSection] = useState<ISection | null>(null);

  const currentExp = student?.exp.currentExp ?? 0;
  const nextLevelExp = student?.exp.nextLevelExp ?? 1;
  const expPercentage = Math.round((currentExp / nextLevelExp) * 100);

  useEffect(() => {
    const fetchSection = async () => {
      if (student?.section) {
        const data = await getSection(student.section);
        setSection(data);
      }
    };

    fetchSection();
  }, [student?.section]);

  if (!student?._id) return <div>Loading...</div>;

  return (
    <main className="flex flex-col h-full w-full p-4 gap-4">
      {/* Header */}
      <header className="flex w-full items-center justify-between">
        <h3 className="text-2xl font-bold">Overview</h3>
      </header>

      <div className="w-full h-full flex flex-col gap-3">
        {/* Top section */}
        <section className="w-full h-full flex flex-row gap-3">
          <section className="w-[80%] flex gap-3">
            {/* Section: Name and level */}
            <section className="w-[30%] h-full flex flex-col gap-3">
              {/* Name and section */}
              <article className="w-full h-full bg-white rounded-md drop-shadow-sm flex-col items-center justify-center flex gap-1">
                <div className="rounded-full bg-gray-100 h-[100px] w-[100px]"></div>
                <div className="flex flex-col items-center">
                  <p className="font-semibold text-lg">
                    {capitalizeWord(student?.firstName.toString())}{" "}
                    {student?.middleName?.charAt(0).toUpperCase()}.{" "}
                    {capitalizeWord(student?.lastName.toString())}
                  </p>
                  <p className="font-semibold text-gray-300">{section?.name}</p>
                </div>
              </article>

              {/* Level */}
              <article className="w-full h-full bg-white rounded-md drop-shadow-sm flex flex-col items-center justify-between gap-2 py-3 px-5">
                <p className="font-semibold">Level</p>
                <div className="rounded-full bg-[var(--secondary-green)] h-[100px] w-[100px] flex items-center justify-center">
                  <p className="text-white text-4xl">{student?.level}</p>
                </div>
                <div className="flex flex-col w-full h-fit gap-1">
                  {/* Exp Bar */}
                  <div className="relative bg-gray-200 rounded-full h-2">
                    <div
                      className="rounded-full bg-[var(--secondary-green)] h-full"
                      style={{ width: `${expPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-semibold">
                    <p>
                      {currentExp}/{nextLevelExp}
                    </p>
                    <p>{expPercentage}%</p>
                  </div>
                </div>
              </article>
            </section>

            {/* PlayerCard: Player info and Player character display */}
            <PlayerCard studentId={student._id} />
          </section>

          {/* Section: Calendar and To-do*/}
          <section className="w-[20%] h-full flex flex-col gap-3">
            {/* Calendar */}
            <StudentCalendar />

            {/* To-do */}
            <Todo />
          </section>
        </section>

        {/* Bottom section */}
        <div className="w-full h-full flex gap-3">
          <div className="w-[80%] h-full flex gap-3">
            {/* Quests */}
            <QuestList />

            {/* Badges */}
            <BadgeList />

            {/* Section: Assessment and Stages */}
            <section className="w-[20%] h-full flex flex-col gap-3">
              {/* Assessments */}
              <ProgressCard title="Assessment" />
              {/* Stages */}
              <ProgressCard title="Stages" />
            </section>
          </div>

          {/* Recent Activity */}
          <ActivityList />
        </div>
      </div>
    </main>
  );
}
