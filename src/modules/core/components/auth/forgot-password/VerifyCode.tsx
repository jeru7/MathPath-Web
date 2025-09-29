import { useRef, type ReactElement, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyPasswordResetCodeService } from "../../../../auth/services/auth.service";
import { handleApiError } from "../../../utils/api/error.util";
import {
  VerifyCodeDTO,
  VerifyCodeSchema,
} from "../../../../student/types/student-forgot-pass.schema";
import mathPathTitle from "../../../../../assets/svgs/mathpath-title.svg";

export default function VerifyCode(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const email =
    (location.state as { email: string })?.email ||
    localStorage.getItem("resetEmail");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyCodeDTO>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: { code: Array(6).fill("") },
  });

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email) navigate("/auth/forgot-password", { replace: true });
  }, [email, navigate]);

  const onSubmit = async (data: VerifyCodeDTO) => {
    const codeValue = data.code.join(""); // join array into string for API
    try {
      await verifyPasswordResetCodeService(email ?? "", codeValue);
      localStorage.removeItem("resetEmail");
      navigate("/auth/forgot-password/change-password", {
        state: { email, code: codeValue },
      });
    } catch (err: unknown) {
      const errorData = handleApiError(err);
      if (
        errorData.error === "INVALID_CODE" ||
        errorData.error === "EXPIRED_CODE"
      ) {
        setError("code", { message: "Invalid code. Please try again." });
      } else {
        setError("code", {
          message: "Something went wrong. Please try again.",
        });
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    value: string,
    onChange: (v: string[]) => void,
    code: string[],
  ) => {
    if (e.key === "Backspace" && !value && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      onChange(newCode);
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <main className="relative w-full min-h-screen overflow-auto md:mt-20 md:min-h-0 flex gap-16 md:gap-4 md:h-fit min-w-[300px] flex-col rounded-xl border-2 border-white/20 bg-black/50 py-4 px-8 shadow-lg backdrop-blur-sm  md:max-w-lg transition-all duration-200">
      <header className="flex flex-col gap-4">
        <img
          src={mathPathTitle}
          alt="MathPath Icon/Logo"
          className="md:hidden self-center aspect-[16/9] w-[40%] min-w-[200px] max-w-[300px] hover:scale-105 hover:cursor-pointer md:w-[10vw] transition-transform duration-100"
          onClick={() => navigate("/")}
        />
        <RiLockPasswordLine className="self-center text-[var(--primary-yellow)] h-24 w-24" />
        <h3 className="text-white font-bold text-xl text-center mb-4">
          Enter Verification Code
        </h3>
        <p className="text-gray-100 text-center">
          Please enter the 6-digit code sent to your email.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-6"
      >
        <Controller
          name="code"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div
              className="flex gap-2 justify-center"
              onPaste={(e: React.ClipboardEvent<HTMLDivElement>) => {
                e.preventDefault();
                const paste = e.clipboardData.getData("Text").trim();
                if (!/^\d{6}$/.test(paste)) return;
                const newCode = paste.split("");
                onChange(newCode);
                inputsRef.current[5]?.focus(); // focus last input
              }}
            >
              {value.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => {
                    if (!/^\d*$/.test(e.target.value)) return;
                    const newCode = [...value];
                    newCode[index] = e.target.value;
                    onChange(newCode);
                    if (e.target.value && index < 5)
                      inputsRef.current[index + 1]?.focus();
                  }}
                  onKeyDown={(e) =>
                    handleKeyDown(e, index, digit, onChange, value)
                  }
                  className={`w-12 h-12 text-center text-lg rounded border-2 text-white focus:outline-none focus:border-[var(--primary-yellow)]`}
                  style={{
                    background: errors.code
                      ? "rgba(239, 68, 68, .30)"
                      : "rgba(255, 255, 255, .10)",
                    borderColor: errors.code
                      ? "rgba(239, 68, 68, .50)"
                      : "rgba(255, 255, 255, .50)",
                  }}
                />
              ))}
            </div>
          )}
        />

        {errors.code && (
          <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white text-base font-bold hover:bg-[var(--primary-yellow)]/100 transition-colors duration-200 rounded-lg bg-[var(--primary-yellow)]/80 py-2 px-6"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>
      </form>
    </main>
  );
}
