import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { CiCamera } from "react-icons/ci";
import { getProfilePicture } from "../../../../core/utils/profile-picture.util.js";
import { Student } from "../../../../student/types/student.type.js";
import { Teacher } from "../../../../teacher/types/teacher.type.js";
import { ProfilePicture } from "../../../../core/types/user.type.js";
import ChangeProfilePictureModal from "./ChangeProfilePictureModal";
import { changeAccountSettingsService } from "../../../../auth/services/auth-settings.service";
import { useAuth } from "../../../../auth/contexts/auth.context";
import { handleApiError } from "../../../../core/utils/api/error.util";
import {
  ChangeAccountSettingsDTO,
  ChangeAccountSettingsSchema,
} from "../../../../auth/types/auth-settings.type";
import ProfilePictureModal from "./ProfilePictureModal.js";

type StudentAccountSettingsCardProps = {
  user: Student;
  userType: "student";
};

type TeacherAccountSettingsCardProps = {
  user: Teacher;
  userType: "teacher";
};

// TODO: admin

type AccountSettingsCardProps =
  | StudentAccountSettingsCardProps
  | TeacherAccountSettingsCardProps;

export default function AccountSettingsCard(
  props: AccountSettingsCardProps,
): ReactElement {
  const { user, userType } = props;
  const { user: authUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<ProfilePicture | null>(
    user.profilePicture,
  );
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [showViewProfilePictureModal, setShowViewProfilePictureModal] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ChangeAccountSettingsDTO>({
    resolver: zodResolver(ChangeAccountSettingsSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || "",
      profilePicture: user.profilePicture,
    },
  });

  const handleSave = async (data: ChangeAccountSettingsDTO) => {
    if (!isEditing) return;

    if (!authUser?.id) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await changeAccountSettingsService(authUser.id, {
        ...data,
        profilePicture: profilePicture || "Default",
      });

      toast.success("Account information updated successfully!");
      setIsEditing(false);
      setShowProfilePictureModal(false);

      // update local form state with new values
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        profilePicture: data.profilePicture,
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorData = handleApiError(error);

        switch (errorData.error) {
          case "INVALID_FIRST_NAME":
            setError("firstName", {
              type: "manual",
              message: "Invalid first name",
            });
            break;
          case "INVALID_LAST_NAME":
            setError("lastName", {
              type: "manual",
              message: "Invalid last name",
            });
            break;
          case "INVALID_MIDDLE_NAME":
            setError("middleName", {
              type: "manual",
              message: "Invalid middle name",
            });
            break;
          default:
            toast.error(
              "Failed to update account information. Please try again.",
            );
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || "",
    });
    setProfilePicture(user.profilePicture);
    setIsEditing(false);
    setShowProfilePictureModal(false);
  };

  const handleProfilePictureClick = () => {
    if (isEditing) {
      setShowProfilePictureModal(true);
    } else {
      setShowViewProfilePictureModal(true);
    }
  };

  const handleProfilePictureSelect = (picture: ProfilePicture) => {
    setProfilePicture(picture);
  };

  const handleUploadPicture = () => {
    console.log("Upload profile picture clicked - to be implemented");
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isEditing) {
      e.preventDefault();
    }
  };

  const isStudent = userType === "student";
  const student = user as Student;
  const teacher = user as Teacher;

  return (
    <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm p-6 transition-colors duration-200">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">
        Account Information
      </h4>

      <form
        onSubmit={handleSubmit((data) => {
          if (!isEditing) return;
          handleSave(data);
        })}
        onKeyDown={handleKeyDown}
        className="space-y-4 max-w-2xl"
      >
        {/* profile picture */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-full border-2 overflow-hidden cursor-pointer ${
                isEditing
                  ? "border-green-500 dark:border-green-400 hover:border-green-600 dark:hover:border-green-300 transition-colors"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              onClick={handleProfilePictureClick}
            >
              <img
                src={getProfilePicture(profilePicture ?? "Default")}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 dark:bg-green-600 text-white rounded-full p-1.5 shadow-sm">
                <CiCamera className="w-3 h-3" />
              </div>
            )}
          </div>
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">
              Profile Picture
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEditing
                ? "Click on the photo to change"
                : "Go to edit mode to change profile picture"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* first name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </>
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                {user.firstName}
              </div>
            )}
          </div>

          {/* last name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </>
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                {user.lastName}
              </div>
            )}
          </div>
        </div>

        {/* middle name */}
        {(user.middleName || isEditing) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Middle Name
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  {...register("middleName")}
                />
                {errors.middleName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.middleName.message}
                  </p>
                )}
              </>
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                {user.middleName}
              </div>
            )}
          </div>
        )}

        {/* read only fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
            {user.email}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isStudent
              ? "Contact your teacher to change email"
              : "Contact administrator to change email"}
          </p>
        </div>

        {/* gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gender
          </label>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white capitalize">
            {isStudent ? student.gender : teacher.gender}
          </div>
        </div>

        {/* student only info */}
        {isStudent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reference Number
            </label>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm font-mono text-gray-900 dark:text-white">
              {student.referenceNumber}
            </div>
          </div>
        )}

        {/* profile picture modal */}
        {showProfilePictureModal && (
          <ChangeProfilePictureModal
            onClose={() => setShowProfilePictureModal(false)}
            currentProfilePicture={profilePicture}
            onSelectProfilePicture={handleProfilePictureSelect}
            onUploadPicture={handleUploadPicture}
            onSave={() => setShowProfilePictureModal(false)}
          />
        )}

        <ProfilePictureModal
          isOpen={showViewProfilePictureModal}
          onClose={() => setShowViewProfilePictureModal(false)}
          picture={profilePicture}
        />
      </form>

      <div className="flex gap-3 pt-4">
        {isEditing ? (
          <>
            <button
              type="submit"
              form="account-form"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleSubmit((data) => handleSave(data))}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleEditClick}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Edit Information
          </button>
        )}
      </div>
    </div>
  );
}
