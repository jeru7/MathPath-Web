import { type ReactElement } from "react";
import { capitalizeWord } from "../../../core/utils/string.util";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";
import { useStudentContext } from "../../contexts/student.context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Profile(): ReactElement {
  const { student } = useStudentContext();

  if (!student) {
    return (
      <main className="flex flex-col min-h-screen h-fit w-full gap-2 p-2">
        <div>Loading profile...</div>
      </main>
    );
  }

  const progressPercentage = Math.round(
    (student.exp.current / student.exp.nextLevel) * 100,
  );

  const isVerified = student.verified.verified;

  return (
    <main className="flex flex-col min-h-screen h-fit w-full gap-2 p-2">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold">Profile</h3>
      </header>

      <div className="grid gap-2">
        {/* overview */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
              {/* profile picture */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-primary overflow-hidden">
                  <img
                    src={getProfilePicture(student.profilePicture)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold">
                  Lvl {student.level}
                </Badge>
              </div>

              {/* basic info */}
              <div className="flex-1 flex items-center sm:items-start flex-col min-w-0">
                <h2 className="text-lg sm:text-xl font-bold truncate">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-muted-foreground text-sm truncate">
                  {student.email}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {student.characterName} • {student.gender}
                </p>

                {/* quick stats */}
                <div className="flex gap-3 mt-2">
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-600">
                      {student.streak}
                    </div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-purple-600">
                      {student.exp.current}
                    </div>
                    <div className="text-xs text-muted-foreground">EXP</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Level {student.level} Progress</span>
                <span>
                  {student.exp.current} / {student.exp.nextLevel}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
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
                  {capitalizeWord(student.firstName)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Last Name
                </label>
                <div className="p-2 bg-muted rounded border text-sm">
                  {capitalizeWord(student.lastName)}
                </div>
              </div>

              {student.middleName && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Middle Name
                  </label>
                  <div className="p-2 bg-muted rounded border text-sm">
                    {capitalizeWord(student.middleName)}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Gender
                </label>
                <div className="p-2 bg-muted rounded border text-sm">
                  {student.gender}
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
                  {student.email}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Reference Number
                </label>
                <div className="p-2 bg-muted rounded border text-sm font-mono">
                  {student.referenceNumber}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Member Since
                </label>
                <div className="p-2 bg-muted rounded border text-sm">
                  {new Date(student.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Last Online
                </label>
                <div className="p-2 bg-muted rounded border text-sm">
                  {new Date(student.lastOnline).toLocaleDateString()}
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
    </main>
  );
}
