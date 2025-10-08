import { type ReactElement } from "react";
import PlayerCard from "./playerCard/PlayerCard.tsx";
import QuestList from "./quests/QuestList.tsx";
import BadgeList from "./badges/BadgeList.tsx";
import Todo from "./todo/Todo.tsx";
import ActivityList from "../../../core/components/activity/ActivityList.tsx";
import CustomCalendar from "../../../core/components/calendar/CustomCalendar.tsx";
import { useStudentContext } from "../../contexts/student.context.tsx";
import ProfileCard from "./playerCard/ProfileCard.tsx";

export default function Dashboard(): ReactElement {
  const { student } = useStudentContext();
  if (!student?.id) return <div>Loading...</div>;

  return (
    <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-inherit p-2">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold dark:text-gray-300">
          Dashboard
        </h3>
      </header>

      <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-3 2xl:grid-cols-5 gap-2">
        {/* left */}
        <section className="col-span-1 md:col-span-3 lg:col-span-4 xl:col-span-2 2xl:col-span-4 flex flex-col gap-2 min-h-0">
          {/* top */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <ProfileCard student={student} />
              <PlayerCard />
            </div>
            <div className="min-h-0">
              <QuestList />
            </div>
          </section>

          {/* bottom */}
          <section className="flex-1 min-h-0">
            <BadgeList />
          </section>
        </section>

        {/* right */}
        <section className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-1 2xl:col-span-1 flex flex-col gap-2 h-fit xl:h-full">
          <section className="h-fit">
            <CustomCalendar />
          </section>
          <section className="h-fit">
            <Todo />
          </section>
          <section className="flex-1">
            <ActivityList type="Student" />
          </section>
        </section>
      </div>
    </main>
  );
}
