import { type ReactElement } from "react";

export default function Dashboard(): ReactElement {
  return (
    <main className="flex flex-col h-full w-full p-4 gap-4">
      {/* Header */}
      <header className="flex w-full items-center grow-[1] justify-between">
        <h3 className="text-2xl font-bold">Dashboard</h3>
      </header>
      <div className="w-full h-fit flex flex-col gap-3 pb-4">
        {/* Stats */}
        <section className="bg-white h-80 flex flex-col px-4 py-2 rounded-md shadow-md">
          <h4 className="font-semibold text-lg">Topic Stats</h4>
        </section>

        {/* Quest completion */}
        <section className="bg-white h-80 flex flex-col px-4 py-2 rounded-md shadow-md">
          <h4 className="font-semibold text-lg">Quest</h4>
        </section>

        {/* Activity Map */}
        <section className="bg-white h-80 flex flex-col px-4 py-2 rounded-md shadow-md">
          <h4 className="font-semibold text-lg">Activity Map</h4>
        </section>

        {/* Attempt History */}
        <section className="bg-white h-80 flex flex-col px-4 py-2 rounded-md shadow-md">
          <h4 className="font-semibold text-lg">Attempts</h4>
        </section>
      </div>
    </main>
  );
}
