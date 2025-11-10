import { type ReactElement } from "react";
import { Request } from "../../../../core/types/requests/request.type";
import { useTeacherContext } from "../../../context/teacher.context";
import { useUpdateRequestStatus } from "../../../services/teacher-request.service";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { handleApiError } from "../../../../core/utils/api/error.util";
import { getProfilePicture } from "../../../../core/utils/profile-picture.util.js";
import { ProfilePicture } from "../../../../core/types/user.type.js";
import { format } from "date-fns-tz";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const { allStudents } = useTeacherContext();

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

  const getStatusVariant = (
    status: string,
  ): "default" | "destructive" | "secondary" => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getCurrentStudentData = (studentId: string): CurrentStudentData => {
    const student = allStudents.find((s) => s.id === studentId);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[100dvw] h-[100dvh] max-w-none flex flex-col p-0 bg-background rounded-lg md:h-[85dvh] md:w-[90dvw] lg:w-[75dvw] md:max-w-7xl md:max-h-[800px] overflow-hidden">
        <DialogHeader className="flex-row items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <DialogTitle className="text-2xl text-gray-700 dark:text-gray-300">
              Account Change Request
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Review student account modification request
            </p>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* main content - scrollable part */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-6 space-y-6">
              {/* status and student info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium">Request Status:</span>
                    <Badge variant={getStatusVariant(request.status)}>
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Student Name
                      </label>
                      <p className="font-medium">
                        {currentStudentData.firstName}{" "}
                        {currentStudentData.lastName}
                        {currentStudentData.middleName &&
                          ` ${currentStudentData.middleName}`}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Current Email Address
                      </label>
                      <p>{currentStudentData.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* changes */}
              {hasAnyChanges ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Requested Changes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {(changes.firstName ||
                        changes.lastName ||
                        changes.middleName ||
                        changes.email ||
                        changes.profilePicture) && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Personal Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              {/* First Name - Only show if changed */}
                              {changes.firstName && (
                                <div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="text-sm font-medium">
                                      Previous
                                    </div>
                                    <div className="text-sm font-medium">
                                      Proposed
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">
                                        Before:
                                      </div>
                                      <Card>
                                        <CardContent className="p-3 text-sm">
                                          {originalData.firstName}
                                        </CardContent>
                                      </Card>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">
                                        After:
                                      </div>
                                      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                        <CardContent className="p-3 text-sm font-medium">
                                          {requestedData?.firstName}
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {changes.lastName && (
                                <div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="text-sm font-medium">
                                      Previous
                                    </div>
                                    <div className="text-sm font-medium">
                                      Proposed
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">
                                        Before:
                                      </div>
                                      <Card>
                                        <CardContent className="p-3 text-sm">
                                          {originalData.lastName}
                                        </CardContent>
                                      </Card>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">
                                        After:
                                      </div>
                                      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                        <CardContent className="p-3 text-sm font-medium">
                                          {requestedData?.lastName}
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {changes.middleName && (
                                <div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="text-sm font-medium">
                                      Previous
                                    </div>
                                    <div className="text-sm font-medium">
                                      Proposed
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">
                                        Before:
                                      </div>
                                      <Card>
                                        <CardContent className="p-3 text-sm">
                                          {originalData.middleName || "—"}
                                        </CardContent>
                                      </Card>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">
                                        After:
                                      </div>
                                      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                        <CardContent className="p-3 text-sm font-medium">
                                          {requestedData?.middleName || "—"}
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {changes.email && (
                                <div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="text-sm font-medium">
                                      Previous
                                    </div>
                                    <div className="text-sm font-medium">
                                      Proposed
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">
                                        Before:
                                      </div>
                                      <Card>
                                        <CardContent className="p-3 text-sm">
                                          {originalData.email}
                                        </CardContent>
                                      </Card>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">
                                        After:
                                      </div>
                                      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                        <CardContent className="p-3 text-sm font-medium">
                                          {requestedData?.email}
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {changes.profilePicture && (
                                <div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="text-sm font-medium">
                                      Previous
                                    </div>
                                    <div className="text-sm font-medium">
                                      Proposed
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">
                                        Before:
                                      </div>
                                      <Card>
                                        <CardContent className="p-3 text-center">
                                          <img
                                            src={getProfilePicture(
                                              (originalData.profilePicture as ProfilePicture) ??
                                              "Default",
                                            )}
                                            alt="Previous Profile"
                                            className="w-16 h-16 rounded-full mx-auto object-cover"
                                          />
                                        </CardContent>
                                      </Card>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground font-medium">
                                        After:
                                      </div>
                                      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                        <CardContent className="p-3 text-center">
                                          <img
                                            src={getProfilePicture(
                                              (requestedData?.profilePicture as ProfilePicture) ??
                                              "Default",
                                            )}
                                            alt="New Profile"
                                            className="w-16 h-16 rounded-full mx-auto object-cover"
                                          />
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <div className="text-muted-foreground mb-2">
                      No changes detected in this request
                    </div>
                    <div className="text-sm text-muted-foreground">
                      The requested information matches the current student
                      data.
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Submitted Date:
                    </span>
                    <span className="text-sm font-medium">
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
                      <span className="text-sm font-medium text-muted-foreground">
                        Last Updated:
                      </span>
                      <span className="text-sm font-medium">
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* action buttons */}
        {request.status === "pending" && (
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isProcessing}
              className="order-2 sm:order-1"
            >
              {isProcessing ? "Processing..." : "Reject Request"}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="order-1 sm:order-2"
            >
              {isProcessing ? "Processing..." : "Approve Changes"}
            </Button>
          </CardFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
