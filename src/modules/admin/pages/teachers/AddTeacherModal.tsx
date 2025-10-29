import { useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEye, FaRegEyeSlash, FaTimes } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  AddTeacherDTO,
  AddTeacherSchema,
} from "../../../teacher/types/teacher.schema";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import { Gender } from "../../../core/types/user.type";
import { getCustomSelectColor } from "../../../core/styles/selectStyles";
import ModalOverlay from "../../../core/components/modal/ModalOverlay";
import FormButtons from "../../../core/components/buttons/FormButtons";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminContext } from "../../../admin/context/admin.context";
import { useAdminAddTeacher } from "../../../admin/services/admin-teacher.service";

type AddTeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTeacherModal({
  isOpen,
  onClose,
}: AddTeacherModalProps): ReactElement {
  const { adminId } = useAdminContext();
  const { mutate: addTeacher, isPending: isSubmitting } =
    useAdminAddTeacher(adminId);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<AddTeacherDTO>({
    resolver: zodResolver(AddTeacherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      gender: null,
      email: "",
      password: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: AddTeacherDTO) => {
    addTeacher(data, {
      onSuccess: () => {
        toast.success("Teacher added successfully");
        // invalidate and refresh the teacher data
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "teachers"],
        });
        handleClose();
      },
      onError: (err: unknown) => {
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
              toast.error("Failed to add teacher");
          }
        }
      },
    });
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>
      <article className="relative h-[100vh] w-[100vw] p-4 shadow-sm md:h-fit md:max-h-[90vh] md:w-[80vw] md:overflow-x-hidden lg:w-[60vw] lg:max-w-4xl rounded-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200 flex flex-col">
        <form
          className="flex flex-col flex-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* header */}
          <header className="flex items-center justify-between border-b border-b-gray-200 dark:border-b-gray-700 pb-4 transition-colors duration-200">
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg md:text-xl">
              Add Teacher
            </h3>
            <button
              className="hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 p-1"
              type="button"
              onClick={handleClose}
            >
              <FaTimes className="w-5 h-5 md:w-4 md:h-4" />
            </button>
          </header>

          {/* form content */}
          <div className="flex-1 py-4">
            <div className="flex flex-col gap-4 md:gap-2 px-4">
              <div className="flex flex-col gap-4 md:flex-row md:gap-2">
                {/* first name */}
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="firstName"
                      className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base"
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
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 md:p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm md:text-base h-12 md:h-10"
                  />
                </div>

                {/* last name */}
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="lastName"
                      className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base"
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
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 md:p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm md:text-base h-12 md:h-10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:gap-2">
                {/* middle name */}
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label
                      htmlFor="middleName"
                      className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base"
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
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 md:p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm md:text-base h-12 md:h-10"
                  />
                </div>

                {/* gender */}
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="gender"
                      className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base"
                    >
                      Gender
                    </label>
                    {errors.gender && (
                      <span className="text-xs text-red-500 dark:text-red-400">
                        {errors?.gender?.message}
                      </span>
                    )}
                  </div>
                  <div className="h-12 md:h-10">
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
                            padding: "0px 2px",
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
                          placeholder="Select gender"
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
              </div>

              {/* email */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="email"
                    className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base"
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
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 md:p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm md:text-base h-12 md:h-10"
                />
              </div>

              {/* password */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="password"
                    className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base"
                  >
                    Password
                  </label>
                  {errors.password && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {errors?.password?.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    maxLength={32}
                    name="password"
                    placeholder="Enter password"
                    className="border border-gray-300 dark:border-gray-600 w-full rounded-lg p-3 md:p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm md:text-base h-12 md:h-10 pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaRegEye size={20} className="w-5 h-5 md:w-4 md:h-4" />
                    ) : (
                      <FaRegEyeSlash
                        size={20}
                        className="w-5 h-5 md:w-4 md:h-4"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <FormButtons
              handleBack={handleClose}
              text={isSubmitting ? "Creating..." : "Add Teacher"}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </article>
    </ModalOverlay>
  );
}
