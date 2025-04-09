import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Student } from "../types/student";
import { Section } from "../types/section";
import { Assessment } from "../types/assessment";

interface ITeacherDataContext {
  students: Student[];
  sections: Section[];
  assessments: Assessment[];
}

const TeacherContext = createContext<ITeacherDataContext | null>(null);

export const useTeacherContext = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacherData must be used within a TeacherDataProvider.")
  }

  return context;
}

export function TeacherContextProvider({ teacherId, children }: { teacherId: string, children: React.ReactNode }) {
  const [students, setStudents] = useState([])
  const [sections, setSections] = useState([])
  const [assessments, setAssessments] = useState([])

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
        if (type === "TEACHER_INITIAL_DATA") {
          setStudents(data.students);
          setSections(data.sections);
          setAssessments(data.assessments);
        }
      }
    }

    connectWebSocket();

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    }
  }, [teacherId])

  return (
    <TeacherContext.Provider value={{ students, sections, assessments }}>
      {children}
    </TeacherContext.Provider>
  )
}
