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
              <article className="w-full h-full bg-white rounded-md drop-shadow-sm flex-col items-center justify-center flex gap-1">
                <div className="rounded-full bg-gray-100 h-[100px] w-[100px]"></div>
                <div className="flex flex-col items-center">
                  <p className="font-semibold text-lg">
                    John Emmanuel R. Ungab
                  </p>
                  <p className="font-semibold text-gray-300">CS601</p>
                </div>{" "}
              </article>

              {/* Level */}
              <article className="w-full h-full bg-white rounded-md drop-shadow-sm flex flex-col items-center justify-between gap-2 py-3 px-5">
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
            <article className="w-[70%] h-full bg-white rounded-md drop-shadow-sm p-2">
              <p className="font-semibold">Character and game stats</p>
            </article>
          </section>

          {/* Section: Calendar and To-do*/}
          <section className="w-[20%] h-full flex flex-col gap-3">
            {/* Calendar */}
            <article className="w-full h-fit rounded-md bg-white drop-shadow-sm p-4 flex flex-col gap-8">
              <Calendar />
            </article>

            {/* To-do */}
            <article className="w-full h-full rounded-md drop-shadow-sm px-4 py-2 bg-white flex flex-col gap-1">
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
        <div className="w-full h-full flex gap-3">
          <div className="w-[80%] h-full flex gap-2">
            {/* Quests */}
            <section className="w-[40%] h-full bg-white rounded-md drop-shadow-sm px-4 py-2 gap-2 flex flex-col">
              <div className="w-full flex justify-between items-start pb-1 border-b-2 border-gray-300">
                <p className="font-semibold">Quests</p>
                <div className="flex items-center self-center">
                  <p className="text-xs">Completed</p>
                  <RiArrowDropDownLine className="w-5 h-5" />
                </div>
              </div>

              <div className="flex-col gap-4 flex pb-2 pt-3 px-2 overflow-y-auto h-[390px]">
                {/* Quest Progress - Chest  */}
                <article className="w-full py-2 h-10 flex items-center">
                  <div className="w-full h-2 rounded-full bg-[var(--secondary-orange)] relative">
                    <div className="h-full bg-[var(--primary-orange)] rounded-full w-[50%]"></div>

                    <div className="w-full flex items-center justify-around absolute inset-0 top-0">
                      <div className="rounded-md h-10 w-10 bg-[var(--primary-orange)]"></div>
                      <div className="rounded-md h-10 w-10 bg-[var(--primary-orange)]"></div>
                      <div className="rounded-md h-10 w-10 bg-[var(--primary-orange)]"></div>
                    </div>
                  </div>
                </article>

                {/* Quest List - Grid */}
                <section className="grid grid-cols-3 auto-rows-min gap-2 w-full h-auto bg-white">
                  <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                    <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                      <IoGameController className="h-12 w-12" />
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex flex-col items-center">
                        <p className="font-semibold text-md">Quest Name</p>
                        <p className="text-xs text-gray-400">Claimed</p>
                      </div>
                    </div>

                    <div className="w-full flex gap-1 items-center">
                      <div className="w-full rounded-full bg-gray-200 h-2">
                        <div className="h-full bg-[var(--primary-green)] rounded-full w-full"></div>
                      </div>

                      <div className="text-xs text-gray-400">1/1</div>
                    </div>
                  </article>

                  <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                    <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                      <IoGameController className="h-12 w-12" />
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex flex-col items-center">
                        <p className="font-semibold text-md">Quest Name</p>
                        <p className="text-xs text-gray-400">Claimed</p>
                      </div>
                    </div>

                    <div className="w-full flex gap-1 items-center">
                      <div className="w-full rounded-full bg-gray-200 h-2">
                        <div className="h-full bg-[var(--primary-green)] rounded-full w-full"></div>
                      </div>

                      <div className="text-xs text-gray-400">1/1</div>
                    </div>
                  </article>

                  <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                    <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                      <IoGameController className="h-12 w-12" />
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex flex-col items-center">
                        <p className="font-semibold text-md">Quest Name</p>
                        <p className="text-xs text-gray-400">Not claimed yet</p>
                      </div>
                    </div>

                    <div className="w-full flex gap-1 items-center">
                      <div className="w-full rounded-full bg-gray-200 h-2">
                        <div className="h-full bg-[var(--primary-green)] rounded-full w-[0%]"></div>
                      </div>

                      <div className="text-xs text-gray-400">0/1</div>
                    </div>
                  </article>

                  <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                    <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                      <IoGameController className="h-12 w-12" />
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex flex-col items-center">
                        <p className="font-semibold text-md">Quest Name</p>
                        <p className="text-xs text-gray-400">Not claimed yet</p>
                      </div>
                    </div>

                    <div className="w-full flex gap-1 items-center">
                      <div className="w-full rounded-full bg-gray-200 h-2">
                        <div className="h-full bg-[var(--secondary-green)] rounded-full w-[66%]"></div>
                      </div>

                      <div className="text-xs text-gray-400">2/3</div>
                    </div>
                  </article>
                </section>
              </div>
            </section>

            {/* Badges */}
            <section className="w-[40%] h-full bg-white rounded-md drop-shadow-sm flex flex-col px-4 py-2">
              <div className="w-full flex justify-between items-start pb-1 border-b-2 border-gray-300">
                <p className="font-semibold">Badges</p>
                <div className="flex items-center self-center">
                  <p className="text-xs">Achieved</p>
                  <RiArrowDropDownLine className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-3 auto-rows-min overflow-y-auto gap-2 h-[400px] p-2 bg-white">
                <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                  <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                    <IoGameController className="h-12 w-12" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-md">Badges Name</p>
                      <p className="text-xs text-gray-400">
                        Badges Description
                      </p>
                    </div>
                  </div>

                  <div className="w-full rounded-full bg-gray-200 h-2">
                    <div className="h-full bg-[var(--primary-green)] rounded-full w-full"></div>
                  </div>
                </article>

                <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                  <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                    <IoGameController className="h-12 w-12" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-base">Badges Name</p>
                      <p className="text-xs text-gray-400">
                        Badges Description
                      </p>
                    </div>
                  </div>

                  <div className="w-full rounded-full bg-gray-200 h-2">
                    <div className="h-full bg-[var(--primary-green)] rounded-full w-full"></div>
                  </div>
                </article>

                <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                  <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                    <IoGameController className="h-12 w-12" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-base">Badges Name</p>
                      <p className="text-xs text-gray-400">
                        Badges Description
                      </p>
                    </div>
                  </div>

                  <div className="w-full rounded-full bg-gray-200 h-2">
                    <div className="h-full bg-[var(--primary-green)] rounded-full w-full"></div>
                  </div>
                </article>

                <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                  <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                    <IoGameController className="h-12 w-12" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-base">Badges Name</p>
                      <p className="text-xs text-gray-400">
                        Badges Description
                      </p>
                    </div>
                  </div>

                  <div className="w-full rounded-full bg-gray-200 h-2">
                    <div className="h-full bg-[var(--secondary-green)] rounded-full w-[50%]"></div>
                  </div>
                </article>

                <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                  <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                    <IoGameController className="h-12 w-12" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-base">Badges Name</p>
                      <p className="text-xs text-gray-400">
                        Badges Description
                      </p>
                    </div>
                  </div>

                  <div className="w-full rounded-full bg-gray-200 h-2">
                    <div className="h-full bg-[var(--secondary-green)] rounded-full w-[50%]"></div>
                  </div>
                </article>

                <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                  <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                    <IoGameController className="h-12 w-12" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-base">Badges Name</p>
                      <p className="text-xs text-gray-400">
                        Badges Description
                      </p>
                    </div>
                  </div>

                  <div className="w-full rounded-full bg-gray-200 h-2">
                    <div className="h-full bg-[var(--secondary-green)] rounded-full w-[50%]"></div>
                  </div>
                </article>

                <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
                  <div className="rounded-full flex items-center h-fit w-fit justify-center p-3 bg-amber-400">
                    <IoGameController className="h-12 w-12" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-base">Badges Name</p>
                      <p className="text-xs text-gray-400">
                        Badges Description
                      </p>
                    </div>
                  </div>

                  <div className="w-full rounded-full bg-gray-200 h-2">
                    <div className="h-full bg-[var(--secondary-green)] rounded-full w-[50%]"></div>
                  </div>
                </article>
              </div>
            </section>

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
          </div>

          {/* Recent Activity */}
          <article className="w-[20%] py-2 px-4 flex flex-col h-full bg-white rounded-md drop-shadow-sm gap-2">
            <div className="w-full flex items-start justify-between border-b-gray-300 border-b-2 pb-1">
              <p className="font-semibold">Recent Activity</p>
              <div className="flex items-center self-center">
                <p className="text-xs">Today</p>
                <RiArrowDropDownLine className="w-5 h-5" />
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
        </div>
      </div>
    </main>
  );
}
