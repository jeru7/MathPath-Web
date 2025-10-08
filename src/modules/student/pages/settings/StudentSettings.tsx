import { type ReactElement } from "react";
import { useStudentContext } from "../../contexts/student.context";
import AccountSettingsCard from "../../../core/components/settings/AccountSettingsCard";
import ChangePasswordCard from "../../../core/components/settings/ChangePasswordCard";
import UserPreferencesCard from "../../../core/components/settings/UserPreferencesCard";
import Settings from "../../../core/components/settings/Settings";

export default function StudentSettings(): ReactElement {
  const { student } = useStudentContext();

  const user = student
    ? {
        id: student.id,
        role: "Student" as const,
        firstName: student.firstName,
        lastName: student.lastName,
        middleName: student.middleName,
        email: student.email,
        verified: student.verified,
        profilePicture: student.profilePicture,
      }
    : null;

  if (!user) return <div>Loading...</div>;

  return (
    <Settings
      user={user}
      isLoading={!student}
      accountSettingsCard={
        <AccountSettingsCard user={student!} userType="student" />
      }
      changePasswordCard={<ChangePasswordCard />}
      userPreferencesCard={<UserPreferencesCard />}
    />
  );
}
