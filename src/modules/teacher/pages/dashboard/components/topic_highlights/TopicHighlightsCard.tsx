import { type ReactElement } from "react";
import { FaMedal } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import CircularProgress from "../../../../../core/components/charts/CircularProgress";
import { useParams } from "react-router-dom";
import { useTeacherTopicHighlights } from "../../../../services/teacher-stats.service";

export default function TopicHighlightsCard({
  classes,
}: {
  classes: string;
}): ReactElement {
  const { teacherId } = useParams();
  const { data: topicHighlights } = useTeacherTopicHighlights(teacherId ?? "");

  return (
    <article
      className={`${classes} bg-white shadow-sm rounded-sm p-2 flex flex-col gap-3 min-h-60`}
    >
      <header>
        <p className="font-semibold text-md md:text-lg">Topic Highlights</p>
      </header>

      {topicHighlights?.hasData ? (
        <section className="flex flex-col sm:flex-row gap-2 h-full">
          {/* highest */}
          <article className="h-full w-full flex flex-col gap-2 items-center">
            <header className="flex items-center gap-2 lg:w-full">
              <div className="flex items-center justify-center bg-[var(--primary-green)] rounded-full p-2">
                <FaMedal className="w-4 h-4 text-white" />
              </div>
              <h6
                className="text-sm md:text-base font-semibold text-wrap sm:text-nowrap truncate sm:max-w-[150px]"
                title={topicHighlights.highest.title}
              >
                Highest: {topicHighlights.highest.title}
              </h6>
            </header>

            {/* pie */}
            <section className="flex flex-col h-full">
              <section className="w-[120px] h-full flex items-center justify-center flex-col">
                <CircularProgress
                  progress={topicHighlights.highest.correctness}
                  color="var(--primary-green)"
                />
              </section>
              {/* stats */}
              <section className="flex w-full text-sm items-center justify-center gap-4">
                <article className="flex flex-col text-center">
                  <p>Stage</p>
                  <p className="text-lg font-bold">
                    {topicHighlights.highest.stage}
                  </p>
                </article>
                <article className="flex flex-col text-center">
                  <p>Attempts</p>
                  <p className="text-lg font-bold">
                    {topicHighlights.highest.attempts}
                  </p>
                </article>
              </section>
            </section>
          </article>

          <div className="w-[2px] bg-gray-200"></div>

          {/* lowest */}
          <article className="h-full w-full flex flex-col gap-2 items-center">
            <header className="flex items-center gap-2 lg:w-full">
              <div className="flex items-center justify-center bg-[var(--primary-yellow)] rounded-full p-2">
                <IoWarning className="w-4 h-4 text-white" />
              </div>
              <h6
                className="text-sm md:text-base font-semibold text-wrap sm:text-nowrap truncate sm:max-w-[150px]"
                title={topicHighlights.lowest.title}
              >
                Lowest: {topicHighlights.lowest.title}
              </h6>
            </header>

            {/* pie */}
            <section className="flex h-full flex-col">
              <section className="w-[120px] h-full flex items-center justify-center flex-col">
                <CircularProgress
                  progress={topicHighlights.lowest.correctness}
                  color="var(--primary-yellow)"
                />
              </section>
              {/* stats */}
              <section className="flex w-full text-sm items-center justify-center gap-4">
                <article className="flex flex-col text-center">
                  <p>Stage</p>
                  <p className="text-lg font-bold">
                    {topicHighlights.lowest.stage}
                  </p>
                </article>
                <article className="flex flex-col text-center">
                  <p>Attempts</p>
                  <p className="text-lg font-bold">
                    {topicHighlights.lowest.attempts}
                  </p>
                </article>
              </section>
            </section>
          </article>
        </section>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="italic text-gray-300">No data available</p>
        </div>
      )}
    </article>
  );
}
