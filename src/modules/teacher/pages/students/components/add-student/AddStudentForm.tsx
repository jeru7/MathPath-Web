import { useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Select from "react-select";
import { useTeacherContext } from "../../../../context/teacher.context";
import {
  AddStudentDTO,
  AddStudentSchema,
} from "../../../../../student/types/student.schema";
import { useAddStudent } from "../../../../../student/services/student.service";
import { StudentGender } from "../../../../../student/types/student.type";
import { getCustomSelectColor } from "../../../../../core/styles/selectStyles";
import { Section } from "../../../../../core/types/section/section.type";
import FormButtons from "../../../../../core/components/buttons/FormButtons";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { APIErrorResponse } from "../../../../../core/types/api/api.type";
import { handleApiError } from "../../../../../core/utils/api/error.util";

type AddStudentFormProps = {
  handleBack: () => void;
};

export default function AddStudentForm({
  handleBack,
}: AddStudentFormProps): ReactElement {
  const { teacherId } = useParams();
  const { mutate: addStudent, isPending: isSubmitting } = useAddStudent(
    teacherId ?? "",
  );
  const { sections } = useTeacherContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<AddStudentDTO>({
    resolver: zodResolver(AddStudentSchema),
    defaultValues: {
      firstName: undefined,
      lastName: undefined,
      middleName: undefined,
      gender: undefined,
      email: undefined,
      referenceNumber: undefined,
      password: undefined,
      sectionId: undefined,
    },
  });

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("..");
  };

  const onSubmit = async (data: AddStudentDTO) => {
    addStudent(data, {
      onSuccess: () => {
        navigate("..");
        toast.success("Student added successfully");
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
    <article className="relative h-[100vh] w-[100vw] max-w-[1000px] p-4 shadow-sm md:h-fit md:w-[80vw] md:overflow-x-hidden lg:w-[60vw] overflow-y-auto rounded-lg bg-[var(--primary-white)]">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <header className="flex items-center justify-between border-b border-b-[var(--primary-gray)] pb-4">
          <h3 className="">Add Student - Manual</h3>
          <button
            className="hover:scale-105 hover:cursor-pointer"
            type="button"
            onClick={handleClose}
          >
            <IoClose />
          </button>
        </header>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 md:flex-row">
            {/* First name */}
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-2">
                <label htmlFor="firstName" className="font-bold">
                  First Name
                </label>
                {errors.firstName && (
                  <p className="text-xs text-red-500">
                    {errors?.firstName?.message}
                  </p>
                )}
              </div>
              <input
                type="text"
                {...register("firstName")}
                name="firstName"
                placeholder="Enter first name"
                className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
              />
            </div>
            {/* Last name */}
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-2">
                <label htmlFor="lastName" className="font-bold">
                  Last Name{" "}
                </label>
                {errors.lastName && (
                  <p className="text-xs text-red-500">
                    {errors?.lastName?.message}
                  </p>
                )}
              </div>
              <input
                type="text"
                {...register("lastName")}
                name="lastName"
                placeholder="Enter last name"
                className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            {/* Middle name */}
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-2">
                <label htmlFor="middleName" className="font-bold">
                  Middle Name
                  <span className="ml-1 inline-flex items-center gap-1">
                    <span className="text-xs font-normal text-gray-500">
                      (Optional)
                    </span>
                    {errors.middleName && (
                      <span className="text-xs font-normal text-red-500">
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
                className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
              />
            </div>
            {/* Gender */}
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-2">
                <label htmlFor="gender" className="text-md font-bold">
                  Gender
                </label>
                {errors.gender && (
                  <span className="text-xs text-red-500">
                    {errors?.gender?.message}
                  </span>
                )}
              </div>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select<{ value: StudentGender; label: string }>
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
                      value: StudentGender;
                      label: string;
                    }>({
                      minHeight: "42px",
                      padding: "0px 4px",
                      menuWidth: "100%",
                      menuBackgroundColor: "white",
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
          {/* Email */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="email" className="font-bold">
                Email
              </label>
              {errors.email && (
                <p className="text-xs text-red-500">{errors?.email?.message}</p>
              )}
            </div>
            <input
              type="email"
              {...register("email")}
              name="email"
              placeholder="Enter email"
              className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
            />
          </div>
          {/* Student Number */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="referenceNumber" className="font-bold">
                LRN
                <span className="font-medium"> (Learner Reference Number)</span>
              </label>
              {errors.referenceNumber && (
                <p className="text-xs text-red-500">
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
                // Remove non-numeric characters
                let val = e.target.value.replace(/\D/g, "");
                // Limit to 12 digits
                if (val.length > 12) val = val.slice(0, 12);
                setReferenceNumber(val);
              }}
              className="border-1 rounded-lg p-2 [appearance:textfield] focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
            />
          </div>
          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="password" className="font-bold">
                Password
              </label>
              {errors.password && (
                <p className="text-xs text-red-500">
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
                className="border-1 w-full rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:cursor-pointer hover:text-gray-700"
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
          {/* Section */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="section" className="text-md font-bold">
                Section
              </label>
              {errors.sectionId && (
                <p className="text-xs text-red-500">
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
        <FormButtons
          handleBack={handleBack}
          text={isSubmitting ? "Creating..." : "Complete"}
          disabled={isSubmitting}
        />
      </form>
    </article>
  );
}
