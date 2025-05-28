import { type ReactElement } from "react";

export default function Home(): ReactElement {
  return (
    <main className="flex flex-col h-full w-full p-4 gap-4">
      {/* Header */}
      <header className="flex w-full items-center justify-between">
        <h3 className="text-2xl font-bold">Overview</h3>
      </header>

      <div className="w-full h-full flex flex-col gap-3">
        {/* Top section */}
        <section className="w-full h-full flex flex-row gap-3">
          <section className="w-[70%] flex gap-3">
            {/* Section: Name and level */}
            <section className="w-[30%] h-full flex flex-col gap-3">
              {/* Name and section */}
              <article className="w-full h-full bg-white rounded-md shadow-md flex-col items-center justify-center flex gap-1">
                <div className="rounded-full bg-gray-100 h-[100px] w-[100px]"></div>
                <div className="flex flex-col items-center">
                  <p className="font-semibold text-lg">
                    John Emmanuel R. Ungab
                  </p>
                  <p className="font-semibold text-gray-300">CS601</p>
                </div>
              </article>

              {/* Level */}
              <article className="w-full h-full bg-white rounded-md shadow-md flex flex-col items-center justify-between gap-2 py-3 px-5">
                <p className="font-semibold">Level</p>
                <div className="rounded-full bg-[var(--secondary-green)] h-[100px] w-[100px] flex items-center justify-center">
                  <p className="text-white text-4xl">18</p>
                </div>
                <div className="flex flex-col w-full h-fit gap-1">
                  <div className="relative bg-gray-200 rounded-full h-2">
                    <div className="w-[50%] rounded-full bg-[var(--secondary-green)] h-full"></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>1234 exp to next level</p>
                    <p>50%</p>
                  </div>
                </div>
              </article>
            </section>

            {/* Character, IGN, and Inventory */}
            <article className="w-[70%] h-full bg-white rounded-md shadow-md p-2">
              <p className="font-semibold">Character and game stats</p>
            </article>
          </section>

          {/* Section: Important and Calendar */}
          <section className="w-[30%] h-full flex flex-col gap-3">
            {/* Important/Urgent alerts */}
            <article className="w-full h-[30%] rounded-md bg-white shadow-md p-2">
              <p className="font-semibold">Important</p>
            </article>

            {/* Calendar */}
            <article className="w-full h-full rounded-md bg-white shadow-md p-2">
              <p className="font-semibold">Calendar</p>
            </article>
          </section>
        </section>

        {/* Bottom section */}
        <section className="w-full h-full flex gap-3">
          <section className="w-[80%] h-full flex gap-3">
            {/* Quest */}
            <article className="w-full h-full bg-white rounded-md shadow-md p-2">
              <p className="font-semibold">Quest window</p>
            </article>

            {/* Section: Assessment, Game Levels, and Achievements */}
            <section className="w-full h-full flex flex-col gap-3">
              {/* Assessments */}
              <article className="w-full h-full rounded-md shadow-sm bg-white p-2">
                <p className="font-semibold">Assessment</p>
              </article>
              {/* Game Levels */}
              <article className="w-full h-full rounded-md shadow-sm bg-white p-2">
                <p className="font-semibold">Game Levels</p>
              </article>
              {/* Achievements */}
              <article className="w-full h-full rounded-md shadow-sm bg-white p-2">
                <p className="font-semibold">Achievements</p>
              </article>
            </section>
          </section>

          {/* Recent Activity */}
          <article className="w-[20%] p-2 h-full bg-white rounded-md shadow-md">
            <p className="font-semibold">Recent Activity</p>
          </article>
        </section>
      </div>
    </main>
  );
}
