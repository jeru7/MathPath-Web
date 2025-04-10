import { useEffect, useRef, useState } from "react";
import { Student } from "../types/student";
import { Section } from "../types/section";
import { Assessment } from "../types/assessment";
import { TeacherContext } from "../context/TeacherContext";
import { Teacher } from "../types/teacher";

export function TeacherProvider({ teacherId, children }: { teacherId: string, children: React.ReactNode }) {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [onlineStudents, setOnlineStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        wsRef.current = new WebSocket("ws://localhost:3001");

        wsRef.current.onopen = () => {
          wsRef.current?.send(JSON.stringify({
            type: "TEACHER_INITIAL",
            data: teacherId,
          }))
        }
      };

      wsRef.current.onmessage = (e) => {
        const { type, data } = JSON.parse(e.data);
        console.log("Received message: ", type, data)
        if (type === "TEACHER_INITIAL_DATA") {
          setTeacher(data.teacher);
          setStudents(data.students);
          setSections(data.sections);
          setAssessments(data.assessments);
          setOnlineStudents(data.onlineStudents);
          setLoading(false);
        }

        if (type === "NEW_SECTION_ADDED") {
          setSections((prev) => [...prev, data])
        }
      }
    }

    connectWebSocket();

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    }
  }, [teacherId]);

  return (
    <TeacherContext.Provider value={{ students, sections, assessments, onlineStudents, teacher }}>
      {loading ? (
        <div>Loading...</div>
      ) : children}
    </TeacherContext.Provider>
  );
}

