import { type ReactElement } from "react";
import { capitalizeWord } from "../../../core/utils/string.util";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import { useStudentContext } from "../../contexts/student.context";

export default function Profile(): ReactElement {
  const { student } = useStudentContext();

  if (!student) {
    return (
      <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-inherit p-2">
        <div className="text-gray-900 dark:text-gray-100">
          Loading profile...
        </div>
      </main>
    );
  }

  const progressPercentage = Math.round(
    (student.exp.current / student.exp.nextLevel) * 100,
  );

  const isVerified = student.verified.verified;

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
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-green-500 dark:border-green-400 overflow-hidden transition-colors duration-200">
                <img
                  src={getProfilePicture(student.profilePicture)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 dark:bg-green-600 text-white rounded-full px-2 py-1 text-xs font-bold transition-colors duration-200">
                Lvl {student.level}
              </div>
            </div>

            {/* basic info */}
            <div className="flex-1 flex items-center sm:items-start flex-col min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate transition-colors duration-200">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm truncate transition-colors duration-200">
                {student.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-colors duration-200">
                {student.characterName} • {student.gender}
              </p>

              {/* quick stats */}
              <div className="flex gap-3 mt-2">
                <div className="text-center">
                  <div className="text-sm font-bold text-green-600 dark:text-green-400 transition-colors duration-200">
                    {student.streak}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    Streak
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400 transition-colors duration-200">
                    {student.exp.current}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    EXP
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-200">
              <span>Level {student.level} Progress</span>
              <span>
                {student.exp.current} / {student.exp.nextLevel}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors duration-200">
              <div
                className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
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
                  {capitalizeWord(student.firstName)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                  Last Name
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {capitalizeWord(student.lastName)}
                </div>
              </div>

              {student.middleName && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                    Middle Name
                  </label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                    {capitalizeWord(student.middleName)}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                  Gender
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {student.gender}
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
                  {student.email}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                  Reference Number
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm font-mono text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {student.referenceNumber}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                  Member Since
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {new Date(student.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
                  Last Online
                </label>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {new Date(student.lastOnline).toLocaleDateString()}
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
