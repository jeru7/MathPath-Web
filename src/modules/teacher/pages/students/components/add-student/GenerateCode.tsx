import { FormEvent, useState, type ReactElement } from "react";
import Select, { GroupBase, StylesConfig } from "react-select";
import { getCustomSelectColor } from "../../../../../core/styles/selectStyles";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useTeacherContext } from "../../../../context/teacher.context";
import { Section } from "../../../../../core/types/section/section.type";
import FormButtons from "../../../../../core/components/buttons/FormButtons";
import GeneratedCode from "./GeneratedCode";
import {
  useTeacherDeleteRegistrationCode,
  useTeacherGenerateCode,
} from "../../../../services/teacher.service";
import { RegistrationCode } from "../../../../../core/types/registration-code/registration-code.type";
import { useQueryClient } from "@tanstack/react-query";
import { handleApiError } from "../../../../../core/utils/api/error.util";
import { toast } from "react-toastify";

interface IGenerateCodeProps {
  handleBack: () => void;
}

export default function GenerateCode({
  handleBack,
}: IGenerateCodeProps): ReactElement {
  const { sections } = useTeacherContext();
  const { teacher } = useTeacherContext();
  const { mutate: generateCode } = useTeacherGenerateCode(teacher?.id ?? "");
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState<string | null>();
  const [numberOfStudents, setNumberOfStudents] = useState<number>(10);
  const [generatedCode, setGeneratedCode] = useState<RegistrationCode | null>(
    null,
  );
  const { mutate: deleteCode } = useTeacherDeleteRegistrationCode(
    teacher?.id ?? "",
  );

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
    setNumberOfStudents((prev) => {
      if (prev >= 50) {
        return 50;
      }

      return prev + 1;
    });
  };

  const customStyles: StylesConfig<
    Section,
    false,
    GroupBase<Section>
  > = getCustomSelectColor({
    minHeight: "24px",
    border: true,
    borderRadius: ".25rem",
    padding: "0px 2px",
    backgroundColor: "white",
    textColor: "#1f2937",
    menuBackgroundColor: "white",
    menuWidth: "100%",
    dark: {
      backgroundColor: "#374151",
      textColor: "#f9fafb",
      borderColor: "#4b5563",
      borderFocusColor: "#10b981",
      optionHoverColor: "#1f2937",
      optionSelectedColor: "#059669",
      menuBackgroundColor: "#374151",
      placeholderColor: "#9ca3af",
    },
  });

  const handleDecrementStudents = () => {
    setNumberOfStudents((prev) => {
      if (prev <= 10) {
        return 10;
      }

      return prev - 1;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedSection) return;

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
            queryKey: ["teacher", teacher?.id, "registration-codes"],
          });

          setGeneratedCode(code);
        },
        onError: (err: unknown) => {
          if (err instanceof Error) {
            const errorData = handleApiError(err);
            console.log("Error data: " + errorData.error);
            if (errorData.error === "ACTIVE_CODE_EXISTS") {
              const shouldReplace = window.confirm(
                "There's already an active code for this section. Replace it?",
              );

              if (shouldReplace) {
                handleGenerate(sectionId, maxUses, true);
              }
            } else {
              console.error("Failed to generate code", err);
            }
          }
        },
      },
    );
  };

  const handleDelete = (codeId: string) => {
    console.log("ID TO DELETE: ", codeId);
    deleteCode(codeId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacher?.id, "registration-codes"],
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
    <article className="relative flex flex-col gap-2 rounded-md bg-white dark:bg-gray-800 p-4 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <header className="border-b border-b-gray-200 dark:border-b-gray-700 pb-2 transition-colors duration-200">
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
          Generate Code
        </h3>
      </header>
      <button
        className="absolute right-4 top-4 hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
        onClick={handleBack}
      >
        <IoClose size={24} />
      </button>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* section selection */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="section"
              className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              Section
            </label>
            <Select
              id="section"
              name="section"
              options={sections}
              getOptionLabel={(option: Section) => option.name}
              getOptionValue={(option: Section) => option.id}
              styles={customStyles}
              className="basic-select"
              classNamePrefix="select"
              placeholder="Select a section..."
              onChange={(selected) => setSelectedSection(selected?.id)}
              value={
                sections.find((section) => section.id === selectedSection) ||
                null
              }
            />
          </div>

          {/* number of uses/students */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="studentNumber"
              className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              Number of Students
            </label>
            <div className="relative">
              <input
                type="number"
                id="studentNumber"
                name="studentNumber"
                value={numberOfStudents}
                onChange={handleNumberOfStudentsInputChange}
                onBlur={handleNumberOfStudentsBlur}
                placeholder=""
                className="border border-gray-300 dark:border-gray-600 w-full py-2 pl-3 pr-10 [appearance:textfield] focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md transition-colors duration-200"
              />
              <div className="absolute right-0 top-0 flex h-full flex-col justify-center pr-2">
                <div className="flex">
                  <button
                    type="button"
                    onClick={handleDecrementStudents}
                    className="flex h-6 w-6 items-center justify-center rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <FaMinus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleIncrementStudents}
                    className="flex h-6 w-6 items-center justify-center rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <FaPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* buttons */}
          <FormButtons
            handleBack={handleBack}
            text={"Generate"}
            disabled={false}
          />
        </div>
      </form>
    </article>
  );
}
