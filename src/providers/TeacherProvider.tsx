import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { TeacherContext } from "../context/TeacherContext";
import {
  useTeacher,
  useTeacherAssessments,
  useTeacherSections,
  useTeacherStudents
} from "../hooks/useTeacherData";

export function TeacherProvider({
  teacherId,
  children,
}: {
  teacherId: string;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000;
  const isMounted = useRef(true)

  // react query
  const { data: teacher } = useTeacher(teacherId);
  const { data: students } = useTeacherStudents(teacherId);
  const { data: sections } = useTeacherSections(teacherId);
  const { data: assessments } = useTeacherAssessments(teacherId);

  // track student online status
  const [onlineStudentIds, setOnlineStudentIds] = useState<string[]>([]);

  const onlineStudents = useMemo(() => {
    return students?.filter((s) => onlineStudentIds.includes(s._id));
  }, [students, onlineStudentIds]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    wsRef.current = new WebSocket("ws://localhost:3001");
    const ws = wsRef.current;

    ws.onopen = () => {
      if (!isMounted.current) {
        ws.close();
        return;
      }

      console.log("WebSocket connected");

      reconnectAttempts.current = 0;
      wsRef.current?.send(
        JSON.stringify({
          type: "TEACHER_LOGIN",
          data: teacherId,
        })
      );
    };

    ws.onmessage = (e) => {
      if (!isMounted.current) return;
      const { type, data } = JSON.parse(e.data);
      console.log("Received message: ", type, data);


      if (type === "STUDENT_ONLINE" || type === "STUDENT_OFFLINE") {
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "onlineStudents"],
          refetchType: "active",
        });
      }

      if (type === "STUDENT_ONLINE") {
        setOnlineStudentIds((prev) =>
          prev.includes(data.studentId) ? prev : [...prev, data.studentId]
        );
      }

      if (type === "STUDENT_OFFLINE") {
        setOnlineStudentIds((prev) => prev.filter((id) => id !== data.studentId));
      }
    };

    ws.onclose = () => {
      if (!isMounted.current) return;

      console.log("WebSocket closed");

      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
        setTimeout(connectWebSocket, reconnectInterval);
      }
    };

    wsRef.current.onerror = (error) => {
      if (!isMounted.current) return;

      console.error("WebSocket error:", error);
    };
  }, [teacherId, queryClient]);

  useEffect(() => {
    isMounted.current = true
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
    teacher: teacher || null,
    students: students || [],
    sections: sections || [],
    assessments: assessments || [],
    onlineStudents: onlineStudents || [],
  };

  return (
    <TeacherContext.Provider value={value}>
      {teacher && students && sections && assessments ? (
        children
      ) : (
        <div>Loading teacher data...</div>
      )}
    </TeacherContext.Provider>
  );
}
