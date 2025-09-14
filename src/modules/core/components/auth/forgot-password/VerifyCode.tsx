import { useState, useRef, type ReactElement, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../auth/contexts/auth.context";
import { RiLockPasswordLine } from "react-icons/ri";

export default function VerifyCode(): ReactElement {
  const { verifyPasswordResetCode } = useAuth();
  const [code, setCode] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = (location.state as { email: string })?.email;

  const handleChange = (value: string, index: number) => {
    setErrors(null);
    if (!/^\d*$/.test(value)) return; // numbers lang
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevIndex = index - 1;
      inputsRef.current[prevIndex]?.focus();
      const newCode = [...code];
      newCode[prevIndex] = "";
      setCode(newCode);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const codeValue = code.join("");

    if (codeValue.length < 6) return;

    try {
      await verifyPasswordResetCode(email, codeValue);
      navigate("/auth/forgot-password/change-password", {
        state: { email, code: codeValue },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "INVALID_CODE" || err.message === "EXPIRED_CODE") {
          setErrors("Invalid code.");
        } else {
          setErrors("Something went wrong. Please try again.");
        }
      } else {
        setErrors("Unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    if (!email) navigate("/auth/forgot-password", { replace: true });
  }, [email, navigate]);

  return (
    <main className="flex flex-col gap-4 transition-all duration-200 absolute h-fit w-[90%] min-w-[300px] max-w-sm rounded-xl border-2 border-white/20 bg-white/10 py-4 px-8 shadow-lg backdrop-blur-lg sm:max-w-md md:max-w-lg">
      <header className="flex flex-col gap-4">
        <RiLockPasswordLine className="self-center text-[var(--primary-yellow)] h-24 w-24" />
        <h3 className="text-white font-bold text-xl text-center mb-4">
          Enter Verification Code
        </h3>
        <p className="text-gray-100 text-center">
          Please enter the 6-digit code sent to your email.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6"
        autoComplete="off"
      >
        <div className="flex gap-2 justify-center">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              className={`w-12 h-12 text-center text-lg rounded border-2 text-white focus:outline-none focus:border-[var(--primary-yellow)]`}
              style={{
                background: errors
                  ? "rgba(239, 68, 68, .30)"
                  : "rgba(255, 255, 255, .10)",
                borderColor: errors
                  ? "rgba(239, 68, 68, .50)"
                  : "rgba(255, 255, 255, .50)",
              }}
            />
          ))}
        </div>

        {errors && (
          <div className="p-3 bg-red-500 rounded-sm">
            <p className="text-white">Invalid code. Please try again.</p>
          </div>
        )}

        <button
          type="submit"
          className="text-white text-base font-bold hover:bg-[var(--primary-yellow)]/100 transition-colors duration-200 rounded-lg bg-[var(--primary-yellow)]/80 py-2 px-6"
        >
          Verify
        </button>
      </form>
    </main>
  );
}
