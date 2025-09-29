import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { GoShieldX } from "react-icons/go";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../../../auth/contexts/auth.context";
import { AccountType } from "../../../../auth/types/auth.type";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { handleApiError } from "../../../utils/api/error.util";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormDTO,
  LoginFormSchema,
} from "../../../../student/types/student.schema";
import mathPathTitle from "../../../../../assets/svgs/mathpath-title.svg";

export default function LoginForm(): ReactElement {
  const navigate = useNavigate();
  const { user, login, isLoading } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [clickTracker, setClickTracker] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<LoginFormDTO>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      accountType: accountType,
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isLoading && user) {
      navigate(`/${user.role}/${user.id}`);
    }
  }, [user, isLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "identifier" && accountType === "Student") {
      value = value.replace(/\D/g, "");
      if (value.length > 12) value = value.slice(0, 12);
    }

    setIdentifier(value);
  };

  const onSubmit = async (data: LoginFormDTO) => {
    setLoginError(null);

    try {
      await login(data.identifier, data.password);
    } catch (error: unknown) {
      const errorData = handleApiError(error);

      if (
        errorData.error === "INVALID_PASSWORD" ||
        errorData.error === "INVALID_IDENTIFIER"
      ) {
        const message =
          accountType === "Teacher"
            ? "Invalid email or password. Try again."
            : "Invalid LRN or password. Try again.";
        setLoginError(message);
      } else if (errorData.error === "EMAIL_NOT_VERIFIED") {
        setLoginError("Email not verified. Kindly check your mails first.");
      } else if (errorData.error === "RATE_LIMIT_EXCEEDED") {
        setLoginError("Too many attempts. Please wait a minute.");
      } else {
        setLoginError("An unexpected error occurred. Try again later.");
      }
    }
  };

  const handleFormClick = () => {
    if (clickTracker === 10) return;
    setClickTracker((prev) => prev + 1);
  };

  return (
    <main
      className="relative w-full min-h-screen overflow-auto md:min-h-0 flex gap-4 md:h-fit min-w-[300px] flex-col rounded-xl border-2 border-white/20 bg-black/50 py-4 px-8 shadow-lg backdrop-blur-sm  md:max-w-2xl transition-all duration-200"
      onClick={handleFormClick}
    >
      <div className="flex flex-col gap-4">
        <img
          src={mathPathTitle}
          alt="MathPath Icon/Logo"
          className="md:hidden self-center aspect-[16/9] w-[40%] min-w-[200px] max-w-[300px] hover:scale-105 hover:cursor-pointer md:w-[10vw] transition-transform duration-100"
          onClick={() => navigate("/")}
        />
        <h3 className="text-center text-xl font-bold text-white md:text-2xl">
          Choose Account Type
        </h3>

        <div className="flex gap-4">
          {/* Student */}
          <div className="w-full">
            <input
              type="radio"
              name="accountType"
              id="student"
              value="Student"
              className="peer hidden"
              onChange={() => {
                setAccountType("Student");
                setLoginError(null);
                setIdentifier("");
                setValue("accountType", "Student");
                clearErrors();
              }}
              defaultChecked
            />
            <label
              htmlFor="student"
              className="cursor-pointer w-full flex items-center justify-center rounded-md border border-white px-6 py-3 text-white peer-checked:bg-white/30 transition"
            >
              Student
            </label>
          </div>

          {/* Teacher */}
          <div className="w-full">
            <input
              type="radio"
              name="accountType"
              id="teacher"
              value="Teacher"
              className="peer hidden"
              onChange={() => {
                setAccountType("Teacher");
                setLoginError(null);
                setIdentifier("");
                setValue("accountType", "Teacher");
              }}
            />
            <label
              htmlFor="teacher"
              className="cursor-pointer w-full flex items-center justify-center rounded-md border border-white px-6 py-3 text-white peer-checked:bg-white/30 transition"
            >
              Teacher
            </label>
          </div>
        </div>

        <div className="text-white font-normal text-center">
          <p>Hi {accountType === "Student" ? "student" : "teacher"}!</p>
          <p>Please fill out the form below to get started</p>
        </div>

        <div className="w-full h-[1px] bg-gray-200/50"></div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full flex-1"
      >
        <div className="flex flex-col justify-between flex-1 gap-4">
          <div className="flex flex-col gap-4">
            {/* login error */}
            <AnimatePresence>
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-300 text-red-500 rounded-md py-3 px-1 flex items-center gap-2 w-full"
                >
                  <GoShieldX className="h-8 w-8" />
                  <p className="text-sm">{loginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Identifier */}
            <div className="relative">
              <input
                type={accountType === "Student" ? "text" : "email"}
                {...register("identifier")}
                value={identifier}
                onChange={handleChange}
                placeholder=" "
                className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] bg-gray-100/30 focus:outline-none focus:ring-0`}
                inputMode={accountType === "Student" ? "numeric" : undefined}
              />
              <label
                className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]`}
              >
                {accountType === "Student"
                  ? "Learner Reference Number (LRN)"
                  : "Email"}
              </label>
              {errors.identifier && (
                <p className="text-xs text-red-500">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                maxLength={32}
                placeholder=" "
                className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] bg-gray-100/30 focus:outline-none focus:ring-0`}
              />
              <label
                className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black hover:cursor-pointer"
              >
                {showPassword ? (
                  <FaEye className="w-5 h-5" />
                ) : (
                  <FaEyeSlash className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <button
              className="text-left text-sm text-gray-100 opacity-50 transition-opacity duration-200 hover:cursor-pointer w-fit hover:underline hover:opacity-100"
              type="button"
              onClick={() => navigate("/auth/forgot-password")}
            >
              Forgot Password?
            </button>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-base text-white font-bold hover:bg-[var(--primary-yellow)]/100 transition-color duration-200 rounded-lg bg-[var(--primary-yellow)]/80 p-3 hover:cursor-pointer"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="flex gap-2 self-center">
            <p className="text-white">Don't have an account?</p>
            <button
              type="button"
              className="text-[var(--primary-yellow)] hover:cursor-pointer hover:underline"
              onClick={() => navigate("/auth/register")}
            >
              Register
            </button>
          </div>
          {clickTracker === 10 && (
            <div className="flex gap-2 self-center">
              <button
                type="button"
                className="text-gray-400 hover:cursor-pointer hover:underline"
                onClick={() => navigate("/auth/admin/login")}
              >
                Login as Admin
              </button>
            </div>
          )}
        </div>
      </form>
    </main>
  );
}
