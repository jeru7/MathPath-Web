import { useState, type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { NavigateFunction } from "react-router-dom";
import RegistrationCodeItem from "./RegistrationCodeItem";
import GeneratedCode from "../components/add-student/GeneratedCode";
import { RegistrationCode as RegistrationCodeModel } from "../../../../core/types/registration-code/registration-code.type";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTeacherContext } from "../../../context/teacher.context";
import {
  useTeacherDeleteRegistrationCode,
  useTeacherRegistrationCodes,
} from "../../../services/teacher-registration-code.service";

type RegistrationCodeType = {
  navigate: NavigateFunction;
};

export default function RegistrationCode({
  navigate,
}: RegistrationCodeType): ReactElement {
  const { teacherId } = useTeacherContext();
  const { data: registrationCodes, refetch } =
    useTeacherRegistrationCodes(teacherId);
  const [selectedCode, setSelectedCode] =
    useState<RegistrationCodeModel | null>(null);

  const { mutate: deleteCode } = useTeacherDeleteRegistrationCode(teacherId);
  const queryClient = useQueryClient();

  const handleDelete = (codeId: string) => {
    deleteCode(codeId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "registration-codes"],
        });

        toast.success("Code deleted successfully.");
        setSelectedCode(null);
        refetch();
      },
      onError: () => {
        toast.error("Failed to delete code.");
        setSelectedCode(null);
      },
    });
  };

  return (
    <div className="bg-[var(--primary-black)]/20 fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center overflow-hidden">
      <article className="relative flex flex-col gap-4 rounded-sm border border-gray-300 bg-[var(--primary-white)] dark:bg-gray-800 dark:border-gray-700 p-4 w-[80%] md:w-96">
        <button
          className="absolute right-4 top-4 hover:scale-105 hover:cursor-pointer"
          onClick={() => navigate("..")}
        >
          <IoClose className="text-gray-900 dark:text-gray-200" />
        </button>
        <header className="border-b border-b-[var(--primary-gray)] pb-2">
          <h3 className="text-gray-900 dark:text-gray-200">
            Registration Codes
          </h3>
        </header>

        <section className="flex flex-1 min-h-[400px] max-h-[400px] overflow-y-auto .no-scrollbar">
          {registrationCodes && registrationCodes.length > 0 ? (
            <ul className="flex flex-col gap-2 w-full pr-2">
              {registrationCodes.map((code) => (
                <RegistrationCodeItem
                  key={code.id}
                  code={code}
                  onClick={() => setSelectedCode(code)}
                />
              ))}
            </ul>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-300 italic">No data available</p>
            </div>
          )}
        </section>
      </article>

      {selectedCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <GeneratedCode
            code={selectedCode}
            handleBack={() => setSelectedCode(null)}
            handleDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}
