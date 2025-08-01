import { useEffect, useRef, useState, type ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../core/styles/customDatePopper.css";
import Stepper from "./components/Stepper";
import Create from "./create/Create";
import Configure from "./configure/Configure";
import Publish from "./publish/Publish";
import { FaEye } from "react-icons/fa";
import { useAssessmentBuilder } from "./context/assessment-builder.context";
import { useAssessmentValidation } from "./hooks/useAssessmentValidation";
import {
  usePublishAssessment,
  useUpdateAssessmentDraft,
} from "../../../../core/services/assessments/assessment.service";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

export default function AssessmentBuilder(): ReactElement {
  const navigate = useNavigate();

  // states
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { state: assessment } = useAssessmentBuilder();
  const [isValidated, setIsValidated] = useState<boolean>(false);

  const { mutate: publishAssessment } = usePublishAssessment(
    assessment.teacher,
  );
  const { mutate: updateDraft } = useUpdateAssessmentDraft(
    assessment.teacher ?? "",
  );
  const hasMounted = useRef(false);
  const prevAssessmentRef = useRef<string>();

  const debouncedUpdate = useRef(
    debounce((updatedAssessent: Assessment) => {
      updateDraft(updatedAssessent);
    }, 10000),
  );

  // error trackers
  const createErrors = useAssessmentValidation(assessment, 1);
  const configureErrors = useAssessmentValidation(assessment, 2);
  const publishErrors = useAssessmentValidation(assessment, 3);

  // handlers
  const handlePublishAssessment = () => {
    const hasError =
      Object.keys(createErrors).length > 0 ||
      Object.keys(configureErrors).length > 0 ||
      Object.keys(publishErrors).length > 0;

    setIsValidated(true);

    if (hasError) return;
    publishAssessment(assessment, {
      onSuccess: () => {
        navigate("..");
      },
    });
  };

  useEffect(() => {
    if (!assessment.id) return;

    const serialized = JSON.stringify(assessment);

    if (hasMounted.current) {
      if (prevAssessmentRef.current !== serialized) {
        prevAssessmentRef.current = serialized;
        debouncedUpdate.current(assessment);
      }
    } else {
      prevAssessmentRef.current = serialized;
      hasMounted.current = true;
    }
  }, [assessment]);

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
              createErrors={
                Array.isArray(createErrors.emptyPages)
                  ? createErrors.emptyPages.length
                  : 0
              }
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
              onPublishAssessment={handlePublishAssessment}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}
