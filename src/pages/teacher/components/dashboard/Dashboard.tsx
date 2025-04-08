import { type ReactElement, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import PrimaryStat, { IPrimaryStatProps } from "./PrimaryStat";

export default function Dashboard(): ReactElement {
  const { teacherId } = useParams();
  const [stats, setStats] = useState({
    students: 0,
    sections: 0,
    assessments: 0,
    onlineStudents: 0,
  });

  const primaryStats: IPrimaryStatProps[] = [
    {
      color: "bg-[var(--primary-green)]",
      title: "Students",
      students: stats.students,
      onlineStudents: stats.onlineStudents,
    },
    {
      color: "bg-[var(--primary-orange)]",
      title: "Sections",
      sections: stats.sections,
    },
    {
      color: "bg-[var(--secondary-orange)]",
      title: "Assessments",
      assessments: stats.assessments,
    },
  ];

  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        console.log("Opening WebSocket...");
        wsRef.current = new WebSocket("ws://localhost:3001");

        wsRef.current.onopen = () => {
          console.log("WebSocket connected.");
          wsRef.current?.send(
            JSON.stringify({
              type: "TEACHER_CHECK_DASHBOARD",
              data: teacherId,
            }),
          );
        };

        wsRef.current.onclose = () => {
          console.log("WebSocket closed.");
        };

        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        wsRef.current.onmessage = (event) => {
          console.log("Message received!");
          const { type, data } = JSON.parse(event.data);
          if (type === "TEACHER_DASHBOARD_DATA") {
            setStats(() => ({
              students: data.students.length,
              sections: data.sections.length,
              assessments: data.assessments.length,
              onlineStudents: data.onlineStudents.length,
            }));
          }
        };
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [teacherId]);

  return (
    <main className="flex h-full w-full flex-col gap-4 bg-inherit p-4">
      {/* Header */}
      <header className="flex h-fit items-center justify-between">
        <h3 className="font-bold lg:text-2xl">Dashboard</h3>
        <div className="flex w-fit items-center gap-2">
          <p>Emmanuel Ungab</p>
          <div className="border-1 h-[50px] w-[50px] rounded-full"></div>
        </div>
      </header>

      {/* Stats */}
      <section className="flex grow-[2] gap-4">
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
      </section>

      {/* Charts */}
      <section className="flex grow-[10] gap-4">
        {/* Main Chart */}
        <div className="grow-[3] border-2"></div>
        {/* Student activity */}
        <div className="grow-[1] border-2"></div>
      </section>
    </main>
  );
}
