import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { AdminContext } from "./admin.context";
import { useAdmin, useAdminTeacher } from "../services/admin.service";
import { useAdminSections } from "../services/admin-section.service";
import { WSS } from "../../core/constants/api.constant";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminAssessments } from "../services/admin-assessment.service";
import { useAdminStudents } from "../services/admin-student.service";
import { useAdminActivities } from "../services/admin-activity.service";

export default function AdminProvider({
  adminId,
  children,
}: {
  adminId: string;
  children: React.ReactNode;
}): ReactElement {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000;
  const isMounted = useRef(true);

  const queryClient = useQueryClient();

  const { data: admin } = useAdmin(adminId);
  const { data: teachers } = useAdminTeacher(adminId);
  const { data: students } = useAdminStudents(adminId);
  const { data: sections } = useAdminSections(adminId);
  const { data: assessments } = useAdminAssessments(adminId);
  const { data: activities } = useAdminActivities(adminId);

  // students
  const rawStudents = students?.filter((s) => !s.archive.isArchive);
  const archivedStudents = students?.filter((s) => s.archive.isArchive);

  // sections
  const rawSections = sections?.filter((s) => !s.archive.isArchive);
  const archivedSections = sections?.filter((s) => s.archive.isArchive);

  // assessments
  const rawAssessments = assessments?.filter((a) => !a.archive.isArchive);
  const archivedAssessments = assessments?.filter((a) => a.archive.isArchive);

  // track student online status
  const [onlineStudentIds, setOnlineStudentIds] = useState<string[]>([]);

  const onlineStudents = useMemo(() => {
    return students?.filter((s) => onlineStudentIds.includes(s.id));
  }, [students, onlineStudentIds]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    wsRef.current = new WebSocket(WSS);
    // console.log(WSS);
    const ws = wsRef.current;

    ws.onopen = () => {
      if (!isMounted.current) {
        ws.close();
        return;
      }

      // console.log("WebSocket connected");

      reconnectAttempts.current = 0;
    };

    ws.onmessage = (e) => {
      if (!isMounted.current) return;
      const { type, data } = JSON.parse(e.data);
      // console.log("Received message: ", type, data);

      if (type === "TEACHER_INITIAL_DATA") {
        setOnlineStudentIds(data.onlineStudents);
      }

      if (type === "STUDENT_ONLINE") {
        setOnlineStudentIds((prev) =>
          prev.includes(data.studentId) ? prev : [...prev, data.studentId],
        );
        queryClient.refetchQueries({
          queryKey: ["admin", adminId, "active-students"],
        });
        queryClient.refetchQueries({
          queryKey: ["admin", adminId, "online-trend"],
        });
        queryClient.refetchQueries({
          queryKey: ["admin", adminId, "students"],
        });
      }

      if (type === "STUDENT_OFFLINE") {
        setOnlineStudentIds((prev) =>
          prev.filter((id) => id !== data.studentId),
        );
        queryClient.refetchQueries({
          queryKey: ["admin", adminId, "active-students"],
        });
        queryClient.refetchQueries({
          queryKey: ["admin", adminId, "online-trend"],
        });
        queryClient.refetchQueries({
          queryKey: ["admin", adminId, "students"],
        });
      }
    };

    ws.onclose = () => {
      if (!isMounted.current) return;

      // console.log("WebSocket closed");

      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        // console.log(
        //   `Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`,
        // );
        setTimeout(connectWebSocket, reconnectInterval);
      }
    };

    wsRef.current.onerror = () => {
      if (!isMounted.current) return;

      // console.error("WebSocket error:", error);
    };
  }, [adminId, queryClient]);

  useEffect(() => {
    isMounted.current = true;
    connectWebSocket();

    return () => {
      isMounted.current = false;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectWebSocket]);

  const value = {
    adminId,
    admin: admin || null,
    teachers: teachers || [],
    allStudents: students || [],
    rawStudents: rawStudents || [],
    archivedStudents: archivedStudents || [],
    allSections: sections || [],
    rawSections: rawSections || [],
    archivedSections: archivedSections || [],
    allAssessments: assessments || [],
    rawAssessments: rawAssessments || [],
    archivedAssessments: archivedAssessments || [],
    activities: activities || [],
    onlineStudents: onlineStudents || [],
  };

  return (
    <AdminContext.Provider value={value}>
      {teachers ? children : <div>Loading admin data...</div>}
    </AdminContext.Provider>
  );
}
