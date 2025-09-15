import { useState, type ReactElement } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

import { getCustomSelectColor } from "../../../styles/selectStyles";
import { StudentGender } from "../../../../student/types/student.type";
import {
  RegisterStudentDTO,
  RegisterStudentSchema,
} from "../../../../student/types/student.schema";

export default function RegisterForm(): ReactElement {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterStudentDTO>({
    resolver: zodResolver(RegisterStudentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      gender: undefined,
      email: "",
      referenceNumber: "",
      password: "",
      confirmNewPassword: "",
      registrationCode: "",
    },
  });

  const onSubmit = async (data: RegisterStudentDTO) => {
    try {
      console.log("Register data:", data);
      toast.success("Registration successful!");
      navigate("/auth/login");
    } catch (err) {
      console.log(err);
      toast.error("Failed to register user");
    }
  };

  return (
    <main className="relative -mt-24 flex gap-4 h-fit w-[90%] min-w-[300px] max-w-sm flex-col rounded-xl border-2 border-white/20 bg-white/10 py-4 px-8 shadow-lg backdrop-blur-lg sm:max-w-md md:max-w-lg transition-all duration-200">
      <header className="flex flex-col gap-4">
        <h3 className="text-white font-bold text-xl text-center">Register</h3>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* First + Last name */}
        <div className="flex gap-4">
          <div className="relative w-full">
            <input
              type="text"
              {...register("firstName")}
              placeholder=" "
              className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors.firstName ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
            />
            <label
              className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
                ${errors.firstName ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
            >
              First Name
            </label>
          </div>

          <div className="relative w-full">
            <input
              type="text"
              {...register("lastName")}
              placeholder=" "
              className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors.lastName ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
            />
            <label
              className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
                ${errors.lastName ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
            >
              Last Name
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          {/* middle name */}
          <div className="relative w-full">
            <input
              type="text"
              {...register("middleName")}
              placeholder=" "
              className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors.middleName ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
            />
            <label
              className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
                ${errors.middleName ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
            >
              Middle Name
            </label>
            {errors.middleName && (
              <p className="text-xs text-red-500">
                {errors.middleName.message}
              </p>
            )}
          </div>

          {/* gender */}
          <div className="w-full">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select<{ value: StudentGender; label: string }>
                  {...field}
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
                    minHeight: "52px",
                    padding: "0px 4px",
                  })}
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
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>
        </div>

        {/* email */}
        <div className="relative">
          <input
            type="email"
            {...register("email")}
            placeholder=" "
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
              ${errors.email ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
          />
          <label
            className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
              ${errors.email ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
          >
            Email
          </label>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* LRN */}
        <div className="relative">
          <input
            type="text"
            {...register("referenceNumber")}
            placeholder=" "
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
              ${errors.referenceNumber ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
          />
          <label
            className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
              ${errors.referenceNumber ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
          >
            Learner Reference Number (LRN)
          </label>
          {errors.referenceNumber && (
            <p className="text-xs text-red-500">
              {errors.referenceNumber.message}
            </p>
          )}
        </div>

        {/* password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder=" "
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
              ${errors.password ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
          />
          <label
            className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
              ${errors.password ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black hover:cursor-pointer"
          >
            {showPassword ? (
              <FaRegEye size={20} />
            ) : (
              <FaRegEyeSlash size={20} />
            )}
          </button>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* confirm password */}
        <div className="relative">
          <input
            type={showConfirmationPassword ? "text" : "password"}
            {...register("confirmNewPassword")}
            placeholder=" "
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
              ${errors.confirmNewPassword ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
          />
          <label
            className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
              ${errors.confirmNewPassword ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
          >
            Confirm Password
          </label>
          <button
            type="button"
            onClick={() =>
              setShowConfirmationPassword(!showConfirmationPassword)
            }
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black hover:cursor-pointer"
          >
            {showConfirmationPassword ? (
              <FaRegEye size={20} />
            ) : (
              <FaRegEyeSlash size={20} />
            )}
          </button>
          {errors.confirmNewPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* registration code */}
        <div className="relative">
          <input
            type="text"
            {...register("registrationCode")}
            placeholder=" "
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
              ${errors.registrationCode ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
          />
          <label
            className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
              ${errors.registrationCode ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
          >
            Registration Code
          </label>
          {errors.registrationCode && (
            <p className="text-xs text-red-500">
              {errors.registrationCode.message}
            </p>
          )}
        </div>

        {/* submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-base text-white font-bold hover:bg-[var(--primary-yellow)]/100 transition-color duration-200 rounded-lg bg-[var(--primary-yellow)]/80 p-3 hover:cursor-pointer"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="flex gap-2 absolute -bottom-10 left-1/2 -translate-x-1/2">
        <p className="text-white">Already registered?</p>
        <button
          type="button"
          className="text-[var(--primary-yellow)] hover:cursor-pointer hover:underline"
          onClick={() => navigate("/auth/login")}
        >
          Login
        </button>
      </div>
    </main>
  );
}
