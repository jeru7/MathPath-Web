import { useState, type ReactElement, useRef } from "react";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import { CiCamera } from "react-icons/ci";
import { Student } from "../../../student/types/student.type";
import { Teacher } from "../../../teacher/types/teacher.type";

type StudentAccountSettingsCardProps = {
  user: Student;
  userType: "student";
};

type TeacherAccountSettingsCardProps = {
  user: Teacher;
  userType: "teacher";
};

type AccountSettingsCardProps =
  | StudentAccountSettingsCardProps
  | TeacherAccountSettingsCardProps;

export default function AccountSettingsCard(
  props: AccountSettingsCardProps,
): ReactElement {
  const { user, userType } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName || "",
    ...(userType === "student" && {
      characterName: (user as Student).characterName,
    }),
  });
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    console.log("Saving changes:", { ...formData, profilePicture });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || "",
      ...(userType === "student" && {
        characterName: (user as Student).characterName,
      }),
    });
    setProfilePicture(user.profilePicture);
    setIsEditing(false);
  };

  const handleProfilePictureClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  const isStudent = userType === "student";
  const student = user as Student;
  const teacher = user as Teacher;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm p-6 transition-colors duration-200">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">
        Account Information
      </h4>

      <div className="space-y-4 max-w-2xl">
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
              <div className="absolute -bottom-1 -right-1 bg-green-500 dark:bg-green-600 text-white rounded-full px-2 py-1 text-xs font-bold">
                <CiCamera />
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                {user.firstName}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                {user.lastName}
              </div>
            )}
          </div>
        </div>

        {user.middleName && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Middle Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) =>
                  setFormData({ ...formData, middleName: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                {user.middleName}
              </div>
            )}
          </div>
        )}

        {/* Student-specific Fields */}
        {isStudent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Character Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.characterName}
                onChange={(e) =>
                  setFormData({ ...formData, characterName: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                {student.characterName}
              </div>
            )}
          </div>
        )}

        {/* Read-only Fields */}
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

        {/* Gender Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gender
          </label>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white capitalize">
            {isStudent ? student.gender : teacher.gender}
          </div>
        </div>

        {/* Student-specific Read-only Fields */}
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

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Edit Information
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
