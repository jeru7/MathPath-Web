import { type ReactElement } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../../styles/customCalendar.css";
import { FaFile } from "react-icons/fa6";
import HalfCircleProgress from "./HalfCircleProgress";
import { IoGameController } from "react-icons/io5";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";

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
          <section className="w-[80%] flex gap-3">
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
                </div>{" "}
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

          {/* Section: Calendar and To-do*/}
          <section className="w-[20%] h-full flex flex-col gap-2">
            {/* Calendar */}
            <article className="w-full h-fit rounded-md bg-white shadow-md p-4 flex flex-col gap-8">
              <Calendar />
            </article>

            {/* To-do */}
            <article className="w-full h-full rounded-md shadow-md px-4 py-2 bg-white flex flex-col">
              <p className="font-semibold">To-do</p>
              <div className="w-full h-full flex items-center justify-start">
                <div className="flex gap-2 items-center justify-center">
                  <FaFile className="text-[var(--primary-green)]" />
                  <p className="hover:text-[var(--primary-green)] text-sm hover:cursor-pointer transition-colors duration-200">
                    1 Assessment due
                  </p>
                </div>
              </div>
            </article>
          </section>
        </section>

        {/* Bottom section */}
        <section className="w-full h-full flex gap-3">
          <section className="w-[80%] h-full flex gap-3">
            {/* Quests */}
            <article className="w-[40%] h-full bg-white rounded-md shadow-md px-4 py-2">
              <p className="font-semibold">Quests</p>
            </article>

            {/* Achievements */}
            <article className="w-[40%] h-full bg-white rounded-md shadow-md px-4 py-2">
              <p className="font-semibold">Achievements</p>
            </article>

            {/* Section: Assessment, Game Levels, and Achievements */}
            <section className="w-[20%] h-full flex flex-col gap-3">
              {/* Assessments */}
              <article className="w-full h-full rounded-md shadow-sm bg-white px-4 py-2 flex flex-col items-center">
                <p className="font-semibold">Assessments</p>
                <div className="w-full h-full flex items-center justify-center">
                  <HalfCircleProgress percentage={100} />
                </div>
              </article>
              {/* Game Levels */}
              <article className="w-full h-full rounded-md shadow-sm bg-white px-4 py-2 flex flex-col items-center">
                <p className="font-semibold">Game Levels</p>
                <div className="w-full h-full flex items-center justify-center">
                  <HalfCircleProgress percentage={80} />
                </div>
              </article>
            </section>
          </section>

          {/* Recent Activity */}
          <article className="w-[20%] p-4 flex flex-col h-full bg-white rounded-md shadow-md gap-2">
            <div className="w-full flex items-center justify-between border-b-gray-300 border-b-2 pb-2">
              <p className="font-semibold">Recent Activity</p>
              <div className="flex items-center">
                <p className="text-sm">Today</p>
                <RiArrowDropDownLine className="w-7 h-7" />
              </div>
            </div>

            <div className="h-full max-h-[350px] overflow-scroll pr-4">
              <div className="relative flex flex-col w-full h-fit">
                {/* Vertical Line */}
                <div
                  className="absolute left-2 top-0 w-1 rounded-full bg-[var(--secondary-green)]"
                  style={{ height: "calc(100% - 2rem)" }}
                ></div>

                {/* Activity List */}
                <div className="flex-col flex pl-8">
                  <div className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
                    <div className="absolute left-0.5 w-4 h-4 bg-[var(--secondary-green)] rounded-full z-10 transform"></div>
                    <div className="flex gap-2">
                      <FaEnvelopeOpenText className="text-[var(--primary-orange)] h-7 w-7" />
                      <div className="flex flex-col">
                        <p className="text-xs">Answered the new assessment</p>
                        <p className="text-xs text-gray-400">05/28/25</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">6:00 PM</p>
                  </div>

                  <div className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
                    <div className="absolute left-0.5 w-4 h-4 border-[var(--secondary-green)] border-2 bg-white rounded-full z-10 transform"></div>
                    <div className="flex gap-2">
                      <IoGameController className="text-[var(--primary-green)] h-7 w-7" />
                      <div className="flex flex-col">
                        <p className="text-xs">Completed level 5</p>
                        <p className="text-xs text-gray-400">05/28/25</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">6:00 PM</p>
                  </div>

                  <div className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
                    <div className="absolute left-0.5 w-4 h-4 border-[var(--secondary-green)] border-2 bg-white rounded-full z-10 transform"></div>
                    <div className="flex gap-2">
                      <IoGameController className="text-[var(--primary-green)] h-7 w-7" />
                      <div className="flex flex-col">
                        <p className="text-xs">Completed level 4</p>
                        <p className="text-xs text-gray-400">05/28/25</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">6:00 PM</p>
                  </div>

                  <div className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
                    <div className="absolute left-0.5 w-4 h-4 border-[var(--secondary-green)] border-2 bg-white rounded-full z-10 transform"></div>
                    <div className="flex gap-2">
                      <IoGameController className="text-[var(--primary-green)] h-7 w-7" />
                      <div className="flex flex-col">
                        <p className="text-xs">Completed level 3</p>
                        <p className="text-xs text-gray-400">05/28/25</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">6:00 PM</p>
                  </div>

                  <div className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
                    <div className="absolute left-0.5 w-4 h-4 border-[var(--secondary-green)] border-2 bg-white rounded-full z-10 transform"></div>
                    <div className="flex gap-2">
                      <IoGameController className="text-[var(--primary-green)] h-7 w-7" />
                      <div className="flex flex-col">
                        <p className="text-xs">Completed level 2</p>
                        <p className="text-xs text-gray-400">05/28/25</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">6:00 PM</p>
                  </div>

                  <div className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
                    <div className="absolute left-0.5 w-4 h-4 border-[var(--secondary-green)] border-2 bg-white rounded-full z-10 transform"></div>
                    <div className="flex gap-2">
                      <IoGameController className="text-[var(--primary-green)] h-7 w-7" />
                      <div className="flex flex-col">
                        <p className="text-xs">Completed level x</p>
                        <p className="text-xs text-gray-400">05/28/25</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">6:00 PM</p>
                  </div>

                  <div className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
                    <div className="absolute left-0.5 w-4 h-4 border-[var(--secondary-green)] border-2 bg-white rounded-full z-10 transform"></div>
                    <div className="flex gap-2">
                      <IoGameController className="text-[var(--primary-green)] h-7 w-7" />
                      <div className="flex flex-col">
                        <p className="text-xs">Completed level x</p>
                        <p className="text-xs text-gray-400">05/28/25</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">6:00 PM</p>
                  </div>

                  <div className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
                    <div className="absolute left-0.5 w-4 h-4 border-[var(--secondary-green)] border-2 bg-white rounded-full z-10 transform"></div>
                    <div className="flex gap-2">
                      <IoGameController className="text-[var(--primary-green)] h-7 w-7" />
                      <div className="flex flex-col">
                        <p className="text-xs">Completed level x</p>
                        <p className="text-xs text-gray-400">05/28/25</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="ml-auto text-sm underline text-gray-400 hover:cursor-pointer hover:text-gray-500 transition-colors duration-200">
              View all
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
