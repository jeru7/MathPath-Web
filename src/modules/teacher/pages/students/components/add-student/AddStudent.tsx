import { useState, type ReactElement } from "react";
import GenerateCode from "./GenerateCode";
import { NavigateFunction } from "react-router-dom";
import AddStudentForm from "./AddStudentForm";
import { IoClose } from "react-icons/io5";

interface IAddStudentProps {
  navigate: NavigateFunction;
  initialMode: "manual" | "generate" | null;
}
export default function AddStudent({
  navigate,
  initialMode,
}: IAddStudentProps): ReactElement {
  const [showInitialPrompt, setShowInitialPrompt] =
    useState<boolean>(!initialMode);
  const [showGenerateCode, setShowGenerateCode] = useState<boolean>(
    initialMode === "generate",
  );
  const [showManualAdd, setShowManualAdd] = useState<boolean>(
    initialMode === "manual",
  );

  const handleClose = () => {
    navigate("..");
  };

  const handleOpenManualAdd = () => {
    setShowInitialPrompt(false);
    setShowManualAdd(true);
    navigate?.("?mode=manual", { replace: true });
  };

  const handleOpenGenerateCode = () => {
    setShowInitialPrompt(false);
    setShowGenerateCode(true);
    navigate?.("?mode=generate", { replace: true });
  };

  const handleBack = () => {
    setShowManualAdd(false);
    setShowGenerateCode(false);
    setShowInitialPrompt(true);
    navigate("?", { replace: true });
  };

  return (
    <div className="bg-black/20 dark:bg-black/40 fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center overflow-hidden transition-colors duration-200">
      {/* Initial prompt - generate or manual */}
      {showInitialPrompt && (
        <article className="relative flex flex-col gap-4 rounded-md bg-white dark:bg-gray-800 p-4 w-[80%] md:w-96 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <button
            className="absolute right-4 top-4 hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            type="button"
            onClick={handleClose}
          >
            <IoClose size={24} />
          </button>
          <header className="border-b border-b-gray-200 dark:border-b-gray-700 pb-2 transition-colors duration-200">
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
              Add Student
            </h3>
          </header>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              How do you want to add student?
            </p>
            <div className="flex flex-col md:flex-row w-full gap-4">
              <button
                type="button"
                onClick={handleOpenGenerateCode}
                className="bg-green-500 dark:bg-green-600 flex h-16 md:h-20 w-full items-center justify-center rounded-sm shadow-md transition-all duration-200 hover:cursor-pointer hover:bg-green-600 dark:hover:bg-green-500 hover:shadow-lg text-white font-semibold"
              >
                <p className="text-xs font-bold">GENERATE CODE</p>
              </button>
              <button
                type="button"
                onClick={handleOpenManualAdd}
                className="bg-green-500 dark:bg-green-600 flex h-16 md:h-20 w-full items-center justify-center rounded-sm shadow-md transition-all duration-200 hover:cursor-pointer hover:bg-green-600 dark:hover:bg-green-500 hover:shadow-lg text-white font-semibold"
              >
                <p className="text-xs font-bold">MANUAL</p>
              </button>
            </div>
          </div>
        </article>
      )}

      {/* Manual Adding */}
      {showManualAdd && <AddStudentForm handleBack={handleBack} />}

      {/* Generate Code */}
      {showGenerateCode && <GenerateCode handleBack={handleBack} />}
    </div>
  );
}
