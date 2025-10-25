import { type ReactElement } from "react";
import { AdminContext } from "./admin.context";
import { useAdmin, useAdminTeacher } from "../services/admin.service";
import { useAdminStudents } from "../services/admin-student";

export default function AdminProvider({
  adminId,
  children,
}: {
  adminId: string;
  children: React.ReactNode;
}): ReactElement {
  const { data: admin } = useAdmin(adminId);
  const { data: teachers } = useAdminTeacher(adminId);
  const { data: students } = useAdminStudents(adminId);

  const value = {
    adminId,
    admin: admin || null,
    teachers: teachers || [],
    students: students || [],
  };

  return (
    <AdminContext.Provider value={value}>
      {teachers ? children : <div>Loading admin data...</div>}
    </AdminContext.Provider>
  );
}
