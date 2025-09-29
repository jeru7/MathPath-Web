import { type ReactElement, useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaUserLock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordService } from "../../../../auth/services/auth.service";
import {
  SetNewPasswordDTO,
  SetNewPasswordSchema,
} from "../../../../student/types/student-forgot-pass.schema";
import mathPathTitle from "../../../../../assets/svgs/mathpath-title.svg";

export default function SetNewPassword(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const email = (location.state as { email: string })?.email;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetNewPasswordDTO>({
    resolver: zodResolver(SetNewPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);

  const onSubmit = async (data: SetNewPasswordDTO) => {
    try {
      await changePasswordService(email, data.newPassword);
      toast.success("Password changed successfully");
      navigate("/auth/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (!email) navigate("/auth/forgot-password", { replace: true });
  }, [email, navigate]);

  return (
    <main className="relative w-full min-h-screen overflow-auto md:mt-20 md:min-h-0 flex gap-8 md:gap-4 md:h-fit min-w-[300px] flex-col rounded-xl border-2 border-white/20 bg-black/50 py-4 px-8 shadow-lg backdrop-blur-sm  md:max-w-lg transition-all duration-200">
      <header className="flex flex-col gap-4">
        <img
          src={mathPathTitle}
          alt="MathPath Icon/Logo"
          className="md:hidden self-center aspect-[16/9] w-[40%] min-w-[200px] max-w-[300px] hover:scale-105 hover:cursor-pointer md:w-[10vw] transition-transform duration-100"
          onClick={() => navigate("/")}
        />
        <FaUserLock className="self-center text-[var(--primary-yellow)] h-24 w-24" />
        <h3 className="text-white font-bold text-xl text-center mb-4">
          Change Password
        </h3>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* new password */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder=" "
            maxLength={32}
            className="peer block w-full appearance-none rounded-lg border-2 px-2.5 pr-12 pb-2.5 pt-5 text-sm bg-gray-100/30 text-[var(--primary-black)] focus:outline-none focus:ring-0"
            {...register("newPassword")}
          />
          <label className="absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]">
            New Password
          </label>
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black hover:cursor-pointer"
          >
            {showNewPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* confirm password */}
        <div className="relative">
          <input
            type={showConfirmationPassword ? "text" : "password"}
            placeholder=" "
            maxLength={32}
            className="peer block w-full appearance-none rounded-lg border-2 px-2.5 pr-12 pb-2.5 pt-5 text-sm bg-gray-100/30 text-[var(--primary-black)] focus:outline-none focus:ring-0"
            {...register("confirmNewPassword")}
          />
          <label className="absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]">
            Confirm Password
          </label>
          <button
            type="button"
            onClick={() => setShowConfirmationPassword((prev) => !prev)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black hover:cursor-pointer"
          >
            {showConfirmationPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
          {errors.confirmNewPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="text-base text-white font-bold transition-color duration-200 rounded-lg bg-[var(--primary-yellow)]/80 p-3 enabled:hover:bg-[var(--primary-yellow)]/100 enabled:hover:cursor-pointer"
        >
          {isSubmitting ? "Submitting..." : "Change Password"}
        </button>
      </form>
    </main>
  );
}
