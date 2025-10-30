import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { CiCamera } from "react-icons/ci";
import { FaCheckCircle, FaExclamationCircle, FaHistory } from "react-icons/fa";
import { getProfilePicture } from "../../../../core/utils/profile-picture.util.js";
import { Student } from "../../../../student/types/student.type.js";
import { Teacher } from "../../../../teacher/types/teacher.type.js";
import { ProfilePicture } from "../../../../core/types/user.type.js";
import ChangeProfilePictureModal from "./ChangeProfilePictureModal";
import {
  changeAccountSettingsService,
  sendEmailVerificationService,
} from "../../../../auth/services/auth-settings.service";
import { useAuth } from "../../../../auth/contexts/auth.context";
import { handleApiError } from "../../../../core/utils/api/error.util";
import {
  ChangeAccountSettingsDTO,
  ChangeAccountSettingsSchema,
} from "../../../../auth/types/auth-settings.type";
import ProfilePictureModal from "./ProfilePictureModal.js";
import { useSubmitAccountChangeRequest } from "../../../../student/services/student-request.service.js";
import { useStudentRequests } from "../../../../student/services/student-request.service.js";
import { Request } from "../../../types/requests/request.type.js";
import RequestsModal from "./requests/RequestsModal.js";
import RequestDetailsModal from "./requests/RequestDetailsModal.js";
import { Admin } from "../../../../admin/types/admin.type.js";

type StudentAccountSettingsCardProps = {
  user: Student;
  userType: "student";
};

type TeacherAccountSettingsCardProps = {
  user: Teacher;
  userType: "teacher";
};

type AdminAccountSettingsCardProps = {
  user: Admin;
  userType: "admin";
};

