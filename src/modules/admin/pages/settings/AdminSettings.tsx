import { type ReactElement } from "react";
import Settings from "../../../core/components/settings/Settings";
import AccountSettingsCard from "../../../core/components/settings/account-settings/AccountSettingsCard";
import ChangePasswordCard from "../../../core/components/settings/change-password/ChangePasswordCard";
import UserPreferencesCard from "../../../core/components/settings/user-preference/UserPreferencesCard";
import { useAdminContext } from "../../context/admin.context";
import DataReportCard from "@/modules/core/components/settings/data-report/DataReportCard";

export default function AdminSettings(): ReactElement {
  const { admin, adminId } = useAdminContext();

  const user = admin
    ? {
      id: admin.id,
      role: "admin" as const,
      firstName: admin.firstName,
      lastName: admin.lastName,
      middleName: admin.middleName || undefined,
      email: admin.email,
      verified: admin.verified,
      profilePicture: admin.profilePicture || undefined,
    }
    : null;

  if (!user) return <div>Loading...</div>;

  return (
    <Settings
      user={user}
      isLoading={!admin}
      accountSettingsCard={
        <AccountSettingsCard user={admin!} userType="admin" />
      }
      changePasswordCard={<ChangePasswordCard />}
      userPreferencesCard={<UserPreferencesCard />}
      reportsCard={<DataReportCard userType="admin" userId={adminId} />}
    />
  );
}
