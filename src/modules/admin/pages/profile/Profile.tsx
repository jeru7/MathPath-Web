import { useState, type ReactElement } from "react";
import { capitalizeWord } from "../../../core/utils/string.util";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import { useAdminContext } from "../../context/admin.context";
import { FaCheck } from "react-icons/fa";
import ProfilePictureModal from "../../../core/components/settings/account-settings/ProfilePictureModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Profile(): ReactElement {
  const { admin } = useAdminContext();
  const [showViewProfilePictureModal, setShowViewProfilePictureModal] =
    useState(false);

  const handleProfilePictureClick = () => {
    setShowViewProfilePictureModal(true);
  };

  if (!admin) {
    return (
      <main className="flex flex-col min-h-screen h-full w-full gap-2 p-2">
        <div>Loading profile...</div>
      </main>
    );
  }

  const isVerified = admin.verified.verified;

  return (
    <main className="flex flex-col min-h-screen w-full mt-4 md:mt-0 gap-2 p-2">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl text-foreground font-bold">
          Profile
        </h3>
      </header>

      <div className="grid gap-2">
        {/* overview */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
              {/* profile picture */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-primary overflow-hidden hover:cursor-pointer"
                  onClick={handleProfilePictureClick}
                >
                  <img
                    src={getProfilePicture(admin.profilePicture ?? "Default")}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold">
                  Admin
                </Badge>
                {isVerified && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <FaCheck className="w-2 h-2" />
                  </div>
                )}
              </div>

              {/* basic info */}
              <div className="flex-1 flex items-center sm:items-start flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold truncate">
                    {admin.firstName} {admin.lastName}
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm truncate">
                  {admin.email}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {admin.gender}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* personal info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  First Name
                </label>
                <div className="p-2 bg-muted rounded border text-sm">
                  {capitalizeWord(admin.firstName)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Last Name
                </label>
                <div className="p-2 bg-muted rounded border text-sm">
                  {capitalizeWord(admin.lastName)}
                </div>
              </div>

              {admin.middleName && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Middle Name
                  </label>
                  <div className="p-2 bg-muted rounded border text-sm">
                    {capitalizeWord(admin.middleName)}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Gender
                </label>
                <div className="p-2 bg-muted rounded border text-sm">
                  {admin.gender}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* account info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Email Address
                </label>
                <div className="p-2 bg-muted rounded border text-sm truncate">
                  {admin.email}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Verification Status
                </label>
                <div className="p-2 bg-muted rounded border text-sm">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${isVerified ? "bg-green-500" : "bg-yellow-500"
                        }`}
                    ></div>
                    <span
                      className={
                        isVerified ? "text-green-600" : "text-yellow-600"
                      }
                    >
                      {isVerified ? "Verified" : "Pending Verification"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProfilePictureModal
        isOpen={showViewProfilePictureModal}
        onClose={() => setShowViewProfilePictureModal(false)}
        picture={admin.profilePicture}
      />
    </main>
  );
}
