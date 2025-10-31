import { type ReactElement } from "react";
import { Request } from "../../../../core/types/requests/request.type";
import { FaTimes } from "react-icons/fa";
import { useTeacherContext } from "../../../context/teacher.context";
import { useUpdateRequestStatus } from "../../../services/teacher-request.service";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { handleApiError } from "../../../../core/utils/api/error.util";
import { getProfilePicture } from "../../../../core/utils/profile-picture.util.js";
import { ProfilePicture } from "../../../../core/types/user.type.js";
import { format } from "date-fns-tz";
import ModalOverlay from "../../../../core/components/modal/ModalOverlay.js";

type RequestDetailsModalProps = {
  isOpen: boolean;
  request: Request | null;
  onClose: () => void;
  teacherId: string;
};

type CurrentStudentData = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  profilePicture: string | null;
};

export default function RequestDetailsModal({
  isOpen,
  request,
  onClose,
  teacherId,
}: RequestDetailsModalProps): ReactElement {
  const { students } = useTeacherContext();

  const updateRequestStatusMutation = useUpdateRequestStatus(
    teacherId,
    request?.id || "",
  );

  const handleApprove = async () => {
    if (!request?.id) return;

    try {
      await updateRequestStatusMutation.mutateAsync("approve");
      toast.success("Request approved successfully");
      onClose();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorData = handleApiError(error);
        console.log("Error data: " + errorData.error);
      }
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async () => {
    if (!request?.id) return;

    try {
      await updateRequestStatusMutation.mutateAsync("reject");
      toast.success("Request rejected successfully");
      onClose();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorData = handleApiError(error);
        console.log("Error data: " + errorData.error);
      }
      toast.error("Failed to reject request");
    }
  };

  if (!isOpen || !request) return <></>;

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

  const getCurrentStudentData = (studentId: string): CurrentStudentData => {
    const student = students.find((s) => s.id === studentId);
    return {
      firstName: student?.firstName || "Current First Name",
      lastName: student?.lastName || "Current Last Name",
      middleName: student?.middleName || "Current Middle Name",
      email: student?.email || "current.email@example.com",
      profilePicture: student?.profilePicture || null,
    };
  };

  const getChangedFields = () => {
    const currentStudentData = getCurrentStudentData(request.senderId);
    const requestedData = request.accountInfo;

    const originalData = requestedData?.originalData || {
      firstName: currentStudentData.firstName,
      lastName: currentStudentData.lastName,
      middleName: currentStudentData.middleName || "",
      email: currentStudentData.email,
      profilePicture: currentStudentData.profilePicture,
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
      currentStudentData,
    };
  };

  const {
    changes,
    hasAnyChanges,
    originalData,
    requestedData,
    currentStudentData,
  } = getChangedFields();

  const isProcessing = updateRequestStatusMutation.isPending;

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm h-[100dvh] w-[100dvw] md:h-[85dvh] md:w-[90dvw] lg:w-[75dvw] md:max-w-7xl md:max-h-[800px] overflow-hidden flex flex-col">
        {/* header */}
        <header className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Account Change Request
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Review student account modification request
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-900 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* main content - scrollable part */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {/* status and student info */}
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="bg-white dark:bg-gray-800 rounded-sm p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Request Status:
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        request.status,
                      )}`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Student Name
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {currentStudentData.firstName}{" "}
                        {currentStudentData.lastName}
                        {currentStudentData.middleName &&
                          ` ${currentStudentData.middleName}`}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Current Email Address
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentStudentData.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* changes */}
              {hasAnyChanges ? (
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="bg-white dark:bg-gray-800 rounded-sm p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                      Requested Changes
                    </h3>

                    <div className="space-y-4 sm:space-y-6">
                      {(changes.firstName ||
                        changes.lastName ||
                        changes.middleName ||
                        changes.email ||
                        changes.profilePicture) && (
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-sm p-3 sm:p-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">
                              Personal Information
                            </h4>

                            <div className="space-y-4 sm:space-y-4">
                              {/* First Name - Only show if changed */}
                              {changes.firstName && (
                                <div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-2">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Previous
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Proposed
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          Before:
                                        </div>
                                        <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm">
                                          {originalData.firstName}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          After:
                                        </div>
                                        <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-gray-900 dark:text-white font-medium text-sm">
                                          {requestedData?.firstName}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {changes.lastName && (
                                <div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-2">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Previous
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Proposed
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          Before:
                                        </div>
                                        <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm">
                                          {originalData.lastName}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          After:
                                        </div>
                                        <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-gray-900 dark:text-white font-medium text-sm">
                                          {requestedData?.lastName}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {changes.middleName && (
                                <div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-2">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Previous
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Proposed
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          Before:
                                        </div>
                                        <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm">
                                          {originalData.middleName || "—"}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          After:
                                        </div>
                                        <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-gray-900 dark:text-white font-medium text-sm">
                                          {requestedData?.middleName || "—"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {changes.email && (
                                <div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-2">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Previous
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Proposed
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          Before:
                                        </div>
                                        <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm">
                                          {originalData.email}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          After:
                                        </div>
                                        <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-gray-900 dark:text-white font-medium text-sm">
                                          {requestedData?.email}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {changes.profilePicture && (
                                <div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-2">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Previous
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Proposed
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          Before:
                                        </div>
                                        <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-center">
                                          <img
                                            src={getProfilePicture(
                                              (originalData.profilePicture as ProfilePicture) ??
                                              "Default",
                                            )}
                                            alt="Previous Profile"
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto object-cover"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          After:
                                        </div>
                                        <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-gray-900 dark:text-white text-center">
                                          <img
                                            src={getProfilePicture(
                                              (requestedData?.profilePicture as ProfilePicture) ??
                                              "Default",
                                            )}
                                            alt="New Profile"
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto object-cover"
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
                </div>
              ) : (
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="bg-white dark:bg-gray-800 rounded-sm p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                    <div className="text-center py-4 sm:py-8">
                      <div className="text-gray-400 dark:text-gray-500 mb-2 text-sm sm:text-base">
                        No changes detected in this request
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        The requested information matches the current student
                        data.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* timeline */}
              <div className="p-4 sm:p-6">
                <div className="bg-white dark:bg-gray-800 rounded-sm p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
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
                          new Date(request.createdAt),
                          "MMMM d 'at' h:mm a",
                          {
                            timeZone: "Asia/Manila",
                          },
                        )}
                      </span>
                    </div>
                    {request.updatedAt !== request.createdAt && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Last Updated:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {format(
                            new Date(request.updatedAt),
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

        {/* action buttons */}
        {request.status === "pending" && (
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="px-4 sm:px-6 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 font-medium hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-2 sm:order-1"
            >
              {isProcessing ? "Processing..." : "Reject Request"}
            </button>
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors duration-200 font-medium hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
            >
              {isProcessing ? "Processing..." : "Approve Changes"}
            </button>
          </div>
        )}

        {request.status !== "pending" && (
          <div className="flex justify-end p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-sm hover:bg-gray-700 transition-colors duration-200 font-medium hover:cursor-pointer text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}
