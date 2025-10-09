import { type ReactElement } from "react";
import { capitalizeWord } from "../../../core/utils/string.util";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import { useTeacherContext } from "../../context/teacher.context";
import { FaCheck } from "react-icons/fa";

export default function Profile(): ReactElement {
  const { teacher } = useTeacherContext();

  if (!teacher) {
    return (
      <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-inherit p-2">
        <div className="text-gray-900 dark:text-gray-100">
          Loading profile...
        </div>
      </main>
    );
  }

  const isVerified = teacher.verified.verified;

  return (
    <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-inherit p-2 transition-colors duration-200">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Profile
        </h3>
      </header>

      <div className="grid gap-2">
        {/* overview */}
        <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
            {/* profile picture */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500 dark:border-blue-400 overflow-hidden transition-colors duration-200">
                <img
                  src={getProfilePicture(teacher.profilePicture ?? "Default")}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-500 dark:bg-blue-600 text-white rounded-full px-2 py-1 text-xs font-bold transition-colors duration-200">
                Teacher
              </div>
              {isVerified && (
                <div className="absolute -top-1 -right-1 bg-green-500 dark:bg-green-600 text-white rounded-full p-1 transition-colors duration-200">
                  <FaCheck className="w-2 h-2" />
                </div>
              )}
            </div>

            {/* basic info */}
            <div className="flex-1 flex items-center sm:items-start flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate transition-colors duration-200">
                  {teacher.firstName} {teacher.lastName}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm truncate transition-colors duration-200">
                {teacher.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-colors duration-200">
                {teacher.gender}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* personal info */}
          <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
              Personal Information
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                  First Name
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {capitalizeWord(teacher.firstName)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                  Last Name
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {capitalizeWord(teacher.lastName)}
                </div>
              </div>

              {teacher.middleName && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                    Middle Name
                  </label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                    {capitalizeWord(teacher.middleName)}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                  Gender
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {teacher.gender}
                </div>
              </div>
            </div>
          </div>

          {/* account info */}
          <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
              Account Information
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                  Email Address
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 truncate transition-colors duration-200">
                  {teacher.email}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                  Verification Status
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm transition-colors duration-200">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      isVerified
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    } transition-colors duration-200`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isVerified
                          ? "bg-green-500 dark:bg-green-400"
                          : "bg-yellow-500 dark:bg-yellow-400"
                      } transition-colors duration-200`}
                    ></div>
                    {isVerified ? "Verified" : "Pending Verification"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
