import { useEffect, useState, type ReactElement } from "react";
import CreateSectionForm from "./components/CreateSectionForm";
import SectionGrid from "./components/section_grid/SectionGrid";
import { useTeacherContext } from "../../context/teacher.context";

export default function Sections(): ReactElement {
  const { sections } = useTeacherContext();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    console.log(sections);
  });
  return (
    <main className="flex h-full w-full flex-col gap-2 p-4">
      {/* Header */}
      <header className="flex w-full items-center justify-between py-1">
        <h3 className="text-2xl font-bold">Sections</h3>
      </header>

      {/* Section grid list */}
      <section className="bg-white h-full rounded-sm shadow-sm">
        <SectionGrid sections={sections} setShowForm={setShowForm} />
      </section>

      {showForm && <CreateSectionForm setShowForm={setShowForm} />}
    </main>
  );
}
