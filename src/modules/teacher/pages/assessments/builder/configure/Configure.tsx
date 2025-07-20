import { useEffect, useState, type ReactElement } from "react";
import { useAssessmentBuilder } from "../context/assessment-builder.context";
import { getTotalScore } from "../utils/assessment-builder.utils";

export default function Configure(): ReactElement {
  // reducer
  const { state, dispatch } = useAssessmentBuilder();

  // initials
  const totalScore = getTotalScore(state);
  const passingScoreMinLimit =
    totalScore === 0 ? 1 : Math.round(totalScore * 0.5);

  // states
  const [passingScore, setPassingScore] = useState(
    state.passingScore ?? passingScoreMinLimit,
  );
  const [timeLimit, setTimeLimit] = useState(state.timeLimit ?? 10);
  const [attemptLimit, setAttemptLimit] = useState(state.attemptLimit ?? 1);

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
    setPassingScore(passingScore);
  };

  const handleTimeLimitChange = (timeLimit: number) => {
    setTimeLimit(timeLimit);
  };

  const handleAttemptLimitChange = (_attemptLimit: number) => {
    setAttemptLimit(_attemptLimit);
  };

  const handlePassingScoreBlur = () => {
    if (isNaN(passingScore)) return;
    if (passingScore >= passingScoreMinLimit && passingScore <= totalScore) {
      dispatch({
        type: "UPDATE_ASSESSMENT_PASSING_SCORE",
        payload: passingScoreMinLimit,
      });
    } else {
      setPassingScore(state.passingScore ?? passingScoreMinLimit);
    }
  };

  const handleAttemptLimitBlur = () => {
    if (isNaN(attemptLimit)) return;
    if (attemptLimit >= 1 && attemptLimit <= 3) {
      dispatch({
        type: "UPDATE_ASSESSMENT_ATTEMPT_LIMIT",
        payload: attemptLimit,
      });
    } else {
      setAttemptLimit(state.attemptLimit ?? 1);
    }
  };

  const handleTimeLimitBlur = () => {
    if (isNaN(timeLimit)) return;
    if (timeLimit >= 10 && timeLimit <= 50) {
      dispatch({
        type: "UPDATE_ASSESSMENT_TIME_LIMIT",
        payload: timeLimit,
      });
    } else {
      setTimeLimit(state.timeLimit ?? 10);
    }
  };

  useEffect(() => {
    dispatch({
      type: "UPDATE_ASSESSMENT_PASSING_SCORE",
      payload: passingScoreMinLimit,
    });
  }, [dispatch, passingScoreMinLimit]);

  return (
    <div className="flex h-full w-[800px] items-start justify-center">
      <section className="border rounded-sm border-gray-300 bg-white h-fit w-full flex flex-col gap-4 p-4 items-center">
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
            <div className="relative flex items-center gap-2 w-fit">
              <label
                htmlFor="description"
                className="min-w-32 w-32 text-right font-semibold"
              >
                Passing Score
              </label>
              <input
                type="number"
                name="passing-score"
                className="border-gray-300 border rounded-sm outline-none px-2 py-1 w-32 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                value={passingScore}
                min={passingScoreMinLimit}
                max={totalScore === 0 ? 1 : totalScore}
                onChange={(e) =>
                  handlePassingScoreChange(Number(e.target.value))
                }
                onBlur={handlePassingScoreBlur}
                disabled={totalScore === 0}
              />
              {totalScore === 0 ? (
                <p className="text-sm text-gray-400 italic">Unavailable</p>
              ) : (
                <p className="text-sm text-gray-400">/ {totalScore}</p>
              )}
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
                name="attempt-limit"
                className="border-gray-300 border rounded-sm outline-none px-2 py-1 w-32 resize-none"
                value={attemptLimit}
                min={1}
                max={3}
                onChange={(e) =>
                  handleAttemptLimitChange(Number(e.target.value))
                }
                onBlur={handleAttemptLimitBlur}
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
              name="time-limit"
              className="border-gray-300 border rounded-sm outline-none px-2 py-1 w-32 resize-none"
              value={timeLimit}
              min={10}
              max={50}
              onChange={(e) => handleTimeLimitChange(Number(e.target.value))}
              onBlur={handleTimeLimitBlur}
            />
            <p className="text-sm text-gray-400 italic">minutes</p>
          </div>
        </form>
      </section>
    </div>
  );
}
