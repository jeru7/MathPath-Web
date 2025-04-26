import { type ReactElement } from "react";
import AddButton from "../AddButton";
import { useNavigate } from "react-router-dom";

export default function Assessments(): ReactElement {
  const navigate = useNavigate();

  const handleCreateButton = () => {
    navigate("create")
  }

  return (
    <main className="flex flex-col h-full w-full p-4 gap-4">
      {/* Header */}
      <header className="flex w-full items-center justify-between">
        <h3 className="text-2xl font-bold">Assessments</h3>
        <AddButton text={"Create new form"} action={() => handleCreateButton()} />
      </header>

      {/* Chart section */}
      <section className="bg-white rounded-md shadow-sm w-full h-full">

      </section>

      {/* Table section */}
      <section className="bg-white rounded-md shadow-sm w-full h-full">

      </section>
    </main>
  )
}
