import { useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEye, FaRegEyeSlash, FaTimes } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useAdminContext } from "../../context/admin.context";
import {
  AddStudentDTO,
  AddStudentSchema,
} from "../../../student/types/student.schema";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import { Gender } from "../../../core/types/user.type";
import { getCustomSelectColor } from "../../../core/styles/selectStyles";
import { Section } from "../../../core/types/section/section.type";
import { useAdminAddStudent } from "../../services/admin-student.service";
import ModalOverlay from "../../../core/components/modal/ModalOverlay";
import FormButtons from "../../../core/components/buttons/FormButtons";

type AddStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddStudentModal({
  isOpen,
  onClose,
}: AddStudentModalProps): ReactElement {
  const { adminId } = useAdminContext();
  const { mutate: addStudent, isPending: isSubmitting } =
    useAdminAddStudent(adminId);
  const { sections } = useAdminContext();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<AddStudentDTO>({
    resolver: zodResolver(AddStudentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      gender: undefined,
      email: "",
      referenceNumber: "",
      password: "",
      sectionId: undefined,
    },
  });

  const handleClose = () => {
    reset();
    setReferenceNumber("");
    onClose();
  };

  const onSubmit = async (data: AddStudentDTO) => {
    addStudent(data, {
      onSuccess: () => {
        toast.success("Student added successfully");
        handleClose();
      },
      onError: (err: unknown) => {
        if (isAxiosError(err)) {
          const errorData: APIErrorResponse = handleApiError(err);

          switch (errorData.error) {
            case "EMAIL_AND_LRN_ALREADY_EXISTS":
              setError("email", {
                type: "manual",
                message: "Email already exists",
              });
              setError("referenceNumber", {
                type: "manual",
                message: "Reference number already exists",
              });
              break;

            case "EMAIL_ALREADY_EXISTS":
              setError("email", {
                type: "manual",
                message: errorData.message || "Email already exists",
              });
              break;

            case "REFERENCE_NUMBER_ALREADY_EXISTS":
              setError("referenceNumber", {
                type: "manual",
                message: errorData.message || "Reference number already exists",
              });
              break;

            default:
              toast.error("Failed to add student");
          }
        }
      },
    });
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>
      <article className="relative max-w-[1000px] w-[90vw] max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* header */}
          <header className="flex items-center justify-between border-b border-b-gray-200 dark:border-b-gray-700 p-4 transition-colors duration-200 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
              Add Student
            </h3>
            <button
              className="hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              type="button"
              onClick={handleClose}
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </header>

          <div className="p-6 space-y-4">
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
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
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
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
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
                    <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                      (Optional)
                    </span>
                  </label>
                  {errors.middleName && (
                    <span className="text-xs font-normal text-red-500 dark:text-red-400">
                      {errors?.middleName?.message}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  {...register("middleName")}
                  name="middleName"
                  placeholder="Enter middle name"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
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
                        minHeight: "42px",
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
                      className="basic-select"
                      classNamePrefix="select"
                      placeholder="Select gender..."
                      onChange={(selected) => field.onChange(selected?.value)}
                      value={
                        field.value
                          ? {
                            value: field.value,
                            label: field.value === "Male" ? "Male" : "Female",
                          }
                          : null
                      }
                    />
                  )}
                />
              </div>
            </div>

            {/* email */}
            <div className="flex flex-col gap-1">
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
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              />
            </div>

            {/* LRN */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="referenceNumber"
                  className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                >
                  LRN
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {" "}
                    (Learner Reference Number)
                  </span>
                </label>
                {errors.referenceNumber && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors?.referenceNumber?.message}
                  </p>
                )}
              </div>
              <input
                type="text"
                {...register("referenceNumber")}
                name="referenceNumber"
                placeholder="Enter reference number"
                value={referenceNumber}
                onChange={(e) => {
                  // remove non numeric characters
                  let val = e.target.value.replace(/\D/g, "");
                  // limit to 12 digits
                  if (val.length > 12) val = val.slice(0, 12);
                  setReferenceNumber(val);
                }}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 [appearance:textfield] focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              />
            </div>

            {/* password */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="password"
                  className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
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
                  className="border border-gray-300 dark:border-gray-600 w-full rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaRegEye size={20} />
                  ) : (
                    <FaRegEyeSlash size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* section */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="section"
                  className="text-md font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                >
                  Section
                </label>
                {errors.sectionId && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors?.sectionId?.message}
                  </p>
                )}
              </div>
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
                      minHeight: "42px",
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
                    className="basic-select"
                    classNamePrefix="select"
                    placeholder="Select a section..."
                    onChange={(selected) => field.onChange(selected?.id)}
                    value={
                      sections.find((section) => section.id === field.value) ||
                      null
                    }
                  />
                )}
              />
            </div>
          </div>

          <div className="border-t border-t-gray-200 dark:border-t-gray-700 p-6 transition-colors duration-200 sticky bottom-0 bg-white dark:bg-gray-800">
            <FormButtons
              handleBack={handleClose}
              text={isSubmitting ? "Creating..." : "Add Student"}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </article>
    </ModalOverlay>
  );
}
