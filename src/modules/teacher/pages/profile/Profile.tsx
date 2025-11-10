import { useState, type ReactElement } from "react";
import { capitalizeWord } from "../../../core/utils/string.util";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import { useTeacherContext } from "../../context/teacher.context";
import { FaCheck } from "react-icons/fa";
import ProfilePictureModal from "../../../core/components/settings/account-settings/ProfilePictureModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Profile(): ReactElement {
  const { teacher } = useTeacherContext();
  const [showViewProfilePictureModal, setShowViewProfilePictureModal] =
    useState(false);

  const handleProfilePictureClick = () => {
    setShowViewProfilePictureModal(true);
  };

  if (!teacher) {
    return (
      <div className="flex flex-col min-h-screen h-fit w-full gap-2 p-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-foreground">Loading profile...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isVerified = teacher.verified.verified;

  return (
    <div className="flex flex-col min-h-screen h-fit w-full gap-4 p-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overview Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
                {/* Profile Picture */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-primary overflow-hidden cursor-pointer"
                    onClick={handleProfilePictureClick}
                  >
                    <img
                      src={getProfilePicture(
                        teacher.profilePicture ?? "Default",
                      )}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Badge className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground px-2 py-1 text-xs font-bold">
                    Teacher
                  </Badge>
                  {isVerified && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                      <FaCheck className="w-2 h-2" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 flex items-center sm:items-start flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
                      {teacher.firstName} {teacher.lastName}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-sm truncate">
                    {teacher.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {teacher.gender}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Personal Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">
                    First Name
                  </label>
                  <div className="p-2 bg-muted rounded border text-sm text-foreground">
                    {capitalizeWord(teacher.firstName)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">
                    Last Name
                  </label>
                  <div className="p-2 bg-muted rounded border text-sm text-foreground">
                    {capitalizeWord(teacher.lastName)}
                  </div>
                </div>

                {teacher.middleName && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Middle Name
                    </label>
                    <div className="p-2 bg-muted rounded border text-sm text-foreground">
                      {capitalizeWord(teacher.middleName)}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">
                    Gender
                  </label>
                  <div className="p-2 bg-muted rounded border text-sm text-foreground capitalize">
                    {teacher.gender}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <div className="p-2 bg-muted rounded border text-sm text-foreground truncate">
                    {teacher.email}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">
                    Verification Status
                  </label>
                  <div className="p-2 bg-muted rounded border text-sm">
                    <Badge
                      variant="secondary"
                      className={
                        isVerified
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${isVerified
                            ? "bg-green-500 dark:bg-green-400"
                            : "bg-yellow-500 dark:bg-yellow-400"
                          }`}
                      ></div>
                      {isVerified ? "Verified" : "Pending Verification"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <ProfilePictureModal
        isOpen={showViewProfilePictureModal}
        onClose={() => setShowViewProfilePictureModal(false)}
        picture={teacher.profilePicture}
      />
    </div>
  );
}
