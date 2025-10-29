import { type ReactElement, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaTimes } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  EditStudentDTO,
  EditStudentSchema,
} from "../../../student/types/student.schema";
import { getCustomSelectColor } from "../../../core/styles/selectStyles";
import FormButtons from "../../../core/components/buttons/FormButtons";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import { Gender } from "../../../core/types/user.type";
import ModalOverlay from "../../../core/components/modal/ModalOverlay";
import { Student } from "../../../student/types/student.type";
import { Section } from "../../../core/types/section/section.type";

type EditStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onUpdateStudent: (studentId: string, data: EditStudentDTO) => Promise<void>;
  isSubmitting?: boolean;
  sections: Section[];
  showSectionSelection: boolean;
};

export default function EditStudentModal({
  isOpen,
  onClose,
  student,
  onUpdateStudent,
  isSubmitting = false,
  sections,
  showSectionSelection,
}: EditStudentModalProps): ReactElement {
  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditStudentDTO>({
    resolver: zodResolver(EditStudentSchema),
    defaultValues: {
      firstName: student?.firstName || "",
      lastName: student?.lastName || "",
      middleName: student?.middleName || "",
      gender: (student?.gender as Gender) || null,
      email: student?.email || "",
      sectionId: student?.sectionId || "",
    },
  });

  // update form when student changes
  useEffect(() => {
    if (student) {
      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        middleName: student.middleName || "",
        gender: student.gender as Gender,
        email: student.email,
        sectionId: student.sectionId,
      });
    }
  }, [student, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: EditStudentDTO) => {
    if (!student) return;

    try {
      await onUpdateStudent(student.id, data);
      reset(data);
      onClose();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const errorData: APIErrorResponse = handleApiError(err);

        switch (errorData.error) {
          case "EMAIL_ALREADY_EXISTS":
            setError("email", {
              type: "manual",
              message: errorData.message || "Email already exists",
            });
            break;

          default:
            toast.error("Failed to update student");
        }
      } else {
        toast.error("Failed to update student");
      }
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>
      <article className="relative h-[100vh] w-[100vw] p-4 shadow-sm md:h-fit md:w-[80vw] md:overflow-x-hidden lg:w-[60vw] ouverflow-y-auto rounded-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <form
          className="flex flex-col h-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <header className="flex items-center justify-between border-b border-b-gray-200 dark:border-b-gray-700 pb-4 transition-colors duration-200">
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
              Edit Student
            </h3>
            <button
              className="hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              type="button"
              onClick={handleClose}
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </header>

          <div className="flex-1 py-4">
            <div className="flex flex-col gap-6">
              {/* personal information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* first name */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="firstName"
                      className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    >
                      First Name
                    </label>
                    {errors.firstName && (
                      <p className="text-xs text-red-500 dark:text-red-400">
                        {errors?.firstName?.message}
                      </p>
                    )}
                  </div>
                  <input
                    type="text"
                    {...register("firstName")}
                    name="firstName"
                    placeholder="Enter first name"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 h-10"
                  />
                </div>

                {/* last name */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="lastName"
                      className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    >
                      Last Name
                    </label>
                    {errors.lastName && (
                      <p className="text-xs text-red-500 dark:text-red-400">
                        {errors?.lastName?.message}
                      </p>
                    )}
                  </div>
                  <input
                    type="text"
                    {...register("lastName")}
                    name="lastName"
                    placeholder="Enter last name"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 h-10"
                  />
                </div>

                {/* middle name */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="middleName"
                      className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    >
                      Middle Name
                      <span className="ml-1 inline-flex items-center gap-1">
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                          (Optional)
                        </span>
                        {errors.middleName && (
                          <span className="text-xs font-normal text-red-500 dark:text-red-400">
                            {errors?.middleName?.message}
                          </span>
                        )}
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    {...register("middleName")}
                    name="middleName"
                    placeholder="Enter middle name"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 h-10"
                  />
                </div>

                {/* gender */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="gender"
                      className="text-md font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    >
                      Gender
                    </label>
                    {errors.gender && (
                      <span className="text-xs text-red-500 dark:text-red-400">
                        {errors?.gender?.message}
                      </span>
                    )}
                  </div>
                  <div className="h-10">
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select<{ value: Gender; label: string }>
                          {...field}
                          id="gender"
                          name="gender"
                          options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                          ]}
                          getOptionLabel={(option) => option.label}
                          getOptionValue={(option) => option.value}
                          styles={getCustomSelectColor<{
                            value: Gender;
                            label: string;
                          }>({
                            height: "100%",
                            minHeight: "100%",
                            padding: "0px 4px",
                            menuWidth: "100%",
                            menuBackgroundColor: "white",
                            backgroundColor: "white",
                            textColor: "#1f2937",
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
                          })}
                          className="basic-select h-full"
                          classNamePrefix="select"
                          placeholder="Select gender..."
                          onChange={(selected) =>
                            field.onChange(selected?.value)
                          }
                          value={
                            field.value
                              ? {
                                value: field.value,
                                label:
                                  field.value === "Male" ? "Male" : "Female",
                              }
                              : null
                          }
                        />
                      )}
                    />
                  </div>
                </div>

                {/* email */}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="email"
                      className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    >
                      Email
                    </label>
                    {errors.email && (
                      <p className="text-xs text-red-500 dark:text-red-400">
                        {errors?.email?.message}
                      </p>
                    )}
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    name="email"
                    placeholder="Enter email"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 h-10"
                  />
                </div>

                {/* section: hidden on teacher's */}
                {showSectionSelection && (
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="section"
                        className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      >
                        Section
                      </label>
                      {errors.sectionId && (
                        <p className="text-xs text-red-500 dark:text-red-400">
                          {errors?.sectionId?.message}
                        </p>
                      )}
                    </div>
                    <div className="h-10">
                      <Controller
                        name="sectionId"
                        control={control}
                        render={({ field }) => (
                          <Select<Section>
                            {...field}
                            id="section"
                            name="section"
                            options={sections}
                            getOptionLabel={(option: Section) => option.name}
                            getOptionValue={(option: Section) => option.id}
                            styles={getCustomSelectColor<Section>({
                              height: "100%",
                              minHeight: "100%",
                              padding: "0px 4px",
                              menuWidth: "100%",
                              menuBackgroundColor: "white",
                              backgroundColor: "white",
                              textColor: "#1f2937",
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
                            })}
                            className="basic-select h-full"
                            classNamePrefix="select"
                            placeholder="Select a section..."
                            onChange={(selected) =>
                              field.onChange(selected?.id)
                            }
                            value={
                              sections.find(
                                (section) => section.id === field.value,
                              ) || null
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <FormButtons
            handleBack={handleClose}
            text={isSubmitting ? "Updating..." : "Update"}
            disabled={isSubmitting || !isDirty}
          />
        </form>
      </article>
    </ModalOverlay>
  );
}
