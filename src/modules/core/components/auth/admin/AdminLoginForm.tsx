import { useState, type ReactElement } from "react";
import mathPathTitle from "../../../../../assets/svgs/mathpath-title.svg";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import {
  AdminLoginDTO,
  AdminLoginSchema,
} from "../../../../admin/types/admin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { handleApiError } from "../../../utils/api/error.util";
import { AnimatePresence, motion } from "framer-motion";
import { GoShieldX } from "react-icons/go";
import { useAuth } from "../../../../auth/contexts/auth.context";

export default function AdminLoginForm(): ReactElement {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginDTO>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginDTO) => {
    try {
      await adminLogin(data.email, data.password);
    } catch (error: unknown) {
      const errorData = handleApiError(error);

      if (
        errorData.error === "INVALID_PASSWORD" ||
        errorData.error === "INVALID_EMAIL"
      ) {
        setLoginError("Invalid email or password. Try again.");
      } else {
        setLoginError("An unexpected error occurred. Try again later.");
      }
    }
  };

  return (
    <main className="relative w-full min-h-screen mt-24 overflow-auto md:min-h-0 flex gap-4 md:h-fit min-w-[300px] flex-col rounded-xl border-2 border-white/20 bg-black/50 py-4 px-8 shadow-lg backdrop-blur-sm  md:max-w-2xl transition-all duration-200">
      <header className="flex flex-col gap-4">
        <img
          src={mathPathTitle}
          alt="MathPath Icon/Logo"
          className="md:hidden self-center aspect-[16/9] w-[40%] min-w-[200px] max-w-[300px] hover:scale-105 hover:cursor-pointer md:w-[10vw] transition-transform duration-100"
          onClick={() => navigate("/")}
        />
        <h3 className="text-center text-xl font-bold text-white md:text-2xl">
          Admin Login
        </h3>
      </header>
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={"email"}
            {...register("email")}
            placeholder=" "
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] bg-gray-100/30 focus:outline-none focus:ring-0`}
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

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
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
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-base text-white font-bold hover:bg-[var(--primary-yellow)]/100 transition-color duration-200 rounded-lg bg-[var(--primary-yellow)]/80 p-3 hover:cursor-pointer"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="flex gap-2 self-center">
        <button
          type="button"
          className="text-gray-400 hover:cursor-pointer hover:underline flex gap-1 items-baseline"
          onClick={() => navigate("/auth/login")}
        >
          <MdOutlineKeyboardArrowLeft className="w-3 h-3" />
          <p>Back</p>
        </button>
      </div>
    </main>
  );
}
