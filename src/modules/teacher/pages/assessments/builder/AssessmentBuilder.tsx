import { useState, type ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../core/styles/customDatePopper.css";
import Stepper from "./components/Stepper";
import CreateAssessment from "./create";
import { MdKeyboardArrowRight } from "react-icons/md";
import ConfigureAssessment from "./configure";
import PublishAssessment from "./publish";
export default function AssessmentBuilder(): ReactElement {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <main className="flex h-fit w-full flex-col gap-2 bg-inherit p-4 min-h-screen">
      <header className="flex w-full items-center justify-between py-1">
        <h3 className="text-2xl font-bold">Create Assessment</h3>
      </header>

      <div className="flex h-full flex-col">
        <section className="flex justify-center relative">
          <button className="absolute py-1 px-4 border rounded-sm left-0 top-1/2 -translate-y-1/2">
            <p>Back</p>
          </button>
          <Stepper currentStep={step} />
        </section>
        <div className="bg-white shadow-sm rounded-sm overflow-hidden p-4">
          {step === 1 ? (
            <CreateAssessment />
          ) : step === 2 ? (
            <ConfigureAssessment />
          ) : step === 3 ? (
            <PublishAssessment />
          ) : null}
        </div>
        <div className="w-full h-12 flex items-center justify-end">
          <button
            className="flex items-center gap-1 py-1 px-3 text-white bg-[var(--primary-green)]/80 rounded-sm hover:cursor-pointer hover:bg-[var(--primary-green)] transition-colors duration-200"
            type="button"
            onClick={() => setStep(2)}
          >
            <p className="text-base font-semibold">Next</p>
            <MdKeyboardArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
