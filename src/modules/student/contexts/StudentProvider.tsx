import { ReactNode, useCallback, useEffect, useRef } from "react";
import { useStudent } from "../services/student.service";
import { StudentContext } from "./student.context";

export function StudentProvider({
  studentId,
  children,
}: {
  studentId: string;
  children: ReactNode;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000;
  const isMounted = useRef(true);

  const { data: student } = useStudent(studentId);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    const WSS =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_WSS_PROD_URI
        : import.meta.env.VITE_WSS_DEV_URI;

    wsRef.current = new WebSocket(WSS);
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
          type: "STUDENT_LOGIN",
          data: studentId,
        }),
      );
    };

    ws.onmessage = (e) => {
      if (!isMounted.current) return;
      const { type, data } = JSON.parse(e.data);
      console.log("Received message: ", type, data);
    };

    ws.onclose = () => {
      if (!isMounted.current) return;

      console.log("WebSocket closed");

      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        console.log(
          `Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`,
        );
        setTimeout(connectWebSocket, reconnectInterval);
      }
    };

    wsRef.current.onerror = (error) => {
      if (!isMounted.current) return;

      console.error("WebSocket error:", error);
    };
  }, [studentId]);

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
    student: student || null,
  };
  return (
    <StudentContext.Provider value={value}>
      {student ? children : <div>Loading student data...</div>}
    </StudentContext.Provider>
  );
}
