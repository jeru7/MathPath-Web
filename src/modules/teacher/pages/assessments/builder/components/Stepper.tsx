import { AnimatePresence, motion } from "framer-motion";
import { type ReactElement } from "react";

interface ICreateAssessmentStepperProps {
  currentStep: number;
  onChangeStep: (step: 1 | 2 | 3) => void;
  isValidated: boolean;
  createErrors: number;
  configureErrors: number;
  publishErrors: number;
}
export default function Stepper({
  currentStep,
  onChangeStep,
  isValidated,
  createErrors,
  configureErrors,
  publishErrors,
}: ICreateAssessmentStepperProps): ReactElement {
  return (
    <section className="flex rounded-sm items-center">
      {/* step 1 - create */}
      <button
        className={`flex px-4 py-2 border-t border-l border-gray-300 gap-2 bg-white items-center justify-between w-[200px] ${getOpacity(currentStep, 1)} hover:opacity-80 hover:cursor-pointer transition-colors duration-200`}
        type="button"
        style={{
          opacity: getOpacity(currentStep, 1),
          borderBottom:
            currentStep === 1 ? "1px solid #ffffff" : "1px solid #D1D5DB",
        }}
        onClick={() => onChangeStep(1)}
        key="create"
      >
        <div className="flex items-center gap-2">
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
        </div>

        <AnimatePresence>
          {isValidated && createErrors > 0 && (
            <motion.div
              className="h-5 w-5 bg-red-400 rounded-full flex items-center justify-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -5,
                transition: { duration: 0.25 },
              }}
            >
              <p className="text-white font-semibold text-xs">{createErrors}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      {/* step 2 - configure */}
      <button
        className={`flex px-4 py-2 border border-gray-300 gap-2 bg-white items-center justify-between w-[200px] ${getOpacity(currentStep, 2)} hover:opacity-80 hover:cursor-pointer transition-colors duration-200`}
        type="button"
        style={{
          borderBottom:
            currentStep === 2 ? "1px solid #ffffff" : "1px solid #D1D5DB",
        }}
        onClick={() => onChangeStep(2)}
        key="configure"
      >
        <div className="flex items-center gap-2">
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
        </div>

        <AnimatePresence>
          {isValidated && configureErrors > 0 && (
            <motion.div
              className="h-5 w-5 bg-red-400 rounded-full flex items-center justify-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -5,
                transition: { duration: 0.25 },
              }}
            >
              <p className="text-white font-semibold text-xs">
                {configureErrors}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      {/* step 3 - publish */}
      <button
        className={`flex px-4 py-2 rounded-tr-sm border-t border-r border-b border-gray-300 gap-2 bg-white items-center justify-between w-[200px] ${getOpacity(currentStep, 3)} hover:opacity-80 hover:cursor-pointer transition-colors duration-200`}
        type="button"
        style={{
          borderBottom:
            currentStep === 3 ? "1px solid #ffffff" : "1px solid #D1D5DB",
        }}
        onClick={() => onChangeStep(3)}
        key="publish"
      >
        <div className="flex items-center gap-2">
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

          <AnimatePresence>
            {isValidated && publishErrors > 0 && (
              <motion.div
                className="h-5 w-5 bg-red-400 rounded-full flex items-center justify-center"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -5,
                  transition: { duration: 0.25 },
                }}
              >
                <p className="text-white font-semibold text-xs">
                  {publishErrors}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
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
