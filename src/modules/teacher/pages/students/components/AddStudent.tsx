import { useState, type ReactElement } from "react";
import ManualAdd from "./ManualAdd";
import GenerateCode from "./GenerateCode";
import { NavigateFunction } from "react-router-dom";
import { IoIosClose } from "react-icons/io";

interface IAddStudentProps {
  setShowForm: (show: boolean) => void;
  navigate: NavigateFunction;
  initialMode: "manual" | "generate" | null;
}

export default function AddStudent({
  setShowForm,
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
    setShowForm(false);
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
    <div className="bg-[var(--primary-black)]/20 fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center">
      {/* Initial prompt - generate or manual */}
      {showInitialPrompt && (
        <div className="relative flex flex-col gap-4 rounded-md bg-[var(--primary-white)] p-8">
          <button
            className="absolute right-4 top-4 hover:scale-105 hover:cursor-pointer"
            onClick={handleClose}
          >
            <IoIosClose className="h-4 w-4" />
          </button>
          <header className="border-b border-b-[var(--primary-gray)] pb-2">
            <h3 className="font-semibold">Add Student</h3>
          </header>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium">
              How do you want to add student?
            </p>
            <div className="flex w-full gap-4">
              <button
                type="button"
                onClick={handleOpenGenerateCode}
                className="bg-[var(--tertiary-green)]/90 flex h-20 w-60 items-center justify-center rounded-sm shadow-md transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--tertiary-green)]"
              >
                <p className="text-xs font-bold">GENERATE CODE</p>
              </button>
              <button
                type="button"
                onClick={handleOpenManualAdd}
                className="bg-[var(--tertiary-green)]/90 flex h-20 w-60 items-center justify-center rounded-sm shadow-sm transition-colors duration-200 hover:scale-100 hover:cursor-pointer hover:bg-[var(--tertiary-green)]"
              >
                <p className="text-xs font-bold">MANUAL</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Adding */}
      {showManualAdd && <ManualAdd handleBack={handleBack} />}

      {/* Generate Code */}
      {showGenerateCode && <GenerateCode handleBack={handleBack} />}
    </div>
  );
}
