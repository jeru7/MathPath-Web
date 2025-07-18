import { type ReactElement } from "react";
import { useAssessmentBuilder } from "../context/assessment-builder.context";
import { getTotalScore } from "../utils/assessment-builder.utils";

export default function ConfigureAssessment(): ReactElement {
  // reducer
  const { state, dispatch } = useAssessmentBuilder();

  const totalScore = getTotalScore(state);

  // handlers
  const handleTitleChange = (title: string) => {
    dispatch({ type: "UPDATE_ASSESSMENT_TITLE", payload: title });
  };

  const handleTopicChange = (topic: string) => {
    dispatch({ type: "UPDATE_ASSESSMENT_TOPIC", payload: topic });
  };

  const handleDescriptionChange = (description: string) => {
    dispatch({ type: "UPDATE_ASSESSMENT_DESCRIPTION", payload: description });
  };

  const handlePassingScoreChange = (passingScore: number) => {
    dispatch({
      type: "UPDATE_ASSESSMENT_PASSING_SCORE",
      payload: passingScore,
    });
  };

  const handleTimeLimitChange = (timeLimit: number) => {
    dispatch({
      type: "UPDATE_ASSESSMENT_TIME_LIMIT",
      payload: timeLimit,
    });
  };

  const handleAttemptLimitChange = (attemptLimit: number) => {
    dispatch({
      type: "UPDATE_ASSESSMENT_ATTEMPT_LIMIT",
      payload: attemptLimit,
    });
  };

  return (
    <div className="flex w-full h-full px-96 items-start justify-center">
      <section className="border rounded-sm border-gray-300 bg-white h-fit w-[800px] flex flex-col gap-4 p-4 items-center">
        <form className="w-full flex flex-col gap-4">
          {/* assessment title */}
          <div className="flex items-center gap-2 w-full">
            <label
              htmlFor="title"
              className="min-w-32 w-32 text-right font-semibold"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              value={state.title ?? ""}
              className="border-gray-300 border rounded-sm outline-none px-2 py-1 w-full"
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>
          {/* assessment topic */}
          <div className="flex items-center gap-2 w-full">
            <label
              htmlFor="topic"
              className="min-w-32 w-32 text-right font-semibold"
            >
              Topic
            </label>
            <input
              type="text"
              name="topic"
              value={state.topic ?? ""}
              className="border-gray-300 border rounded-sm outline-none px-2 py-1 w-full"
              onChange={(e) => handleTopicChange(e.target.value)}
            />
          </div>
          {/* assessment description */}
          <div className="flex items-start gap-2 w-full border-b border-gray-300 pb-4">
            <label
              htmlFor="description"
              className="min-w-32 w-32 text-right font-semibold"
            >
              Description
            </label>
            <textarea
              name="description"
              value={state.description ?? ""}
              className="border-gray-300 border rounded-sm outline-none px-2 py-1 w-full min-h-32 resize-none"
              onChange={(e) => handleDescriptionChange(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-between">
            {/* passing score */}
            <div className="flex items-center gap-2 w-fit">
              <label
                htmlFor="description"
                className="min-w-32 w-32 text-right font-semibold"
              >
                Passing Score
              </label>
              <input
                type="number"
                name="passing-score"
                className="border-gray-300 border rounded-sm outline-none px-2 py-1 w-32 resize-none"
                min={1}
                max={totalScore === 0 ? 1 : totalScore}
                defaultValue={
                  totalScore === 0 ? 1 : Math.round(totalScore * 0.75)
                }
                onChange={(e) =>
                  handlePassingScoreChange(Number(e.target.value))
                }
              />
              <p className="text-sm text-gray-400">{`${totalScore === 0 ? "" : `/ ${totalScore}`}`}</p>
            </div>
            {/* attempts limit */}
            <div className="flex items-center gap-2 w-fit">
              <label
                htmlFor="description"
                className="min-w-32 w-32 text-right font-semibold"
              >
                Attempt Limit
              </label>
              <input
                type="number"
                name="passing-score"
                className="border-gray-300 border rounded-sm outline-none px-2 py-1 w-32 resize-none"
                min={1}
                max={10}
                defaultValue={1}
                onChange={(e) =>
                  handleAttemptLimitChange(Number(e.target.value))
                }
              />
            </div>
          </div>
          <div className="flex items-baseline gap-2 w-fit">
            <label
              htmlFor="description"
              className="min-w-32 w-32 text-right font-semibold"
            >
              Time Limit
            </label>
            <input
              type="number"
              name="passing-score"
              className="border-gray-300 border rounded-sm outline-none px-2 py-1 w-32 resize-none"
              min={10}
              max={180}
              defaultValue={10}
              onChange={(e) => handleTimeLimitChange(Number(e.target.value))}
            />
            <p className="text-sm text-gray-400 italic">minutes</p>
          </div>
        </form>
      </section>
    </div>
  );
}
