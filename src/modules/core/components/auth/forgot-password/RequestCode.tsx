import { useEffect, useState, type ReactElement } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { PiShieldWarningDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { requestPasswordResetCodeService } from "../../../../auth/services/auth.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RequestCodeDTO,
  RequestCodeSchema,
} from "../../../../student/types/student-forgot-pass.schema";
import mathPathTitle from "../../../../../assets/svgs/mathpath-title.svg";
import { handleApiError } from "../../../utils/api/error.util";
import { isAxiosError } from "axios";

export default function RequestCode(): ReactElement {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestCodeDTO>({
    resolver: zodResolver(RequestCodeSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: RequestCodeDTO) => {
    setServerError(null);
    try {
      await requestPasswordResetCodeService(data.email);
      localStorage.setItem("resetEmail", data.email);
      navigate("/auth/forgot-password/verify-code", {
        state: { email: data.email },
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorData = handleApiError(error);
        if (errorData.error === "EMAIL_NOT_FOUND") {
          setServerError("We can't find that email.");
        } else if (errorData.error === "RESET_ALREADY_REQUESTED") {
          setServerError(
            "You can only request a password code once every hour.",
          );
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      } else {
        setServerError("Unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) {
      navigate("/forgot-password/verify", {
        state: { email: savedEmail },
        replace: true,
      });
    }
  }, [navigate]);

  return (
    <main className="relative w-full min-h-screen overflow-auto md:min-h-0 flex gap-4 md:h-fit min-w-[300px] flex-col rounded-xl border-2 border-white/20 bg-black/50 py-4 px-8 shadow-lg backdrop-blur-sm  md:max-w-lg transition-all duration-200">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Header */}
        <img
          src={mathPathTitle}
          alt="MathPath Icon/Logo"
          className="md:hidden self-center aspect-[16/9] w-[40%] min-w-[200px] max-w-[300px] hover:scale-105 hover:cursor-pointer md:w-[10vw] transition-transform duration-100"
          onClick={() => navigate("/")}
        />
        <div className="flex flex-col items-center gap-4">
          <PiShieldWarningDuotone className="w-24 h-24 text-[var(--primary-yellow)]" />
          <h3 className="font-bold text-xl text-white">Forgot Password</h3>
          <p className="text-gray-100 text-center">
            Enter your email and we'll send you a code to reset your password.
          </p>
        </div>

        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            placeholder=" "
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 bg-gray-100/30`}
            {...register("email")}
          />
          <label
            className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 text-gray-800 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]`}
          >
            Email
          </label>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <p className="text-xs text-red-500 font-semibold">{serverError}</p>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white text-base font-bold hover:bg-[var(--primary-yellow)]/100 transition-color duration-200 rounded-lg bg-[var(--primary-yellow)]/80 py-2 hover:cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          <button
            type="button"
            className={`font-bold text-gray-100 gap-2 items-center w-fit self-center opacity-80 hover:opacity-100 transition-opacity duration-200 hover:cursor-pointer ${isSubmitting ? "hidden" : "flex"}`}
            onClick={() => navigate("/auth/login")}
          >
            <FaAngleLeft />
            <p className="text-sm">Back to Login</p>
          </button>
        </div>
      </form>
    </main>
  );
}
