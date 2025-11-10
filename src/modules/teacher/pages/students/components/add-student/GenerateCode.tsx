import { FormEvent, useState, type ReactElement } from "react";
import { Minus, Plus } from "lucide-react";
import { useTeacherContext } from "../../../../context/teacher.context";
import GeneratedCode from "./GeneratedCode";
import { RegistrationCode } from "../../../../../core/types/registration-code/registration-code.type";
import { useQueryClient } from "@tanstack/react-query";
import { handleApiError } from "../../../../../core/utils/api/error.util";
import { toast } from "react-toastify";
import {
  useTeacherDeleteRegistrationCode,
  useTeacherGenerateCode,
} from "../../../../services/teacher-registration-code.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IGenerateCodeProps {
  handleBack: () => void;
}

export default function GenerateCode({
  handleBack,
}: IGenerateCodeProps): ReactElement {
  const { rawSections, teacherId } = useTeacherContext();
  const { mutate: generateCode } = useTeacherGenerateCode(teacherId);
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [numberOfStudents, setNumberOfStudents] = useState<number>(10);
  const [generatedCode, setGeneratedCode] = useState<RegistrationCode | null>(
    null,
  );
  const { mutate: deleteCode } = useTeacherDeleteRegistrationCode(teacherId);

  const handleNumberOfStudentsInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    if (value === "") {
      setNumberOfStudents(10);
      return;
    }

    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      setNumberOfStudents(10);
      return;
    }

    setNumberOfStudents(parsedValue);
  };

  const handleNumberOfStudentsBlur = () => {
    if (numberOfStudents < 10) {
      setNumberOfStudents(10);
    } else if (numberOfStudents > 50) {
      setNumberOfStudents(50);
    }
  };

  const handleIncrementStudents = () => {
    setNumberOfStudents((prev) => Math.min(prev + 1, 50));
  };

  const handleDecrementStudents = () => {
    setNumberOfStudents((prev) => Math.max(prev - 1, 10));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedSection) {
      toast.warn("Please select a section first.");
      return;
    }

    handleGenerate(selectedSection, numberOfStudents, false);
  };

  const handleGenerate = (
    sectionId: string,
    maxUses: number,
    forceReplace: boolean,
  ) => {
    generateCode(
      { sectionId, maxUses, forceReplace },
      {
        onSuccess: async (code) => {
          await queryClient.invalidateQueries({
            queryKey: ["teacher", teacherId, "registration-codes"],
          });
          setGeneratedCode(code);
        },
        onError: (err: unknown) => {
          if (err instanceof Error) {
            const errorData = handleApiError(err);
            if (errorData.error === "ACTIVE_CODE_EXISTS") {
              const shouldReplace = window.confirm(
                "There's already an active code for this section. Replace it?",
              );
              if (shouldReplace) {
                handleGenerate(sectionId, maxUses, true);
              }
            } else {
              toast.error("Failed to generate code.");
            }
          }
        },
      },
    );
  };

  const handleDelete = (codeId: string) => {
    deleteCode(codeId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "registration-codes"],
        });
        toast.success("Code deleted successfully.");
        setGeneratedCode(null);
      },
      onError: () => {
        toast.error("Failed to delete code.");
        setGeneratedCode(null);
      },
    });
  };

  // if there's a generated code, show the generatedcode component
  if (generatedCode) {
    return (
      <GeneratedCode
        code={generatedCode}
        handleBack={handleBack}
        handleDelete={handleDelete}
      />
    );
  }

  return (
    <Dialog open={true} onOpenChange={handleBack}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Code</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* section selection */}
          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <Select
              onValueChange={setSelectedSection}
              value={selectedSection || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a section..." />
              </SelectTrigger>
              <SelectContent>
                {rawSections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* number of students */}
          <div className="space-y-2">
            <Label htmlFor="studentNumber">Number of Students</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrementStudents}
                disabled={numberOfStudents <= 10}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="studentNumber"
                type="number"
                value={numberOfStudents}
                onChange={handleNumberOfStudentsInputChange}
                onBlur={handleNumberOfStudentsBlur}
                min={10}
                max={50}
                className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrementStudents}
                disabled={numberOfStudents >= 50}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum: 10, Maximum: 50
            </p>
          </div>

          {/* form buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit" disabled={!selectedSection}>
              Generate Code
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
