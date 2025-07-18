import { type ReactElement } from "react";

interface ICreateAssessmentStepperProps {
  currentStep: number;
  onChangeStep: (step: 1 | 2 | 3) => void;
}
export default function Stepper({
  currentStep,
  onChangeStep,
}: ICreateAssessmentStepperProps): ReactElement {
  return (
    <section className="flex rounded-sm">
      {/* Step 1 */}
      <button
        className={`flex px-4 py-2 border-t border-l border-gray-300 gap-2 bg-white items-center w-[200px] ${getOpacity(currentStep, 2)} hover:opacity-80 hover:cursor-pointer transition-colors duration-200`}
        type="button"
        style={{
          opacity: getOpacity(currentStep, 1),
          borderBottom: currentStep === 1 ? "0px" : "1px solid #D1D5DB",
        }}
        onClick={() => onChangeStep(1)}
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
      </button>
      {/* Step 2 */}
      <button
        className={`flex px-4 py-2 border border-gray-300 gap-2 bg-white items-center w-[200px] ${getOpacity(currentStep, 2)} hover:opacity-80 hover:cursor-pointer transition-colors duration-200`}
        type="button"
        style={{
          borderBottom: currentStep === 2 ? "0px" : "1px solid #D1D5DB",
        }}
        onClick={() => onChangeStep(2)}
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
      </button>
      {/* Step 3 */}
      <button
        className={`flex px-4 py-2 rounded-tr-sm border-t border-r border-b border-gray-300 gap-2 bg-white items-center w-[200px] ${getOpacity(currentStep, 3)} hover:opacity-80 hover:cursor-pointer transition-colors duration-200`}
        type="button"
        style={{
          borderBottom: currentStep === 3 ? "0px" : "1px solid #D1D5DB",
        }}
        onClick={() => onChangeStep(3)}
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
      </button>
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
    return "opacity-100";
  } else {
    return "opacity-50";
  }
};
