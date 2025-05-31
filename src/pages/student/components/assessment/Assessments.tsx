import { type ReactElement } from "react";

export default function Assessments(): ReactElement {
  return (
    <main className="flex flex-col h-full w-full p-4 gap-4">
      {/* Header */}
      <header className="flex w-full items-center grow-[1] justify-between">
        <h3 className="text-2xl font-bold">Assessment</h3>
      </header>

      {/* Stats Overview - Totality */}
      <div className="w-full h-fit flex gap-3">
        <article className="bg-white rounded-md shadow-md w-full h-40 px-4 py-2">
          Total Assessments
        </article>
        <article className="bg-white rounded-md shadow-md w-full h-40 px-4 py-2">
          Pending Assessments
        </article>
        <article className="bg-white rounded-md shadow-md w-full h-40 px-4 py-2">
          Overall Correctness
        </article>
      </div>

      <section className="h-full bg-white rounded-md shadow-md px-4 py-2">
        Assessments List
      </section>
    </main>
  );
}
