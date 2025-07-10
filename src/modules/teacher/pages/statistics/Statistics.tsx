import { type ReactElement } from "react";

export default function Statistics(): ReactElement {
  return (
    <main className="flex w-full flex-col gap-2 bg-inherit p-4 h-full">
      {/* Header */}
      <header className="flex w-full py-1 items-center justify-between">
        <h3 className="text-2xl font-bold">Statistics</h3>
      </header>

      {/* Stats */}
      <section className="w-full h-full"></section>
    </main>
  );
}
