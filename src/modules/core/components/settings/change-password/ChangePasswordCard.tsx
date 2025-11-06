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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please log in to change your password.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          {/* current password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                {...register("currentPassword")}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* new password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">
                {errors.newPassword.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters long with at least one special
              character and different from current password
            </p>
          </div>

          {/* confirm new password */}
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmNewPassword")}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
