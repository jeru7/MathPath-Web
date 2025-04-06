import { type ReactElement, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

// import axios from "axios";

import PrimaryStat, { IPrimaryStatProps } from "./PrimaryStat";

export default function DashboardPage(): ReactElement {
  // const navigate = useNavigate();
  const { teacherId } = useParams();

  const [students, setStudents] = useState(0);
  const [sections, setSections] = useState(0);
  const [assessments, setAssessments] = useState(0);
  const [onlineStudents, setOnlineStudents] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectWebSocket = () => {
      if (wsRef.current) {
        return;
      }

      wsRef.current = new WebSocket("ws://localhost:3001");

      wsRef.current.onopen = () => {
        console.log("WebSocket connected.");
        setIsConnected(true);
        wsRef.current?.send(
          JSON.stringify({
            type: "TEACHER_LOGIN",
            data: teacherId,
          }),
        );
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket closed.");
        setIsConnected(false);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      wsRef.current.onmessage = (event) => {
        console.log("Message recieved!");

        console.log(event.data);

        const { type, data } = JSON.parse(event.data);

        if (type === "TEACHER_DASHBOARD") {
          setStudents(data.students.length);
          setSections(data.sections.length);
          setAssessments(data.assessments.length);
          setOnlineStudents(data.onlineStudents.length);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current && isConnected) {
        wsRef.current.close();
        console.log("Websocket closed.");
      }
    };
  }, [teacherId, isConnected]);

  const primaryStats: IPrimaryStatProps[] = [
    {
      color: "bg-[var(--primary-green)]",
      title: "Students",
      students,
      onlineStudents,
    },
    {
      color: "bg-[var(--primary-orange)]",
      title: "Sections",
      sections,
    },
    {
      color: "bg-[var(--primary-yellow)]",
      title: "Assessments",
      assessments,
    },
  ];

  // const handleLogout = async () => {
  //   try {
  //     await axios.post("/api/web/auth/logout", {}, { withCredentials: true });
  //
  //     navigate("/");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <main className="flex h-full w-full flex-col gap-4 bg-inherit p-4">
      <div className="flex h-fit items-center justify-between">
        <h3 className="font-bold lg:text-2xl">Dashboard</h3>
        <div className="flex w-fit items-center gap-2">
          <p>Emmanuel Ungab</p>
          <div className="border-1 h-[50px] w-[50px] rounded-full"></div>
        </div>
      </div>
      <div className="flex grow-[2] gap-4">
        {primaryStats.map((stat, index) => (
          <PrimaryStat
            key={index}
            title={stat.title}
            color={stat.color}
            students={stat.students}
            sections={stat.sections}
            assessments={stat.assessments}
            onlineStudents={stat.onlineStudents}
          />
        ))}
      </div>
      <div className="flex grow-[10] gap-4">
        <div className="grow-[3] border-2"></div>
        <div className="grow-[1] border-2"></div>
      </div>
    </main>
  );
}
