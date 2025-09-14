import { FormEvent, useState, type ReactElement } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { PiShieldWarningDuotone } from "react-icons/pi";
import { useAuth } from "../../../../auth/contexts/auth.context";
import { useNavigate } from "react-router-dom";

export default function RequestCode(): ReactElement {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string | boolean | null>(null);
  const { requestPasswordResetCode, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === "") {
      setErrors(true);
      return;
    }

    try {
      await requestPasswordResetCode(email);
      navigate("/auth/forgot-password/verify-code", { state: { email } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "EMAIL_NOT_FOUND") {
          setErrors("We can't find that email.");
        } else {
          setErrors("Something went wrong. Please try again.");
        }
      } else {
        setErrors("Unexpected error occurred.");
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="transition-all duration-200 flex h-fit w-[90%] min-w-[300px] max-w-sm flex-col rounded-xl border-2 border-white/20 bg-white/10 py-4 px-8 shadow-lg backdrop-blur-lg sm:max-w-md md:max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* header */}
        <div className="flex flex-col items-center gap-4">
          <PiShieldWarningDuotone className="w-24 h-24 text-[var(--primary-yellow)]" />
          <h3 className="font-bold text-xl text-white">Forgot Password</h3>
          <p className="text-gray-100 text-center">
            Enter your email and we'll send you a code to reset your password.
          </p>
        </div>

        {/* inputs */}
        <div>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => handleChange(e)}
              className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0
                ${errors ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
              placeholder=" "
            />
            <label
              className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300
                ${errors ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
            >
              Email
            </label>
          </div>
        </div>

        {errors && typeof errors === "string" ? (
          <p className="text-red-500 font-semibold text-sm">{errors}</p>
        ) : null}

        {/* buttons */}
        <div className="flex flex-col gap-8">
          {/* submit button */}
          <button
            type="submit"
            className="text-white text-base font-bold hover:bg-[var(--primary-yellow)]/100 transition-color duration-200 rounded-lg bg-[var(--primary-yellow)]/80 py-2 hover:cursor-pointer"
          >
            Submit
          </button>

          {/* back to login button */}
          <button
            type="button"
            className="font-bold text-gray-100 flex gap-2 items-center w-fit self-center opacity-80 hover:opacity-100 transition-opacity duration-200 hover:cursor-pointer"
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
