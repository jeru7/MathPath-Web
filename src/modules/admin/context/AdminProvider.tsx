import { useEffect, useRef, useState } from "react";
import { useAdmin, useAdminTeacher } from "../services/admin.service";
import { WSS } from "../../core/constants/api.constant";
import { AdminContext } from "./admin.context";
import { useAdminSections } from "../services/admin-section.service";
import { useAdminAssessments } from "../services/admin-assessment.service";
import { useAdminStudents } from "../services/admin-student.service";
import { useAdminActivities } from "../services/admin-activity.service";
import PageLoader from "@/components/ui/page-loader";

export default function AdminProvider({
  adminId,
  children,
}: {
  adminId: string;
  children: React.ReactNode;
}) {
  const wsRef = useRef<WebSocket | null>(null);

  const { data: admin, isLoading: isLoadingAdmin } = useAdmin(adminId);
  const { data: teachers, isLoading: isLoadingTeachers } =
    useAdminTeacher(adminId);
  const { data: students, isLoading: isLoadingStudents } =
    useAdminStudents(adminId);
  const { data: sections, isLoading: isLoadingSections } =
    useAdminSections(adminId);
  const { data: assessments, isLoading: isLoadingAssessments } =
    useAdminAssessments(adminId);
  const { data: activities, isLoading: isLoadingActivities } =
    useAdminActivities(adminId);

  const [onlineStudentIds, setOnlineStudentIds] = useState<string[]>([]);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!adminId) return;

    const ws = new WebSocket(WSS);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Admin WebSocket connected, sending ADMIN_LOGIN");
      ws.send(JSON.stringify({ type: "ADMIN_LOGIN", data: adminId }));
    };

    ws.onmessage = (e) => {
      console.log("Admin WebSocket message received:", e.data);
      const { type, data } = JSON.parse(e.data);
      if (type === "ADMIN_INITIAL_DATA") {
        console.log("Received ADMIN_INITIAL_DATA:", data.onlineStudents);
        setOnlineStudentIds(data.onlineStudents || []);
      }
      if (type === "STUDENT_ONLINE") {
        console.log("Received STUDENT_ONLINE:", data.studentId);
        setOnlineStudentIds((prev) => [...prev, data.studentId]);
      }
      if (type === "STUDENT_OFFLINE") {
        console.log("Received STUDENT_OFFLINE:", data.studentId);
        setOnlineStudentIds((prev) =>
          prev.filter((id) => id !== data.studentId),
        );
      }
    };

    ws.onerror = (error) => {
      console.error("Admin WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("Admin WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [adminId]);

  // students
  const rawStudents = students?.filter((s) => !s.archive.isArchive) || [];
  const archivedStudents = students?.filter((s) => s.archive.isArchive) || [];

  // sections
  const rawSections = sections?.filter((s) => !s.archive.isArchive) || [];
  const archivedSections = sections?.filter((s) => s.archive.isArchive) || [];

  // assessments
  const rawAssessments = assessments?.filter((a) => !a.archive.isArchive) || [];
  const archivedAssessments =
    assessments?.filter((a) => a.archive.isArchive) || [];

  // teachers
  const rawTeachers = teachers?.filter((t) => !t.archive.isArchive) || [];
  const archivedTeachers = teachers?.filter((t) => t.archive.isArchive) || [];

  const value = {
    adminId,
    admin: admin || null,
    allTeachers: teachers || [],
    rawTeachers: rawTeachers,
    archivedTeachers: archivedTeachers,
    allStudents: students || [],
    rawStudents: rawStudents,
    archivedStudents: archivedStudents,
    allSections: sections || [],
    rawSections: rawSections,
    archivedSections: archivedSections,
    allAssessments: assessments || [],
    rawAssessments: rawAssessments,
    archivedAssessments: archivedAssessments,
    activities: activities || [],
    onlineStudents:
      students?.filter((s) => onlineStudentIds.includes(s.id)) || [],

    // loading states
    isLoadingAdmin,
    isLoadingTeachers,
    isLoadingStudents,
    isLoadingSections,
    isLoadingAssessments,
    isLoadingActivities,
    isCriticalDataLoaded: !!admin,
  };

  if (
    showLoader ||
    isLoadingAdmin ||
    isLoadingTeachers ||
    isLoadingStudents ||
    isLoadingSections ||
    isLoadingAssessments ||
    isLoadingActivities ||
    !admin
  ) {
    return <PageLoader items={["Loading admin data..."]} />;
  }

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
