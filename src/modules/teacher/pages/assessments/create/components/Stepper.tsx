import { type ReactElement } from "react";

interface ICreateAssessmentStepperProps {
  currentStep: number;
}
export default function Stepper({
  currentStep,
}: ICreateAssessmentStepperProps): ReactElement {
  return (
    <section className="flex rounded-sm">
      {/* Step 1 */}
      <article
        className="border-t border-l border-gray-300 flex px-4 py-2 rounded-tl-sm gap-2 bg-white items-center w-[200px]"
        style={{
          opacity: getOpacity(currentStep, 1),
          borderBottom: currentStep === 1 ? "0px" : "1px solid #D1D5DB",
        }}
      >
        <div className="flex">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: getCircleColor(currentStep, 1) }}
          >
            <p className="text-white text-xl font-bold">1</p>
          </div>
        </div>
        <div className="flex flex-col font-semibold text-lg">
          <p className="text-base font-semibold">Create</p>
        </div>
      </article>
      {/* Step 2 */}
      <article
        className="border border-gray-300 flex px-4 py-2 bg-white gap-2 items-center w-[200px]"
        style={{
          opacity: getOpacity(currentStep, 2),
          borderBottom: currentStep === 2 ? "0px" : "1px solid #D1D5DB",
        }}
      >
        <div className="flex">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: getCircleColor(currentStep, 2) }}
          >
            <p className="text-white text-xl font-bold">2</p>
          </div>
        </div>
        <div className="flex flex-col text-lg">
          <p className="text-base font-semibold">Configure</p>
        </div>
      </article>
      {/* Step 3 */}
      <article
        className="flex px-4 rounded-tr-sm border-t border-r border-b border-gray-300 gap-2 bg-white items-center w-[200px]"
        style={{
          opacity: getOpacity(currentStep, 3),
          borderBottom: currentStep === 3 ? "0px" : "1px solid #D1D5DB",
        }}
      >
        <div className="flex">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: getCircleColor(currentStep, 3) }}
          >
            <p className="text-white text-xl font-bold">3</p>
          </div>
        </div>
        <div className="flex flex-col font-semibold text-lg">
          <p className="text-base font-semibold">Publish</p>
        </div>
      </article>
    </section>
  );
}

const getCircleColor = (currentStep: number, step: number): string => {
  if (currentStep < step) {
    return "#D1D5DB";
  } else if (currentStep > step) {
    return "var(--primary-green)";
  } else {
    return "var(--primary-yellow)";
  }
};

const getOpacity = (currentStep: number, step: number): string => {
  if (currentStep >= step) {
    return "100%";
  } else {
    return "50%";
  }
};
