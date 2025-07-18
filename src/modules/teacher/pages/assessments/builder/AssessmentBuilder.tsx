import { useState, type ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../core/styles/customDatePopper.css";
import Stepper from "./components/Stepper";
import CreateAssessment from "./create";
import ConfigureAssessment from "./configure";
import PublishAssessment from "./publish";
import { FaEye } from "react-icons/fa";
export default function AssessmentBuilder(): ReactElement {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <main className="flex min-h-full w-full flex-col gap-2 bg-inherit p-4 h-fit">
      <header className="flex w-full items-center justify-between py-1">
        <h3 className="text-2xl font-bold">Create Assessment</h3>
      </header>

      <div className="flex min-h-full h-fit flex-col flex-1">
        <header className="flex justify-center relative">
          <button className="absolute py-1 px-4 border rounded-sm left-0 top-1/2 -translate-y-1/2">
            <p>Back</p>
          </button>
          <div className="relative">
            <Stepper
              currentStep={step}
              onChangeStep={(step: 1 | 2 | 3) => setStep(step)}
            />
            <button className="absolute flex gap-2 items-center text-gray-400 px-4 -right-30 top-1/2 -translate-y-1/2 hover:cursor-pointer hover:text-gray-500 transition-all duration-200">
              <FaEye />
              <p className="text-sm">Preview</p>
            </button>
          </div>
        </header>
        <section className="bg-white shadow-sm rounded-sm p-4 h-fit min-h-full flex-1">
          {step === 1 ? (
            <CreateAssessment />
          ) : step === 2 ? (
            <ConfigureAssessment />
          ) : step === 3 ? (
            <PublishAssessment />
          ) : null}
        </section>
      </div>
    </main>
  );
}
