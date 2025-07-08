import { useState, type ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../core/styles/customDatePopper.css";
import Stepper from "./Stepper";
import PageCard from "./PageCard";
import Actions from "./Actions";
import AddQuestionModal from "./add_question/AddQuestionModal";

export default function CreateAssessment(): ReactElement {
  const [showAddQuestion, setShowAddQuestion] = useState<boolean>(false);

  return (
    <main className="flex h-full w-full flex-col gap-2 bg-inherit p-4">
      <header className="flex w-full items-center justify-between py-1">
        <h3 className="text-2xl font-bold">Create Assessment</h3>
      </header>

      <div className="flex h-full flex-col">
        <section className="flex justify-center relative">
          <button className="absolute py-1 px-4 border rounded-sm left-0 top-1/2 -translate-y-1/2">
            <p>Back</p>
          </button>
          <Stepper currentStep={1} />
        </section>
        <section className="bg-white shadow-sm rounded-sm h-full px-96 py-12 flex flex-col gap-4">
          {/* Initial page card */}
          <PageCard setShowAddQuestion={setShowAddQuestion} />

          {/* Actions */}
          <Actions />
        </section>
      </div>
      {showAddQuestion && (
        <AddQuestionModal setShowAddQuestion={setShowAddQuestion} />
      )}
    </main>
  );
}
