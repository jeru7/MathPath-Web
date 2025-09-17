import { useState, type ReactElement } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import mathPathTitle from "../../../../../assets/svgs/mathpath-title.svg";

import { getCustomSelectColor } from "../../../styles/selectStyles";
import { StudentGender } from "../../../../student/types/student.type";
import {
  RegisterFormDTO,
  RegisterFormSchema,
} from "../../../../student/types/student.schema";
import { registerStudentService } from "../../../../auth/services/auth.service";

export default function RegisterForm(): ReactElement {
  const navigate = useNavigate();
  const [referenceNumber, setReferenceNumber] = useState("");
  const [registrationCode, setRegistrationCode] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormDTO>({
    resolver: zodResolver(RegisterFormSchema),
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();

    if (value.length <= 6) {
      setRegistrationCode(value);
    }
  };

  const onSubmit = async (data: RegisterFormDTO) => {
    try {
      if (!data.registrationCode.trim()) {
        setError("registrationCode", {
          type: "manual",
          message: "Registration code is required.",
        });
        return;
      }

      const { registrationCode, ...studentData } = data;

      await registerStudentService(studentData, registrationCode);

      toast.success("Registration successful!");
      navigate("/auth/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to register user");
    }
  };

  return (
    <main className="relative w-full min-h-screen overflow-auto md:min-h-0 lg:-mt-20 flex gap-4 md:h-fit min-w-[300px] flex-col rounded-xl border-2 border-white/20 bg-black/50 py-4 px-8 shadow-lg backdrop-blur-sm  md:max-w-2xl transition-all duration-200">
      <header className="flex flex-col gap-4">
        <img
          src={mathPathTitle}
          alt="MathPath Icon/Logo"
          className="md:hidden self-center aspect-[16/9] w-[40%] min-w-[200px] max-w-[300px] hover:scale-105 hover:cursor-pointer md:w-[10vw] transition-transform duration-100"
          onClick={() => navigate("/")}
        />
        <h3 className="text-white font-bold text-xl text-center">Register</h3>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col gap-4 justify-between"
      >
        <div className="flex flex-col gap-2 md:gap-4">
          {/* first + last name */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="relative w-full">
              <input
                type="text"
                {...register("firstName")}
                placeholder=" "
                className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm bg-gray-100/30  text-[var(--primary-black)] focus:outline-none focus:ring-0`}
              />
              <label
                className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]`}
              >
                First Name
              </label>
              {errors.firstName && (
                <p className="text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="relative w-full">
              <input
                type="text"
                {...register("lastName")}
                placeholder=" "
                className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm bg-gray-100/30  text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors.lastName ? "" : "border-transparent focus:border-black"}`}
              />
              <label
                className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]`}
              >
                Last Name
              </label>
              {errors.lastName && (
                <p className="text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            {/* middle name */}
            <div className="relative w-full">
              <input
                type="text"
                {...register("middleName")}
                placeholder=" "
                className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm bg-gray-100/30 text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors.middleName ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
              />
              <label
                className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]`}
              >
                Middle Name
              </label>
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
                      height: "54px",
                      padding: "0px 4px",
                      backgroundColor: "rgba(243, 244, 246, 0.30)",
                      textColor: "rgb(31, 41, 55)",
                      optionHoverColor: "rgba(50, 50, 50, .30)",
                      optionSelectedColor: "var(--primary-green)",
                      border: true,
                      borderColor: "#2c2c2c",
                      borderFocusColor: "black",
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
              className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm bg-gray-100/30 text-[var(--primary-black)] focus:outline-none focus:ring-0`}
            />
            <label
              className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]`}
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
              value={referenceNumber}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length > 12) val = val.slice(0, 12);
                setReferenceNumber(val);
              }}
              className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm bg-gray-100/30 text-[var(--primary-black)] focus:outline-none focus:ring-0`}
            />
            <label
              className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]`}
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
          <div className="flex flex-col">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder=" "
                className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm bg-gray-100/30 text-[var(--primary-black)] focus:outline-none focus:ring-0`}
              />
              <label
                className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]`}
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
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* confirm password */}
          <div className="flex flex-col">
            <div className="relative">
              <input
                type={showConfirmationPassword ? "text" : "password"}
                {...register("confirmNewPassword")}
                placeholder=" "
                className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm bg-gray-100/30 text-[var(--primary-black)] focus:outline-none focus:ring-0`}
              />
              <label
                className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]`}
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
            </div>
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
              value={registrationCode}
              placeholder=" "
              maxLength={6}
              onChange={(e) => handleChange(e)}
              className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm bg-gray-100/30 text-[var(--primary-black)] focus:outline-none focus:ring-0`}
            />
            <label
              className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
            >
              Registration Code
            </label>

            {errors.registrationCode && (
              <p className="text-xs text-red-500">
                {errors.registrationCode.message as string}
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
        </div>

        <div className="flex gap-2 self-center">
          <p className="text-white">Already registered?</p>
          <button
            type="button"
            className="text-[var(--primary-yellow)] hover:cursor-pointer hover:underline"
            onClick={() => navigate("/auth/login")}
          >
            Login
          </button>
        </div>
      </form>
    </main>
  );
}
