import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { GoShieldX } from "react-icons/go";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../../../auth/contexts/auth.context";
import { AccountType } from "../../../../auth/types/auth.type";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm(): ReactElement {
  const navigate = useNavigate();
  const { user, login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({ identifier: false, password: false });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<AccountType>("Student");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && user) {
      if (accountType === "Teacher") {
        navigate(`/${user.role}/${user.id}`);
      } else if (accountType === "Student") {
        navigate(`/${user.role}/${user.id}`);
      }
    }
  }, [user, isLoading, accountType, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors({ identifier: false, password: false });
    setLoginError(null);

    let newValue = value;
    if (name === "identifier" && accountType === "Student") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isInputEmpty = {
      identifier: formData.identifier.trim() === "",
      password: formData.password.trim() === "",
    };

    setErrors(isInputEmpty);

    if (isInputEmpty.identifier || isInputEmpty.password) return;

    try {
      await login(formData.identifier, formData.password);
      setLoginError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Failed to log in.") {
          if (accountType === "Teacher") {
            setLoginError("Invalid email or password. Try again.");
          } else if (accountType === "Student") {
            setLoginError("Invalid LRN or password. Try again.");
          }
        }
      }
    }
  };

  return (
    <main className="transition-all duration-200 z-30 flex h-fit w-[90%] min-w-[300px] max-w-sm flex-col gap-4 rounded-xl border-2 border-white/20 bg-white/10 py-4 px-8 shadow-lg backdrop-blur-lg sm:max-w-md md:max-w-lg">
      <div className="flex flex-col gap-4">
        <h3 className="text-center text-xl font-bold text-white md:text-2xl">
          Choose Account Type
        </h3>

        <div className="flex gap-4">
          {/* Student Radio Button */}
          <div className="w-full">
            <input
              type="radio"
              name="accountType"
              id="student"
              value={"Student"}
              className="peer hidden"
              onChange={() => {
                setAccountType("Student");
                setLoginError(null);
                setFormData({ identifier: "", password: "" });
                setErrors({ identifier: false, password: false });
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

          {/* Teacher Radio Button */}
          <div className="w-full">
            <input
              type="radio"
              name="accountType"
              id="teacher"
              value={"Teacher"}
              className="peer hidden"
              onChange={() => {
                setAccountType("Teacher");
                setLoginError(null);
                setFormData({ identifier: "", password: "" });
                setErrors({ identifier: false, password: false });
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

        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-gray-200/50"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xl">
        {/* Login Error */}
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

        {/* Identifier - Email/LRN */}
        <div className="relative">
          <input
            type={accountType === "Student" ? "text" : "email"}
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors.identifier ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
            placeholder=" "
            inputMode={accountType === "Student" ? "numeric" : undefined}
          />
          <label
            className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
                ${errors.identifier ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
          >
            {accountType === "Student" ? "LRN" : "Email"}
          </label>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors.password ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
            placeholder=" "
          />
          <label
            className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
                ${errors.password ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
          >
            Password
          </label>
          {/* show toggler */}
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
          className="text-base text-white font-bold hover:bg-[var(--primary-yellow)]/100 transition-color duration-200 rounded-lg bg-[var(--primary-yellow)]/80 p-3 hover:cursor-pointer"
        >
          Login
        </button>
      </form>
    </main>
  );
}
