import { type ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

import {
  EditTeacherDTO,
  EditTeacherSchema,
} from "../../../teacher/types/teacher.schema";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import { Gender, ProfilePicture } from "../../../core/types/user.type";
import { Teacher } from "../../../teacher/types/teacher.type";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import ChangeProfilePictureModal from "../../../core/components/settings/account-settings/ChangeProfilePictureModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EditTeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onUpdateTeacher: (teacherId: string, data: EditTeacherDTO) => Promise<void>;
  isSubmitting?: boolean;
};

export default function EditTeacherModal({
  isOpen,
  onClose,
  teacher,
  onUpdateTeacher,
  isSubmitting = false,
}: EditTeacherModalProps): ReactElement {
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditTeacherDTO>({
    resolver: zodResolver(EditTeacherSchema),
    defaultValues: {
      firstName: teacher?.firstName || "",
      lastName: teacher?.lastName || "",
      middleName: teacher?.middleName || "",
      gender: (teacher?.gender as Gender) || null,
      email: teacher?.email || "",
      profilePicture: teacher?.profilePicture || "Default",
    },
  });

  const profilePictureValue = watch("profilePicture");

  // update form when teacher changes
  useEffect(() => {
    if (teacher) {
      reset({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        middleName: teacher.middleName || "",
        gender: teacher.gender as Gender,
        email: teacher.email,
        profilePicture: teacher.profilePicture || "Default",
      });
    }
  }, [teacher, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: EditTeacherDTO) => {
    if (!teacher) return;

    try {
      await onUpdateTeacher(teacher.id, data);
      reset(data);
      onClose();
      toast.success("Teacher updated successfully");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const errorData: APIErrorResponse = handleApiError(err);

        switch (errorData.error) {
          case "EMAIL_ALREADY_EXISTS":
            setError("email", {
              type: "manual",
              message: errorData.message || "Email already exists",
            });
            break;

          default:
            toast.error("Failed to update teacher");
        }
      } else {
        toast.error("Failed to update teacher");
      }
    }
  };

  const handleOpenProfilePictureModal = () => {
    setIsProfilePictureModalOpen(true);
  };

  const handleCloseProfilePictureModal = () => {
    setIsProfilePictureModalOpen(false);
  };

  const handleSelectProfilePicture = (picture: ProfilePicture) => {
    setValue("profilePicture", picture, { shouldDirty: true });
  };

  const handleSaveProfilePicture = () => {
    setIsProfilePictureModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* profile picture */}
            <div className="space-y-3">
              <Label className="font-semibold">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border">
                    <img
                      src={getProfilePicture(profilePictureValue || "Default")}
                      alt="Current profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOpenProfilePictureModal}
                  className="text-sm"
                >
                  Change Picture
                </Button>
              </div>
              <input
                type="hidden"
                {...register("profilePicture")}
                value={profilePictureValue || "Default"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* first name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name
                  {errors.firstName && (
                    <span className="text-destructive text-xs ml-2">
                      {errors.firstName.message}
                    </span>
                  )}
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Enter first name"
                />
              </div>

              {/* last name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name
                  {errors.lastName && (
                    <span className="text-destructive text-xs ml-2">
                      {errors.lastName.message}
                    </span>
                  )}
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Enter last name"
                />
              </div>

              {/* middle name */}
              <div className="space-y-2">
                <Label htmlFor="middleName">
                  Middle Name
                  <span className="text-muted-foreground text-xs ml-1">
                    (Optional)
                  </span>
                  {errors.middleName && (
                    <span className="text-destructive text-xs ml-2">
                      {errors.middleName.message}
                    </span>
                  )}
                </Label>
                <Input
                  id="middleName"
                  {...register("middleName")}
                  placeholder="Enter middle name"
                />
              </div>

              {/* gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender
                  {errors.gender && (
                    <span className="text-destructive text-xs ml-2">
                      {errors.gender.message}
                    </span>
                  )}
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* email */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">
                  Email
                  {errors.email && (
                    <span className="text-destructive text-xs ml-2">
                      {errors.email.message}
                    </span>
                  )}
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Updating..." : "Update Teacher"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* profile picture selection modal */}
      {isProfilePictureModalOpen && (
        <ChangeProfilePictureModal
          onClose={handleCloseProfilePictureModal}
          currentProfilePicture={profilePictureValue || "Default"}
          onSelectProfilePicture={handleSelectProfilePicture}
          onSave={handleSaveProfilePicture}
        />
      )}
    </>
  );
}
