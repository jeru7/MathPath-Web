import { type ReactElement } from "react";

export default function Dashboard(): ReactElement {
  return (
    <main className="flex flex-col h-full w-full p-4 gap-4">
      {/* Header */}
      <header className="flex w-full items-center grow-[1] justify-between">
        <h3 className="text-2xl font-bold">Dashboard</h3>
      </header>
    </main>
  );
}
