import { useState, type ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../core/styles/customDatePopper.css";
import Stepper from "./components/Stepper";
import Create from "./create/Create";
import Configure from "./configure/Configure";
import Publish from "./publish/Publish";
import { FaEye } from "react-icons/fa";
import { useAssessmentBuilder } from "./context/assessment-builder.context";
import { useAssessmentValidation } from "./hooks/useAssessmentValidation";

export default function AssessmentBuilder(): ReactElement {
  // states
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { state: assessment } = useAssessmentBuilder();
  const [isValidated, setIsValidated] = useState<boolean>(false);

  // error trackers
  const createErrors = useAssessmentValidation(assessment, 1);
  const configureErrors = useAssessmentValidation(assessment, 2);
  const publishErrors = useAssessmentValidation(assessment, 3);

  // handlers
  const handleCreateAssessment = () => {
    const hasError =
      Object.keys(createErrors).length > 0 ||
      Object.keys(configureErrors).length > 0 ||
      Object.keys(publishErrors).length > 0;

    setIsValidated(true);

    if (hasError) return;

    console.log("Assessment: ", assessment);
  };

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
              isValidated={isValidated}
              createErrors={Object.keys(createErrors).length}
              configureErrors={Object.keys(configureErrors).length}
              publishErrors={Object.keys(publishErrors).length}
            />
            <button className="absolute flex gap-2 items-center text-gray-400 px-4 -right-30 top-1/2 -translate-y-1/2 hover:cursor-pointer hover:text-gray-500 transition-all duration-200">
              <FaEye />
              <p className="text-sm">Preview</p>
            </button>
          </div>
        </header>
        <section className="bg-white shadow-sm rounded-sm p-4 h-fit min-h-full flex-1 flex justify-center">
          {step === 1 ? (
            <Create isValidated={isValidated} errors={createErrors} />
          ) : step === 2 ? (
            <Configure isValidated={isValidated} errors={configureErrors} />
          ) : step === 3 ? (
            <Publish
              isValidated={isValidated}
              errors={publishErrors}
              onCreateAssessment={handleCreateAssessment}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}
