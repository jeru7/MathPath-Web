import { type ReactElement } from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import StudentChart from "./StudentChart"

// sample data for difficulty frequency
const sampleFrequency = [
  { frequency: "easy", value: 25 },
  { frequency: "medium", value: 25 },
  { frequency: "hard", value: 50 },
]

export default function Student(): ReactElement {
  return <div className="flex h-fit min-h-full w-full flex-col gap-4 bg-inherit p-4">
    <div>
      <button className="border-1 px-4 py-1 opacity-80 transition-opacity duration-200 hover:cursor-pointer hover:opacity-100">
        Back
      </button>
    </div>
    <main className="grid h-fit w-full auto-rows-auto grid-cols-4 gap-4 px-32">

      {/* Student info section */}
      <section className="col-span-3 flex gap-4 rounded-xl bg-white p-8 drop-shadow-sm">
        {/* TODO: */}
        <div className="w-fit">
          <div className="h-56 w-56 rounded-xl bg-black"></div>
        </div>
        <div className="grid w-full grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Full Name:</p>
            <p>Ungab, John Emmanuel</p>
          </div>

          {/* Student No. */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Student No:</p>
            <p>02000284765</p>
          </div>

          {/* Username */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Username:</p>
            <p>jeru07</p>
          </div>

          {/* Current Game Level */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Current Game Level:</p>
            <p>13</p>
          </div>

          {/* Section */}
          <div className="flex items-center gap-2 text-xl">
            <p className="font-bold">Section:</p>
            <p>CS601</p>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-xl">
            <p className="text-xl font-bold">Email:</p>
            <p>sample@sample.com</p>
          </div>

          {/* Player level */}
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">Player Level:</p>
            <p>7</p>
          </div>
        </div>
      </section>

      {/* Radar section - difficulty frequency */}
      <section className="flex flex-col p-8 items-center rounded-xl bg-white drop-shadow-sm relative">
        <header><p className="font-semibold">Chosen difficulty frequency</p></header>
        <ResponsiveContainer className="w-full h-full">
          <RadarChart cx="50%" cy="60%" outerRadius="80%" data={sampleFrequency}>
            <PolarGrid />
            <PolarAngleAxis dataKey="frequency" />
            <Radar dataKey="value" stroke="#f09319" fill="#ffa725" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-2 w-full text-gray-400 text-xs absolute bottom-6">
          <p>Easy: {sampleFrequency[0].value}%</p>
          <p>Medium: {sampleFrequency[1].value}%</p>
          <p>Hard: {sampleFrequency[2].value}%</p>
        </div>
      </section>

      {/* Stats section */}
      <section className="col-span-full flex h-fit w-full gap-4">
        {/* TODO: */}
        {/* Total attempts */}
        <div className="flex w-full flex-col items-center justify-center rounded-xl bg-white py-4 drop-shadow-sm">
          <p className="text-xl">Total Attempts</p>
          <p className="text-2xl font-bold">23</p>
        </div>
        {/* Current Game Level */}
        <div className="flex w-full flex-col items-center justify-center rounded-xl bg-white py-4 drop-shadow-sm">
          <p className="text-xl">Win Rate</p>
          <p className="text-2xl font-bold">87%</p>
        </div>
        {/* Assessments taken */}
        <div className="flex w-full flex-col items-center justify-center rounded-xl bg-white py-4 drop-shadow-sm">
          <p className="text-xl">Assessments Taken</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        {/* Streak */}
        <div className="flex w-full flex-col items-center justify-center rounded-xl bg-white py-4 drop-shadow-sm">
          <p className="text-xl">Streak</p>
          <p className="text-2xl font-bold">11</p>
        </div>
      </section>

      {/* Charts section */}
      <section className="col-span-full row-span-2 rounded-xl bg-white drop-shadow-sm">
        <StudentChart classNames="w-full h-full" />
      </section>

      {/* Heatmap section */}
      <section className="col-span-full rounded-xl bg-white drop-shadow-sm">
        {/* TODO: */}
        {/* Heatmap */}
        <p>Heatmap</p>
      </section>

      {/* Recent attempt history section */}
      <section className="col-span-full row-span-2 rounded-xl bg-white drop-shadow-sm">
        {/* TODO: */}
        {/* History */}
        <p>History</p>
      </section>
    </main>
  </div>
}
