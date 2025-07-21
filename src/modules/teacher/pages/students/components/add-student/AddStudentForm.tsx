import { useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoIosClose } from "react-icons/io";
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

type AddStudentFormProps = {
  handleBack: () => void;
};

export default function AddStudentForm({
  handleBack,
}: AddStudentFormProps): ReactElement {
  const { teacherId } = useParams();
  const { mutate: addStudent } = useAddStudent(teacherId ?? "");
  const { sections } = useTeacherContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddStudentDTO>({
    resolver: zodResolver(AddStudentSchema),
    defaultValues: {
      firstName: undefined,
      lastName: undefined,
      middleName: undefined,
      gender: undefined,
      email: undefined,
      referenceNumber: undefined,
      username: undefined,
      password: undefined,
      sectionId: undefined,
    },
  });

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("..");
  };

  const onSubmit = async (data: AddStudentDTO) => {
    addStudent(data);
    handleBack();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex h-[100vh] w-[100vw] max-w-[1000px] flex-col gap-4 overflow-y-auto rounded-lg bg-[var(--primary-white)] p-8 shadow-sm md:h-fit md:w-[80vw] md:overflow-x-hidden lg:w-[60vw]">
        <button
          className="absolute right-4 top-4 hover:scale-105 hover:cursor-pointer"
          onClick={handleClose}
        >
          <IoIosClose className="h-4 w-4" />
        </button>
        <header>
          <h3 className="border-b border-b-[var(--primary-gray)] pb-2 text-2xl font-bold">
            Add Student - Manual
          </h3>
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
                    styles={getCustomSelectColor()}
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
              className="border-1 rounded-lg p-2 [appearance:textfield] focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
            />
          </div>
          {/* Username */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="username" className="font-bold">
                Username
              </label>
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors?.username?.message}
                </p>
              )}
            </div>
            <input
              type="text"
              {...register("username")}
              name="username"
              placeholder="Enter username"
              className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
            />
          </div>
          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="password" className="font-bold">
                Password
              </label>
              {errors.password && (
                <p className="text-xs text-red-500">{errors?.email?.message}</p>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
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
                  styles={getCustomSelectColor()}
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
      </div>
    </form>
  );
}
