import { type ReactElement } from "react";

export default function Statistics(): ReactElement {
  return (
    <main className="flex flex-col min-h-screen h-full w-full max-w-[2200px] gap-2 bg-inherit p-4">
      {/* Header */}
      <header className="flex items-center justify-between py-1">
        <h3 className="text-xl sm:text-2xl font-bold">Statistics</h3>
      </header>

      {/* Stats */}
      <section className="w-full h-full"></section>
    </main>
  );
}
