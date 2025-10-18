import { isAxiosError } from "axios";
import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/api/error.util";
import { changePasswordService } from "../../../../auth/services/auth-settings.service";
import { useAuth } from "../../../../auth/contexts/auth.context";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  ChangePasswordDTO,
  ChangePasswordSchema,
} from "../../../../auth/types/auth-settings.type";

export default function ChangePasswordCard(): ReactElement {
  const { user } = useAuth();
  console.log(user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<ChangePasswordDTO>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: ChangePasswordDTO) => {
    // check if user is authenticated
    if (!user?.id) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    try {
      await changePasswordService(user.id, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });

      toast.success("Password changed successfully!");
      reset();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorData = handleApiError(error);

        switch (errorData.error) {
          case "INVALID_CURRENT_PASSWORD":
            setError("currentPassword", {
              type: "manual",
              message: "Invalid current password",
            });
            break;
          default:
            toast.error("Failed to change password. Please try again.");
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm p-6 transition-colors duration-200">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">
          Change Password
        </h4>
        <p className="text-gray-600 dark:text-gray-400">
          Please log in to change your password.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm p-6 transition-colors duration-200">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">
        Change Password
      </h4>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        {/* current password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
              {...register("currentPassword")}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* new password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.newPassword.message}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Must be at least 8 characters long with at least one special
            character and different from current password
          </p>
        </div>

        {/* confirm new password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
              {...register("confirmNewPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed w-full"
        >
          {isSubmitting ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
