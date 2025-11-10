import { type ReactElement } from "react";
import PrimaryStat from "./components/PrimaryStat";
import ActivityList from "../../../core/components/activity/ActivityList";
import CustomCalendar from "../../../core/components/calendar/CustomCalendar";
import ActiveStudentsCard from "./components/active_students/ActiveStudentsCard";
import TopicHighlightsCard from "./components/topic_highlights/TopicHighlightsCard";
import AssessmentStatusCard from "./components/assessment_status/AssessmentStatusCard";
import { useTeacherContext } from "../../context/teacher.context";
import StudentOnlineTrend from "./components/student_online_trend/StudentOnlineTrend";
import TopStudentsCard from "@/modules/core/components/top-students/TopStudentsCard";

export default function Dashboard(): ReactElement {
  const {
    rawStudents,
    rawSections,
    rawAssessments,
    onlineStudents,
    activities,
    teacherId,
    isLoadingActivities,
  } = useTeacherContext();

  const primaryStats = [
    {
      title: "Students" as const,
      students: rawStudents.length,
      onlineStudents: onlineStudents.length,
    },
    {
      title: "Sections" as const,
      sections: rawSections.length,
    },
    {
      title: "Assessments" as const,
      assessments: rawAssessments.length,
    },
  ];

  return (
    <main className="flex flex-col min-h-screen h-full w-full gap-2 bg-inherit p-2 mt-4 lg:mt-0">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          Dashboard
        </h3>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row gap-2">
        <div className="xl:w-[80%] flex-1 flex flex-col gap-2">
          <section className="flex min-h-40 md:min-h-[210px] gap-2 overflow-x-auto overflow-y-hidden xl:overflow-x-hidden no-scrollbar">
            {primaryStats.map((stat, index) => (
              <PrimaryStat
                key={index}
                title={stat.title}
                students={stat.students}
                sections={stat.sections}
                assessments={stat.assessments}
                onlineStudents={stat.onlineStudents}
              />
            ))}
          </section>

          <StudentOnlineTrend userId={teacherId} userType="teacher" />

          <div className="h-full w-full gap-2 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4">
            <ActiveStudentsCard userId={teacherId} userType="teacher" />
            <TopicHighlightsCard userId={teacherId} userType="teacher" />
            <AssessmentStatusCard />
            <TopStudentsCard userType="teacher" userId={teacherId} />
          </div>
        </div>

        <div className="w-full xl:w-[20%] flex flex-col md:flex-row xl:flex-col gap-2 overflow-hidden">
          <CustomCalendar classes="" />
          <ActivityList
            activities={activities}
            type="Teacher"
            isLoading={isLoadingActivities}
          />
        </div>
      </div>
    </main>
  );
}
