import { IQuestion } from "../../../../types/assessment.type";
import { Trash2 } from "lucide-react";

interface AssessmentQuestionProps {
  question: IQuestion;
  updateQuestion: (updatedData: Partial<IQuestion>) => void;
  deleteQuestion: () => void;
  questionIndex: string;
}

export default function AssessmentQuestion({
  question,
  updateQuestion,
  deleteQuestion,
  questionIndex,
}: AssessmentQuestionProps) {
  const handleInputChange = (
    field: keyof IQuestion,
    value: string | number | string[],
  ) => {
    updateQuestion({ [field]: value });
  };

  const handleChoicesChange = (index: number, value: string) => {
    const updatedChoices = [...question.choices];
    updatedChoices[index] = value;
    updateQuestion({ choices: updatedChoices });
  };

  const addChoice = () => {
    const updatedChoices = [...question.choices, ""];
    updateQuestion({ choices: updatedChoices });
  };

  const deleteChoice = (index: number) => {
    if (index === 0) return;

    const updatedChoices = question.choices.filter((_, i) => i !== index);
    updateQuestion({ choices: updatedChoices });
  };

  const handleSelectAnswer = (value: string) => {
    if (question.choices.includes(value)) {
      updateQuestion({ answer: value });
    }
  };

  return (
    <div className="bg-white p-4 rounded-sm shadow-sm flex flex-col">
      {/* Question */}
      <div className="mb-2">
        <label className="block font-semibold">Question</label>
        <input
          type="text"
          value={question.question}
          onChange={(e) => handleInputChange("question", e.target.value)}
          className="w-full border-2 p-2 rounded-sm"
          placeholder="Enter question"
        />
      </div>

      {/* Choices */}
      <div className="mb-2">
        <label className="block font-semibold">Choices</label>
        {question.choices.map((choice, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="radio"
              name={questionIndex}
              checked={question.answer === choice}
              onChange={() => handleSelectAnswer(choice)}
              className="mr-2"
            />
            <input
              type="text"
              value={choice}
              onChange={(e) => handleChoicesChange(index, e.target.value)}
              className="w-full border-2 p-2 rounded-sm"
              placeholder={`Choice ${index + 1}`}
            />

            {/* delete button for each choices */}
            {index > 0 && (
              <button
                onClick={() => deleteChoice(index)}
                className="text-red-500 ml-2 hover:cursor-pointer"
              >
                <Trash2 />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addChoice}
          className="text-[var(--primary-green)] hover:cursor-pointer"
        >
          + Add Choice
        </button>
      </div>

      {/* Points */}
      <div className="mb-2">
        <label className="block font-semibold">Points</label>
        <input
          type="number"
          value={question.points}
          onChange={(e) =>
            handleInputChange("points", parseInt(e.target.value))
          }
          className="w-full border-2 p-2 rounded-sm"
          placeholder="Enter points"
        />
      </div>

      {/* Delete Question */}
      <button
        onClick={deleteQuestion}
        className="p-2 bg-red-500 text-white rounded-sm self-end hover:cursor-pointer"
      >
        Delete Question
      </button>
    </div>
  );
}
