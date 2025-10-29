import { useState, type ReactElement, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaTimes } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

import {
  EditTeacherDTO,
  EditTeacherSchema,
} from "../../../teacher/types/teacher.schema";
import { getCustomSelectColor } from "../../../core/styles/selectStyles";
import FormButtons from "../../../core/components/buttons/FormButtons";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import { Gender, ProfilePicture } from "../../../core/types/user.type";
import ModalOverlay from "../../../core/components/modal/ModalOverlay";
import { Teacher } from "../../../teacher/types/teacher.type";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import ChangeProfilePictureModal from "../../../core/components/settings/account-settings/ChangeProfilePictureModal";

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
      <ModalOverlay isOpen={isOpen} onClose={handleClose}>
        <article className="relative h-[100vh] w-[100vw] p-4 shadow-sm md:h-fit md:w-[80vw] md:overflow-x-hidden lg:w-[60vw] overflow-y-auto rounded-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200 flex flex-col">
          <form
            className="flex flex-col flex-1"
            onSubmit={handleSubmit(onSubmit)}
          >
            <header className="flex items-center justify-between border-b border-b-gray-200 dark:border-b-gray-700 pb-4 transition-colors duration-200">
              <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                Edit Teacher
              </h3>
              <button
                className="hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                type="button"
                onClick={handleClose}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 py-4 overflow-y-auto">
              <div className="flex flex-col gap-6">
                {/* profile picture */}
                <div className="flex flex-col gap-3">
                  <label className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                        <img
                          src={getProfilePicture(
                            profilePictureValue || "Default",
                          )}
                          alt="Current profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenProfilePictureModal}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium border border-gray-300 dark:border-gray-600"
                    >
                      Change Picture
                    </button>
                  </div>
                  <input
                    type="hidden"
                    {...register("profilePicture")}
                    value={profilePictureValue || "Default"}
                  />
                </div>

                {/* personal information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* first name */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="firstName"
                        className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      >
                        First Name
                      </label>
                      {errors.firstName && (
                        <p className="text-xs text-red-500 dark:text-red-400">
                          {errors?.firstName?.message}
                        </p>
                      )}
                    </div>
                    <input
                      type="text"
                      {...register("firstName")}
                      name="firstName"
                      placeholder="Enter first name"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                    />
                  </div>

                  {/* last name */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="lastName"
                        className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      >
                        Last Name
                      </label>
                      {errors.lastName && (
                        <p className="text-xs text-red-500 dark:text-red-400">
                          {errors?.lastName?.message}
                        </p>
                      )}
                    </div>
                    <input
                      type="text"
                      {...register("lastName")}
                      name="lastName"
                      placeholder="Enter last name"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                    />
                  </div>

                  {/* middle name */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="middleName"
                        className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      >
                        Middle Name
                        <span className="ml-1 inline-flex items-center gap-1">
                          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                            (Optional)
                          </span>
                          {errors.middleName && (
                            <span className="text-xs font-normal text-red-500 dark:text-red-400">
                              {errors?.middleName?.message}
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                    <input
                      type="text"
                      {...register("middleName")}
                      name="middleName"
                      placeholder="Enter middle name"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                    />
                  </div>

                  {/* gender */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="gender"
                        className="text-md font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      >
                        Gender
                      </label>
                      {errors.gender && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors?.gender?.message}
                        </span>
                      )}
                    </div>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select<{ value: Gender; label: string }>
                          {...field}
                          id="gender"
                          name="gender"
                          options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                          ]}
                          getOptionLabel={(option) => option.label}
                          getOptionValue={(option) => option.value}
                          styles={getCustomSelectColor<{
                            value: Gender;
                            label: string;
                          }>({
                            minHeight: "42px",
                            padding: "0px 4px",
                            menuWidth: "100%",
                            menuBackgroundColor: "white",
                            backgroundColor: "white",
                            textColor: "#1f2937",
                            dark: {
                              backgroundColor: "#374151",
                              textColor: "#f9fafb",
                              borderColor: "#4b5563",
                              borderFocusColor: "#10b981",
                              optionHoverColor: "#1f2937",
                              optionSelectedColor: "#059669",
                              menuBackgroundColor: "#374151",
                              placeholderColor: "#9ca3af",
                            },
                          })}
                          className="basic-select"
                          classNamePrefix="select"
                          placeholder="Select gender..."
                          onChange={(selected) =>
                            field.onChange(selected?.value)
                          }
                          value={
                            field.value
                              ? {
                                value: field.value,
                                label:
                                  field.value === "Male" ? "Male" : "Female",
                              }
                              : null
                          }
                        />
                      )}
                    />
                  </div>

                  {/* email */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="email"
                        className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      >
                        Email
                      </label>
                      {errors.email && (
                        <p className="text-xs text-red-500 dark:text-red-400">
                          {errors?.email?.message}
                        </p>
                      )}
                    </div>
                    <input
                      type="email"
                      {...register("email")}
                      name="email"
                      placeholder="Enter email"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* action buttons */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <FormButtons
                handleBack={handleClose}
                text={isSubmitting ? "Updating..." : "Update"}
                disabled={isSubmitting || !isDirty}
              />
            </div>
          </form>
        </article>
      </ModalOverlay>

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
