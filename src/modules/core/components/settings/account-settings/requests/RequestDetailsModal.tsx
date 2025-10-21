import { type ReactElement } from "react";
import { FaTimes } from "react-icons/fa";
import { Student } from "../../../../../student/types/student.type";
import { Teacher } from "../../../../../teacher/types/teacher.type";
import { Request } from "../../../../types/requests/request.type";
import { ProfilePicture } from "../../../../types/user.type";
import { getProfilePicture } from "../../../../utils/profile-picture.util";
import { format } from "date-fns-tz";

type RequestDetailsModalProps = {
  showRequestDetailsModal: boolean;
  selectedRequest: Request | null;
  onClose: () => void;
  user: Student | Teacher;
};

export default function RequestDetailsModal({
  showRequestDetailsModal,
  selectedRequest,
  onClose,
  user,
}: RequestDetailsModalProps): ReactElement {
  if (!showRequestDetailsModal || !selectedRequest) return <></>;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getChangedFields = () => {
    const requestedData = selectedRequest.accountInfo;

    // Use original data from the request if available, otherwise fall back to current user data
    const originalData = requestedData?.originalData || {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || "",
      email: user.email,
      profilePicture: user.profilePicture,
    };

    const changes = {
      firstName:
        !!requestedData?.firstName &&
        requestedData.firstName !== originalData.firstName,
      lastName:
        !!requestedData?.lastName &&
        requestedData.lastName !== originalData.lastName,
      middleName:
        !!requestedData?.middleName &&
        requestedData.middleName !== originalData.middleName,
      email:
        !!requestedData?.email && requestedData.email !== originalData.email,
      profilePicture:
        !!requestedData?.profilePicture &&
        requestedData.profilePicture !== originalData.profilePicture,
    };

    const hasAnyChanges = Object.values(changes).some((change) => change);

    return {
      changes,
      hasAnyChanges,
      originalData,
      requestedData,
      currentUserData: user,
    };
  };

  const {
    changes,
    hasAnyChanges,
    originalData,
    requestedData,
    currentUserData,
  } = getChangedFields();
  const isApproved = selectedRequest.status === "approved";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm w-full max-w-4xl mx-4 flex flex-col max-h-[90vh]">
        {/* header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Account Change Request Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Review your account modification request
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm hover:cursor-pointer"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Request Status:
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedRequest.status,
                    )}`}
                  >
                    {selectedRequest.status.charAt(0).toUpperCase() +
                      selectedRequest.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Student Name
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {currentUserData.firstName} {currentUserData.lastName}
                      {currentUserData.middleName &&
                        ` ${currentUserData.middleName}`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {currentUserData.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* changes */}
            {hasAnyChanges ? (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Requested Changes
                </h3>

                <div className="space-y-6">
                  {(changes.firstName ||
                    changes.lastName ||
                    changes.middleName ||
                    changes.email ||
                    changes.profilePicture) && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-sm p-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                        Personal Information
                      </h4>

                      <div className="space-y-4">
                        {/* first name */}
                        {changes.firstName && (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isApproved ? "Previous" : "Current"}
                              </div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isApproved ? "Current" : "Proposed"}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {isApproved ? "Before:" : "Current:"}
                                  </div>
                                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                                    {originalData.firstName}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {isApproved ? "After:" : "New:"}
                                  </div>
                                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-gray-900 dark:text-white font-medium">
                                    {isApproved
                                      ? currentUserData.firstName
                                      : requestedData?.firstName}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* last name */}
                        {changes.lastName && (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isApproved ? "Previous" : "Current"}
                              </div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isApproved ? "Current" : "Proposed"}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {isApproved ? "Before:" : "Current:"}
                                  </div>
                                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                                    {originalData.lastName}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {isApproved ? "After:" : "New:"}
                                  </div>
                                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-gray-900 dark:text-white font-medium">
                                    {isApproved
                                      ? currentUserData.lastName
                                      : requestedData?.lastName}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* middle name */}
                        {changes.middleName && (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isApproved ? "Previous" : "Current"}
                              </div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isApproved ? "Current" : "Proposed"}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {isApproved ? "Before:" : "Current:"}
                                  </div>
                                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                                    {originalData.middleName || "—"}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {isApproved ? "After:" : "New:"}
                                  </div>
                                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-gray-900 dark:text-white font-medium">
                                    {isApproved
                                      ? currentUserData.middleName || "—"
                                      : requestedData?.middleName || "—"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* email */}
                        {changes.email && (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isApproved ? "Previous" : "Current"}
                              </div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isApproved ? "Current" : "Proposed"}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {isApproved ? "Before:" : "Current:"}
                                  </div>
                                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                                    {originalData.email}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {isApproved ? "After:" : "New:"}
                                  </div>
                                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-gray-900 dark:text-white font-medium">
                                    {isApproved
                                      ? currentUserData.email
                                      : requestedData?.email}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* profile picture */}
                        {changes.profilePicture && (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isApproved ? "Previous" : "Current"}
                              </div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isApproved ? "Current" : "Proposed"}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {isApproved ? "Before:" : "Current:"}
                                  </div>
                                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-center">
                                    <img
                                      src={getProfilePicture(
                                        (originalData.profilePicture as ProfilePicture) ??
                                          "Default",
                                      )}
                                      alt={
                                        isApproved
                                          ? "Previous Profile"
                                          : "Current Profile"
                                      }
                                      className="w-16 h-16 rounded-full mx-auto object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {isApproved ? "After:" : "New:"}
                                  </div>
                                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-gray-900 dark:text-white text-center">
                                    <img
                                      src={getProfilePicture(
                                        (isApproved
                                          ? (currentUserData.profilePicture as ProfilePicture)
                                          : (requestedData?.profilePicture as ProfilePicture)) ??
                                          "Default",
                                      )}
                                      alt={
                                        isApproved
                                          ? "Current Profile"
                                          : "New Profile"
                                      }
                                      className="w-16 h-16 rounded-full mx-auto object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    No changes detected in this request
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    The requested information matches your current data.
                  </div>
                </div>
              </div>
            )}

            {/* timeline */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Request Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Submitted Date:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {format(
                      new Date(selectedRequest.createdAt),
                      "MMMM d 'at' h:mm a",
                      {
                        timeZone: "Asia/Manila",
                      },
                    )}
                  </span>
                </div>
                {selectedRequest.updatedAt !== selectedRequest.createdAt && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Last Updated:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      {format(
                        new Date(selectedRequest.updatedAt),
                        "MMMM d 'at' h:mm a",
                        {
                          timeZone: "Asia/Manila",
                        },
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