type AccountSettingsCardProps =
  | StudentAccountSettingsCardProps
  | TeacherAccountSettingsCardProps
  | AdminAccountSettingsCardProps;

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
  const [showRequestSubmitted, setShowRequestSubmitted] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const submitAccountChangeRequestMutation = useSubmitAccountChangeRequest(
    authUser?.id || "",
  );

  // get student requests to check for pending ones
  const { data: studentRequests, isLoading: isLoadingRequests } =
    useStudentRequests(authUser?.id || "");

  // check if there's a pending request
  const hasPendingRequest = studentRequests?.some(
    (request) =>
      request.status === "pending" && request.type === "account-information",
  );

  // filter requests
  const accountRequests = (
    studentRequests?.filter(
      (request) => request.type === "account-information",
    ) || []
  ).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm<ChangeAccountSettingsDTO>({
    resolver: zodResolver(ChangeAccountSettingsSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || "",
      email: user.email,
      profilePicture: user.profilePicture,
    },
  });

  const formValues = watch();

  // teachers: show changes immediately when editing
  // students: only show changes locally while editing, but revert to original after submission
  const displayValues = {
    firstName: isEditing
      ? formValues.firstName
      : userType === "student" && !isEditing
        ? user.firstName
        : formValues.firstName,
    lastName: isEditing
      ? formValues.lastName
      : userType === "student" && !isEditing
        ? user.lastName
        : formValues.lastName,
    middleName: isEditing
      ? formValues.middleName
      : userType === "student" && !isEditing
        ? user.middleName || ""
        : formValues.middleName,
    email: isEditing
      ? formValues.email
      : userType === "student" && !isEditing
        ? user.email
        : formValues.email,
  };

  const displayProfilePicture = isEditing
    ? profilePicture
    : userType === "student" && !isEditing
      ? user.profilePicture
      : profilePicture;

  const hasChanges =
    formValues.firstName !== user.firstName ||
    formValues.lastName !== user.lastName ||
    formValues.middleName !== (user.middleName || "") ||
    formValues.email !== user.email ||
    profilePicture !== user.profilePicture;

  const handleSendVerificationEmail = async () => {
    if (!authUser?.id) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    setIsSendingVerification(true);
    try {
      await sendEmailVerificationService(authUser.id);
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Verification Email Sent!</span>
          <span className="text-sm">
            Please check your inbox and click the verification link to verify
            your email address.
          </span>
        </div>,
        {
          autoClose: 6000,
          closeButton: true,
        },
      );
    } catch (error: unknown) {
      console.error("Failed to send verification email:", error);

      if (isAxiosError(error)) {
        const errorData = handleApiError(error);

        switch (errorData.error) {
          case "ALREADY_VERIFIED":
            toast.error("Your email is already verified.");
            break;
          case "RATE_LIMITED":
            toast.error(
              errorData.message ||
              "Please wait before requesting another verification email.",
            );
            break;
          case "USER_NOT_FOUND":
            toast.error("User account not found. Please log in again.");
            break;
          default:
            toast.error("Failed to send verification email. Please try again.");
        }
      } else {
        toast.error("Failed to send verification email. Please try again.");
      }
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleSave = async (data: ChangeAccountSettingsDTO) => {
    if (!isEditing) return;

    if (!authUser?.id) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    if (hasPendingRequest) {
      toast.error(
        "You already have a pending request. Please wait for it to be resolved.",
      );
      return;
    }

    try {
      const requestData: Partial<ChangeAccountSettingsDTO> = {};

      // only include fields that have actually changed
      if (formValues.firstName !== user.firstName) {
        requestData.firstName = data.firstName;
      }
      if (formValues.lastName !== user.lastName) {
        requestData.lastName = data.lastName;
      }
      if (formValues.middleName !== (user.middleName || "")) {
        requestData.middleName = data.middleName;
      }
      if (formValues.email !== user.email) {
        requestData.email = data.email;
      }
      if (profilePicture !== user.profilePicture) {
        requestData.profilePicture = profilePicture || "Default";
      }

      // check if there are any changes at all
      const hasAnyChanges = Object.keys(requestData).length > 0;

      if (!hasAnyChanges) {
        toast.info("No changes detected to submit.");
        return;
      }

      if (userType === "student") {
        // include original data in the payload
        const payloadWithOriginalData = {
          ...requestData,
          originalData: {
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName || "",
            email: user.email,
            profilePicture: user.profilePicture || "Default",
          },
        };

        await submitAccountChangeRequestMutation.mutateAsync({
          payload: payloadWithOriginalData as ChangeAccountSettingsDTO,
        });

        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">
              Request Submitted Successfully!
            </span>
            <span className="text-sm">
              Your account change request has been sent to your teacher for
              approval.
            </span>
          </div>,
          {
            autoClose: 5000,
            closeButton: true,
          },
        );

        setIsEditing(false);
        setShowProfilePictureModal(false);
        setShowRequestSubmitted(true);

        // students: reset to original values since changes need approval
        reset({
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName || "",
          email: user.email,
          profilePicture: user.profilePicture,
        });
        setProfilePicture(user.profilePicture);
      } else {
        await changeAccountSettingsService(
          authUser.id,
          requestData as ChangeAccountSettingsDTO,
        );
        toast.success("Account information updated successfully!");
        setIsEditing(false);
        setShowProfilePictureModal(false);

        const updatedValues = { ...formValues };
        if (requestData.firstName)
          updatedValues.firstName = requestData.firstName;
        if (requestData.lastName) updatedValues.lastName = requestData.lastName;
        if (requestData.middleName !== undefined)
          updatedValues.middleName = requestData.middleName;
        if (requestData.email) updatedValues.email = requestData.email;
        if (requestData.profilePicture)
          setProfilePicture(requestData.profilePicture);

        reset(updatedValues);
      }
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
          case "INVALID_EMAIL":
            setError("email", {
              type: "manual",
              message: "Invalid email address",
            });
            break;
          case "EMAIL_ALREADY_EXISTS":
            setError("email", {
              type: "manual",
              message: "Email already exists",
            });
            break;
          case "PENDING_REQUEST_EXISTS":
            toast.error(
              "You already have a pending account change request. Please wait for it to be resolved before submitting a new one.",
            );
            setIsEditing(false);
            break;
          case "NO_ASSIGNED_TEACHER":
            toast.error(
              "Cannot submit request: No teacher assigned to your account.",
            );
            break;
          case "STUDENT_NOT_FOUND":
            toast.error("Student account not found.");
            break;
          case "SECTION_NOT_FOUND":
            toast.error("Cannot submit request: Your section was not found.");
            break;
          default:
            toast.error(
              userType === "student"
                ? "Failed to submit account change request. Please try again."
                : "Failed to update account information. Please try again.",
            );
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || "",
      email: user.email,
    });
    setProfilePicture(user.profilePicture);
    setIsEditing(false);
    setShowProfilePictureModal(false);
    setShowRequestSubmitted(false);
  };

  const handleProfilePictureClick = () => {
    if (isEditing && !hasPendingRequest) {
      setShowProfilePictureModal(true);
    } else if (!isEditing) {
      setShowViewProfilePictureModal(true);
    }
  };

  const handleProfilePictureSelect = (picture: ProfilePicture) => {
    setProfilePicture(picture);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasPendingRequest) {
      toast.info(
        "You have a pending account change request. Please wait for it to be resolved before making new changes.",
      );
      return;
    }

    setIsEditing(true);
    setShowRequestSubmitted(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isEditing) {
      e.preventDefault();
    }
  };

  const handleRequestsClick = () => {
    setShowRequestsModal(true);
  };

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setShowRequestDetailsModal(true);
  };

  const handleCloseRequestDetails = () => {
    setShowRequestDetailsModal(false);
    setSelectedRequest(null);
  };

  const handleCloseRequestsModal = () => {
    setShowRequestsModal(false);
    if (showRequestDetailsModal) {
      setShowRequestDetailsModal(false);
      setSelectedRequest(null);
    }
  };

  const isStudent = userType === "student";
  const student = user as Student;
  const teacher = user as Teacher;

  const isSubmitting = submitAccountChangeRequestMutation.isPending;

  if (isLoadingRequests) {
    return (
      <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm p-6 transition-colors duration-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
          Account Information
        </h4>

        <div className="flex items-center gap-3">
          {/* existing requests button for students */}
          {isStudent && accountRequests.length > 0 && (
            <button
              onClick={handleRequestsClick}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FaHistory className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-800 dark:text-blue-300 text-sm font-medium">
                  View Requests ({accountRequests.length})
                </span>
              </div>
              {hasPendingRequest && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              )}
            </button>
          )}
        </div>
      </div>

      {isStudent && showRequestSubmitted && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-blue-800 dark:text-blue-300 text-sm">
                Request Submitted for Approval
              </h5>
              <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                Your account change request has been sent to your teacher. The
                changes will take effect once approved.
              </p>
              <p className="text-blue-600 dark:text-blue-500 text-xs mt-2">
                You can check the status of your request in the Requests
                section.
              </p>
            </div>
            <button
              onClick={() => setShowRequestSubmitted(false)}
              className="flex-shrink-0 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
              className={`w-20 h-20 rounded-full border-2 overflow-hidden cursor-pointer ${isEditing && !hasPendingRequest
                  ? "border-green-500 dark:border-green-400 hover:border-green-600 dark:hover:border-green-300 transition-colors"
                  : "border-gray-300 dark:border-gray-600"
                } ${hasPendingRequest ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleProfilePictureClick}
            >
              <img
                src={getProfilePicture(displayProfilePicture ?? "Default")}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && !hasPendingRequest && (
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
              {isEditing && !hasPendingRequest
                ? "Click on the photo to change"
                : hasPendingRequest &&
                "Go to edit mode to change profile picture"}
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
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${hasPendingRequest
                      ? "border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                      : "border-gray-300 dark:border-gray-600"
                    }`}
                  {...register("firstName")}
                  disabled={hasPendingRequest}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </>
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                {displayValues.firstName}
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
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${hasPendingRequest
                      ? "border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                      : "border-gray-300 dark:border-gray-600"
                    }`}
                  {...register("lastName")}
                  disabled={hasPendingRequest}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </>
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                {displayValues.lastName}
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
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${hasPendingRequest
                      ? "border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                      : "border-gray-300 dark:border-gray-600"
                    }`}
                  {...register("middleName")}
                  disabled={hasPendingRequest}
                />
                {errors.middleName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.middleName.message}
                  </p>
                )}
              </>
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                {displayValues.middleName || "—"}
              </div>
            )}
          </div>
        )}

        {/* email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          {isEditing ? (
            <>
              <div className="relative">
                <input
                  type="email"
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${hasPendingRequest
                      ? "border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                      : "border-gray-300 dark:border-gray-600"
                    }`}
                  {...register("email")}
                  disabled={hasPendingRequest}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {user.verified.verified ? (
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                      <FaCheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs">
                      <FaExclamationCircle className="w-3 h-3" />
                      <span>Unverified</span>
                    </div>
                  )}
                </div>
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </>
          ) : (
            <div className="relative">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white pr-32">
                {displayValues.email}
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {user.verified.verified ? (
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                    <FaCheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs">
                      <FaExclamationCircle className="w-3 h-3" />
                      <span>Unverified</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSendVerificationEmail}
                      disabled={isSendingVerification}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium disabled:bg-blue-400 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isSendingVerification ? "Sending..." : "Verify Email"}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
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
      </form>

      <div className="flex gap-3 pt-4">
        {isEditing ? (
          <>
            <button
              type="submit"
              onClick={handleSubmit((data) => handleSave(data))}
              disabled={
                isSubmitting || (isStudent && !hasChanges) || hasPendingRequest
              }
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Submitting..."
                : isStudent
                  ? "Submit Request"
                  : "Save Changes"}
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
            disabled={hasPendingRequest}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {hasPendingRequest ? "Request Pending" : "Edit Information"}
          </button>
        )}
      </div>

      {/* student: help text */}
      {isStudent && isEditing && !hasPendingRequest && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-sm">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            <strong>Note:</strong> As a student, your changes require teacher
            approval. After submitting, your teacher will review and approve the
            request before changes take effect.
          </p>
        </div>
      )}

      {/* profile picture modal */}
      {showProfilePictureModal && (
        <ChangeProfilePictureModal
          onClose={() => setShowProfilePictureModal(false)}
          currentProfilePicture={profilePicture}
          onSelectProfilePicture={handleProfilePictureSelect}
          onSave={() => setShowProfilePictureModal(false)}
        />
      )}

      <ProfilePictureModal
        isOpen={showViewProfilePictureModal}
        onClose={() => setShowViewProfilePictureModal(false)}
        picture={displayProfilePicture}
      />

      {/* requests list modal */}
      <RequestsModal
        showRequestsModal={showRequestsModal}
        onClose={handleCloseRequestsModal}
        accountRequests={accountRequests}
        isLoadingRequests={isLoadingRequests}
        onRequestClick={handleRequestClick}
      />

      {/* request details modal */}
      <RequestDetailsModal
        showRequestDetailsModal={showRequestDetailsModal}
        selectedRequest={selectedRequest}
        onClose={handleCloseRequestDetails}
        user={user}
      />
    </div>
  );
}
