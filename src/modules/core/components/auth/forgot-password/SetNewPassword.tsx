import { useEffect, useState, type ReactElement } from "react";
import { FaEye, FaEyeSlash, FaUserLock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../auth/contexts/auth.context";
import { toast } from "react-toastify";

export default function SetNewPassword(): ReactElement {
  const { changePassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = (location.state as { email: string })?.email;

  const [errors, setErrors] = useState<string | null | boolean>(null);

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [disableConfirmPassword, setDisableConfirmPassword] =
    useState<boolean>(true);

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedNewPassword = newPassword;
    let updatedConfirmPassword = confirmNewPassword;

    setErrors(null);

    if (name === "newPassword") {
      updatedNewPassword = value;
      setNewPassword(value);
    } else if (name === "confirmNewPassword") {
      updatedConfirmPassword = value;
      setConfirmNewPassword(value);
    }

    if (
      updatedNewPassword === updatedConfirmPassword &&
      updatedNewPassword !== "" &&
      updatedConfirmPassword !== ""
    ) {
      setDisableConfirmPassword(false);
    } else {
      setDisableConfirmPassword(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword === "" || confirmNewPassword === "") {
      return;
    }

    if (newPassword.length < 8) {
      setErrors("Password must have at least 8 characters");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]/.test(newPassword)) {
      setErrors("Password must contain at least one special character");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrors("Passwords do not match");
      return;
    }

    try {
      await changePassword(email, newPassword);
      navigate("/auth/login");
      toast.success("Password changed successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors("Something went wrong. Please try again.");
      } else {
        setErrors("Unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    if (!email) navigate("/auth/forgot-password", { replace: true });
  }, [email, navigate]);

  return (
    <main className="transition-all duration-200 flex h-fit w-[90%] min-w-[300px] max-w-sm flex-col rounded-xl border-2 border-white/20 bg-white/10 py-4 px-8 shadow-lg backdrop-blur-lg sm:max-w-md md:max-w-lg">
      <header className="flex flex-col gap-4">
        <FaUserLock className="self-center text-[var(--primary-yellow)] h-24 w-24" />
        <h3 className="text-white font-bold text-xl text-center mb-4">
          Change Password
        </h3>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* new password */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={(e) => handlePasswordChange(e)}
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pr-12 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
            placeholder=" "
          />
          <label
            className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
                ${errors ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
          >
            New Password
          </label>

          {/* show toggler */}
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black hover:cursor-pointer"
          >
            {showNewPassword ? (
              <FaEye className="w-5 h-5" />
            ) : (
              <FaEyeSlash className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* confirmation password */}
        <div className="relative">
          <input
            type={showConfirmationPassword ? "text" : "password"}
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => handlePasswordChange(e)}
            className={`peer block w-full appearance-none rounded-lg border-2 px-2.5 pr-12 pb-2.5 pt-5 text-sm text-[var(--primary-black)] focus:outline-none focus:ring-0 
                ${errors ? "" : "border-transparent bg-gray-100/30 focus:border-black"}`}
            placeholder=" "
          />
          <label
            className={`absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 
                ${errors ? "font-bold text-red-500" : "text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-[var(--primary-black)]"}`}
          >
            Confirm New Password
          </label>

          {/* show toggler */}
          <button
            type="button"
            onClick={() => setShowConfirmationPassword((prev) => !prev)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black hover:cursor-pointer"
          >
            {showConfirmationPassword ? (
              <FaEye className="w-5 h-5" />
            ) : (
              <FaEyeSlash className="w-5 h-5" />
            )}
          </button>
        </div>

        {errors && (
          <div className="p-3 bg-red-500 rounded-sm">
            <p className="text-white">{errors}</p>
          </div>
        )}

        {/* confirmation button */}
        <button
          type="submit"
          className="text-base text-white font-bold transition-color duration-200 rounded-lg bg-[var(--primary-yellow)]/80 p-3 enabled:hover:bg-[var(--primary-yellow)]/100 enabled:hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disableConfirmPassword}
        >
          Change Password
        </button>
      </form>
    </main>
  );
}
