import { type ReactElement } from "react";

export default function Statistics(): ReactElement {
  return (
    <main className="flex flex-col min-h-screen h-fit w-full max-w-[2400px] gap-2 bg-inherit p-2">
      {/* header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
          Statistics
        </h3>
      </header>
    </main>
  );
}
