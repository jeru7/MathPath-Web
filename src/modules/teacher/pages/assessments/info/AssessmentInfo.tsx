import { type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTeacherAssessment } from "../../../services/teacher.service";
import AssessmentStatus from "../components/assessment_table/AssessmentStatus";
import { formatToPhDate } from "../../../../date/utils/date.util";
import { format } from "date-fns";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function AssessmentInfo(): ReactElement {
  // TODO: display specific assessment details
  const { teacherId, assessmentId } = useParams();
  const navigate = useNavigate();

  const { data: assessment, isFetching } = useTeacherAssessment(
    teacherId ?? "",
    assessmentId ?? "",
  );

  if (isFetching) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-full h-fit w-full p-4 gap-2 bg-inherit">
      <div>
        <button
          onClick={() => navigate("..")}
          className="border-1 px-4 py-1 opacity-80 rounded-sm transition-opacity duration-200 hover:cursor-pointer hover:opacity-100"
        >
          Back
        </button>
      </div>
      {/* TODO:
          -title
          -topic
          -description
          -status
          -date
          -overall progress
          -per section progress
          -stats
          -student's list
        */}
      <main className="flex-1 flex flex-col min-h-full w-full gap-2">
        <section className="relative flex-col gap-2 bg-white rounded-sm p-4 shadow-sm">
          <HiOutlineDotsVertical className="w-5 h-5 absolute right-5" />
          {/* main info */}
          <article className="flex flex-col text-lg gap-2">
            {/* title */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Title:</span>{" "}
              <p
                className={`text-base ${assessment?.title ? "" : "text-gray-400 italic"}`}
              >
                {assessment?.title ?? "(No title)"}
              </p>
            </div>

            {/* topic */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Topic:</span>{" "}
              <p
                className={`text-base ${assessment?.topic ? "" : "text-gray-400 italic"}`}
              >
                {assessment?.topic ?? "(No topic)"}
              </p>
            </div>

            {/* description */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Description:</span>{" "}
              <p
                className={`text-base ${assessment?.description ? "" : "text-gray-400 italic"}`}
              >
                {assessment?.description ?? "(No Description)"}
              </p>
            </div>

            {/* status */}
            <div className="flex items-center gap-2 text-sm">
              <p className="text-lg font-semibold">Status:</p>
              <AssessmentStatus status={assessment?.status} />
            </div>

            {/* start date */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Start date:</span>{" "}
              <p
                className={`text-base ${assessment?.date.start ? "" : "text-gray-400 italic"}`}
              >
                {assessment?.date.start
                  ? format(
                      formatToPhDate(assessment.date.start.toString()),
                      "MMMM d, yyyy 'at' h:mm a",
                    )
                  : "No data available"}
              </p>
            </div>

            {/* deadline */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Deadline:</span>{" "}
              <p
                className={`text-base ${assessment?.date.end ? "" : "text-gray-400 italic"}`}
              >
                {assessment?.date.end
                  ? format(
                      formatToPhDate(assessment.date.end.toString()),
                      "MMMM d, yyyy 'at' h:mm a",
                    )
                  : "No data available"}
              </p>
            </div>
          </article>
        </section>
        <div className="flex w-full gap-2">
          {/* section lists */}
          <section className="flex flex-col w-full gap-2 bg-white rounded-sm shadow-sm min-w-[400px]">
            <header className="border-b border-b-gray-300 p-2">
              <p className="font-semibold text-lg">Sections</p>
            </header>
            <section className="flex items-center justify-center p-4 min-h-[400px]">
              {assessment?.sections && assessment?.sections.length > 0 ? (
                assessment?.sections.map(() => <p></p>)
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </section>
          </section>

          {/* configuration */}
          <section className="flex flex-col w-full gap-2 bg-white rounded-sm shadow-sm min-w-[400px]">
            <header className="border-b border-b-gray-300 p-2">
              <p className="font-semibold text-lg">Configuration</p>
            </header>
            <section className="flex items-center justify-center p-4 min-h-[400px]"></section>
          </section>

          {/* progress */}
          <section className="flex flex-col w-full gap-2 bg-white rounded-sm shadow-sm min-w-[400px]">
            <header className="border-b border-b-gray-300 p-2">
              <p className="font-semibold text-lg">Progress</p>
            </header>
            <section className="flex items-center justify-center p-4 min-h-[400px]"></section>
          </section>

          {/* latest */}
          <section className="flex flex-col w-full gap-2 bg-white rounded-sm shadow-sm min-w-[400px]">
            <header className="border-b border-b-gray-300 p-2">
              <p className="font-semibold text-lg">Latest</p>
            </header>
            <section className="flex items-center justify-center p-4 min-h-[400px]"></section>
          </section>
        </div>
        <section className="flex flex-col w-full gap-2 bg-white rounded-sm shadow-sm min-h-[400px]">
          <header className="border-b border-b-gray-300 p-2">
            <p className="font-semibold text-lg">Assessment Trend</p>
          </header>
        </section>
      </main>
    </div>
  );
}
