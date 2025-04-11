import { useState, type ReactElement } from "react"
import AddButton from "../AddButton"
import AddSectionForm from "./AddSectionForm";
import { useTeacherContext } from "../../../../hooks/useTeacherData";
import SectionCard from "./SectionCard";

export default function Sections(): ReactElement {
  const { sections } = useTeacherContext();
  const [showForm, setShowForm] = useState(false);

  return <main className="flex h-full w-full flex-col gap-4 p-4">
    {/* Header */}
    <header className="flex w-full items-center justify-between">
      <h3 className="text-2xl font-bold">Sections</h3>
      <AddButton
        text={"Add Sections"} action={() => setShowForm(true)} />
    </header>

    {/* Section lists */}
    <section className="grid grid-cols-4 gap-4 overflow-y-auto p-2">
      {sections.map((section) => (
        < SectionCard key={section._id} section={section} />
      ))}
    </section>

    {showForm && <AddSectionForm setShowForm={setShowForm} />}
  </main>
}
