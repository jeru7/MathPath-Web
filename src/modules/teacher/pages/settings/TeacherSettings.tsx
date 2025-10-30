import { type ReactElement } from "react";
import { useTeacherContext } from "../../context/teacher.context";
import Settings from "../../../core/components/settings/Settings";
import AccountSettingsCard from "../../../core/components/settings/account-settings/AccountSettingsCard";
import ChangePasswordCard from "../../../core/components/settings/change-password/ChangePasswordCard";
import UserPreferencesCard from "../../../core/components/settings/user-preference/UserPreferencesCard";
import TeacherReportsCard from "../../../core/components/settings/download-data/TeacherReportsCard";

export default function TeacherSettings(): ReactElement {
  const { teacher } = useTeacherContext();

  const user = teacher
    ? {
      id: teacher.id,
      role: "teacher" as const,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      middleName: teacher.middleName || undefined,
      email: teacher.email,
      verified: teacher.verified,
      profilePicture: teacher.profilePicture || undefined,
    }
    : null;

  if (!user) return <div>Loading...</div>;

  return (
    <Settings
      user={user}
      isLoading={!teacher}
      accountSettingsCard={
        <AccountSettingsCard user={teacher!} userType="teacher" />
      }
      changePasswordCard={<ChangePasswordCard />}
      userPreferencesCard={<UserPreferencesCard />}
      reportsCard={<TeacherReportsCard />}
    />
  );
}
