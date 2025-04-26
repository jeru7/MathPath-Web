import { type ReactElement } from "react"
import { useNavigate } from "react-router-dom"
import AddButton from "../AddButton"

export default function CreateAssessment(): ReactElement {
  const navigate = useNavigate()

  const handleCreateBtn = () => {
    alert("Created")
  }

  const handleBackBtn = () => {
    navigate("..")
  }
  return (
    <div className="flex h-fit min-h-full w-full flex-col gap-4 bg-inherit p-4">
      <div className="flex justify-between">
        <div>
          <button
            onClick={handleBackBtn}
            className="border-1 px-4 py-1 opacity-80 rounded-sm transition-opacity duration-200 hover:cursor-pointer hover:opacity-100">
            Back
          </button>
        </div>
        <AddButton text="Create Assessment Form" action={handleCreateBtn} />
      </div>
      <main >
        {/* Title section */}
        <section></section>

        {/* Per question section */}

      </main>
    </div>
  )
}
