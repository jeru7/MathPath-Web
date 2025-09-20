import { useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import {
  AddTeacherDTO,
  AddTeacherSchema,
} from "../../../teacher/types/teacher.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { getCustomSelectColor } from "../../../core/styles/selectStyles";
import { StudentGender } from "../../../student/types/student.type";
import Select from "react-select";
import FormButtons from "../../../core/components/buttons/FormButtons";
import { toast } from "react-toastify";
import { handleApiError } from "../../../core/utils/api/error.util";
import { isAxiosError } from "axios";
import { useAdminAddTeacher } from "../../services/admin.service";
import { useAdminContext } from "../../context/admin.context";
import { useNavigate } from "react-router-dom";

type AddTeacherFormTypes = {
  onClose: () => void;
};
export default function AddTeacherForm({
  onClose,
}: AddTeacherFormTypes): ReactElement {
  const { adminId } = useAdminContext();
  const { mutate: addTeacher, isPending } = useAdminAddTeacher(adminId);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<AddTeacherDTO>({
    resolver: zodResolver(AddTeacherSchema),
    defaultValues: {
      firstName: undefined,
      lastName: undefined,
      middleName: undefined,
      gender: undefined,
      email: undefined,
      password: undefined,
    },
  });

  const onSubmit = async (data: AddTeacherDTO) => {
    addTeacher(data, {
      onSuccess: () => {
        navigate("..");
        toast.success("Teacher added successfully");
      },
      onError: (err: unknown) => {
        if (isAxiosError(err)) {
          const errorData = handleApiError(err);

          switch (errorData.error) {
            case "EMAIL_ALREADY_EXISTS":
              setError("email", {
                type: "manual",
                message: "Email already exists",
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
    <article className="h-[100vh] w-[100vw] max-w-[800px] p-4 shadow-sm md:h-fit md:w-[80vw] md:overflow-x-hidden lg:w-[60vw] overflow-y-auto rounded-lg bg-[var(--primary-white)]">
      <header className="flex items-center justify-between border-b border-b-[var(--primary-gray)] pb-4">
        <h3 className="">Add Teacher</h3>
        <button
          className="hover:scale-105 hover:cursor-pointer"
          type="button"
          onClick={onClose}
        >
          <IoClose />
        </button>
      </header>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
        <FormButtons
          handleBack={onClose}
          text={isPending ? "Creating..." : "Complete"}
          disabled={isPending}
        />
      </form>
    </article>
  );
}
