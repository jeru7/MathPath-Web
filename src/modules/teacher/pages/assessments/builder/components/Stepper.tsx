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
    <section className="flex rounded-sm items-center w-full">
      {/* step 1 - create */}
      <button
        className={`flex justify-center px-4 py-2 rounded-tl-sm border-t sm:border-l shadow-[-1px_0_2px_0_rgba(0,0,0,0.05)] dark:shadow-[-1px_0_2px_0_rgba(255,255,255,0.05)] border-gray-300 dark:border-gray-600 gap-2 bg-white dark:bg-gray-700 items-center sm:justify-between w-full min-w-[80px] sm:w-[150px] xl:w-[200px] ${getOpacity(currentStep, 1)} hover:opacity-80 hover:cursor-pointer transition-colors duration-200`}
        type="button"
        style={{
          opacity: getOpacity(currentStep, 1),
          borderBottom:
            currentStep === 1
              ? "1px solid #ffffff"
              : currentStep === 1
                ? "1px solid #1f2937"
                : "1px solid #D1D5DB",
        }}
        onClick={() => onChangeStep(1)}
        key="create"
      >
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex">
            <div
              className="flex items-center justify-center w-8 h-8 xl:w-10 xl:h-10 rounded-full"
              style={{ backgroundColor: getCircleColor(currentStep, 1) }}
            >
              <p className="text-white text-xs xl:text-xl font-bold">1</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col font-semibold text-lg">
            <p className="text-xs xl:text-base font-semibold text-gray-900 dark:text-gray-100">
              Create
            </p>
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
        className={`flex justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 gap-2 bg-white dark:bg-gray-700 items-center sm:justify-between w-full min-w-[80px] sm:w-[150px] xl:w-[200px] ${getOpacity(currentStep, 2)} hover:opacity-80 hover:cursor-pointer transition-colors duration-200`}
        type="button"
        style={{
          borderBottom:
            currentStep === 2
              ? "1px solid #ffffff"
              : currentStep === 2
                ? "1px solid #1f2937"
                : "1px solid #D1D5DB",
        }}
        onClick={() => onChangeStep(2)}
        key="configure"
      >
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex">
            <div
              className="flex items-center justify-center w-8 h-8 xl:w-10 xl:h-10 rounded-full"
              style={{ backgroundColor: getCircleColor(currentStep, 2) }}
            >
              <p className="text-white text-xs xl:text-xl font-bold">2</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col text-lg">
            <p className="text-xs xl:text-base font-semibold text-gray-900 dark:text-gray-100">
              Configure
            </p>
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
        className={`flex justify-center px-4 py-2 rounded-tr-sm border-t sm:border-r border-b border-gray-300 dark:border-gray-600 shadow-[1px_0_2px_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_2px_0_rgba(255,255,255,0.05)] gap-2 bg-white dark:bg-gray-700 items-center sm:justify-between w-full min-w-[80px] sm:w-[150px] xl:w-[200px] ${getOpacity(currentStep, 3)} hover:opacity-80 hover:cursor-pointer transition-colors duration-200`}
        type="button"
        style={{
          borderBottom:
            currentStep === 3
              ? "1px solid #ffffff"
              : currentStep === 3
                ? "1px solid #1f2937"
                : "1px solid #D1D5DB",
        }}
        onClick={() => onChangeStep(3)}
        key="publish"
      >
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex">
            <div
              className="flex items-center justify-center w-8 h-8 xl:w-10 xl:h-10 rounded-full"
              style={{ backgroundColor: getCircleColor(currentStep, 3) }}
            >
              <p className="text-white text-xs font-bold">3</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col font-semibold text-lg">
            <p className="text-xs xl:text-base font-semibold text-gray-900 dark:text-gray-100">
              Publish
            </p>
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
