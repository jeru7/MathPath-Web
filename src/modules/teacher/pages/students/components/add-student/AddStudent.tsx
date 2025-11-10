import { useState, type ReactElement } from "react";
import GenerateCode from "./GenerateCode";
import { NavigateFunction } from "react-router-dom";
import AddStudentForm from "./AddStudentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
    <Dialog open={true} onOpenChange={handleClose}>
      {/*  generate or manual */}
      {showInitialPrompt && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              How do you want to add a student?
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={handleOpenGenerateCode}
                className="h-20 text-lg font-semibold"
              >
                GENERATE CODE
              </Button>
              <Button
                onClick={handleOpenManualAdd}
                className="h-20 text-lg font-semibold"
              >
                MANUAL ADD
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

      {/* manual adding */}
      {showManualAdd && <AddStudentForm handleBack={handleBack} />}

      {/* generate code */}
      {showGenerateCode && <GenerateCode handleBack={handleBack} />}
    </Dialog>
  );
}
