import { type ReactElement } from "react";
import { AdminContext } from "./admin.context";
import { useAdmin, useAdminTeacher } from "../services/admin.service";

export default function AdminProvider({
  adminId,
  children,
}: {
  adminId: string;
  children: React.ReactNode;
}): ReactElement {
  const { data: admin } = useAdmin(adminId);
  const { data: teachers } = useAdminTeacher(adminId);

  const value = {
    adminId,
    admin: admin || null,
    teachers: teachers || [],
  };

  return (
    <AdminContext.Provider value={value}>
      {teachers ? children : <div>Loading admin data...</div>}
    </AdminContext.Provider>
  );
}
