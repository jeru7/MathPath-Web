import { useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddButton from "../AddButton";
import AssessmentQuestion from "./AssessmentQuestion";
import {
  ICreateAssessment,
  IQuestion,
} from "../../../../types/assessment.type";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../styles/customDatePopper.css";

import Select from "react-select";
import { getCustomSelectColor } from "../../../../utils/selectStyles";
import { Calendar } from "lucide-react";

export default function CreateAssessment(): ReactElement {
  const navigate = useNavigate();
  const { teacherId } = useParams();

  const [assessmentDetails, setAssessmentDetails] = useState<ICreateAssessment>(
    {
      name: "",
      topic: "",
      description: "",
      teacher: teacherId?.toString() || "",
      sections: [],
      questions: [],
      deadline: new Date(),
    },
  );

  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const handleCreateBtn = () => {
    alert("Created");
  };

  const handleBackBtn = () => {
    navigate("..");
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        points: 1,
        choices: [""],
        answer: "",
      },
    ]);
  };

  const updateQuestion = (id: number, updatedData: Partial<IQuestion>) => {
    setQuestions((prev) =>
      prev.map((q, index) => (index === id ? { ...q, ...updatedData } : q)),
    );
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((_, index) => index !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssessmentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssessmentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSectionChange = (selectedOptions: any) => {
    const selectedSections = selectedOptions.map((option: any) => option.value);
    setAssessmentDetails((prev) => ({
      ...prev,
      sections: selectedSections,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setAssessmentDetails((prev) => ({
      ...prev,
      deadline: date || new Date(),
    }));
  };

  return (
    <div className="flex h-fit min-h-full w-full flex-col gap-4 bg-inherit p-4">
      <div className="flex justify-between">
        <div>
          <button
            onClick={handleBackBtn}
            className="border-1 px-4 py-1 opacity-80 rounded-sm transition-opacity duration-200 hover:cursor-pointer hover:opacity-100"
          >
            Back
          </button>
        </div>
        <AddButton text="Create Assessment Form" action={handleCreateBtn} />
      </div>

      <main className="flex flex-col gap-4">
        <section className="bg-white rounded-sm shadow-sm py-4 px-8 flex flex-col gap-2">
          <div className="mb-4">
            <input
              type="text"
              id="name"
              name="name"
              value={assessmentDetails.name}
              onChange={handleInputChange}
              className="w-full p-2 text-3xl border-b-2"
              placeholder="Title"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              id="topic"
              name="topic"
              value={assessmentDetails.topic}
              onChange={handleInputChange}
              className="w-full p-2 text-xl border-b-2"
              placeholder="Enter topic"
            />
          </div>

          <div className="mb-4">
            <textarea
              id="description"
              name="description"
              value={assessmentDetails.description}
              onChange={handleTextAreaChange}
              className="w-full p-2 text-xl border-b-2"
              placeholder="Enter description"
            />
          </div>

          <div className="w-full flex gap-4">
            <div className="mb-4 w-full">
              <label htmlFor="sections" className="block font-semibold">
                Sections
              </label>
              <Select
                isMulti
                name="sections"
                options={[
                  { value: "section1", label: "Section 1" },
                  { value: "section2", label: "Section 2" },
                  { value: "section3", label: "Section 3" },
                ]}
                value={assessmentDetails.sections.map((section) => ({
                  value: section,
                  label: section.charAt(0).toUpperCase() + section.slice(1),
                }))}
                onChange={handleSectionChange}
                styles={getCustomSelectColor()}
                placeholder="Select sections..."
              />
            </div>
            <div>
              <label htmlFor="duedate" className="block font-semibold">
                Due Date
              </label>
              <DatePicker
                selected={assessmentDetails.deadline}
                onChange={handleDateChange}
                minDate={new Date()}
                className="w-full shadow"
                disabledKeyboardNavigation
                placeholderText="Select due date"
                dateFormat="yyyy-MM-dd"
                customInput={
                  <button className="flex items-center justify-between gap-4 w-full px-4 py-2 bg-[var(--tertiary-green)] text-black rounded-md hover:bg-[var(--primary-green)] transition-colors duration-200 hover:cursor-pointer">
                    <span className="">
                      {assessmentDetails.deadline.toLocaleDateString()}
                    </span>
                    <Calendar className="" size={20} />
                  </button>
                }
              />
            </div>
          </div>
        </section>

        {/* Questions */}
        {questions.map((question, index) => (
          <AssessmentQuestion
            key={index}
            questionIndex={`question-${index}`}
            question={question}
            updateQuestion={(updatedData) => updateQuestion(index, updatedData)}
            deleteQuestion={() => deleteQuestion(index)}
          />
        ))}

        <button
          onClick={addQuestion}
          className="bg-white px-4 py-2 rounded-sm self-end shadow-sm hover:cursor-pointer font-semibold opacity-80 hover:opacity-100 transition-opacity duration-200"
        >
          + Add Question
        </button>
      </main>
    </div>
  );
}
