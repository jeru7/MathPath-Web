import { useState, type ReactElement } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { getCustomSelectColor } from "../../../../core/styles/selectStyles";
import { IoIosClose } from "react-icons/io";
import { FaPlus, FaMinus } from "react-icons/fa6";
// import FormButtons from "../FormButtons";

interface IGenerateCodeProps {
  handleBack: () => void;
}

export default function GenerateCode({
  handleBack,
}: IGenerateCodeProps): ReactElement {
  const navigate = useNavigate();
  const [numberOfStudents, setNumberOfStudents] = useState<number>(10);

  const handleNumberOfStudentsInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    if (value === "") {
      setNumberOfStudents(10);
      return;
    }

    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      setNumberOfStudents(10);
      return;
    }

    setNumberOfStudents(parsedValue);
  };

  const handleNumberOfStudentsBlur = () => {
    if (numberOfStudents < 10) {
      setNumberOfStudents(10);
    } else if (numberOfStudents > 50) {
      setNumberOfStudents(50);
    }
  };

  const handleIncrementStudents = () => {
    setNumberOfStudents((prev) => {
      if (prev >= 50) {
        return 50;
      }

      return prev + 1;
    });
  };

  const handleDecrementStudents = () => {
    setNumberOfStudents((prev) => {
      if (prev <= 10) {
        return 10;
      }

      return prev - 1;
    });
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("..");
  };
  return (
    <form>
      <div className="relative flex flex-col gap-2 rounded-md bg-[var(--primary-white)] p-8">
        {/* Exit/Close button */}
        <button
          className="absolute right-4 top-4 hover:scale-105 hover:cursor-pointer"
          onClick={handleClose}
        >
          <IoIosClose className="h-4 w-4" />
        </button>
        {/* Header */}
        <header>
          <h3 className="border-b border-b-[var(--primary-gray)] pb-2 text-2xl font-bold">
            Add Student - Generate Code
          </h3>
        </header>
        <div className="flex flex-col gap-4">
          {/* Section selection */}
          <div className="flex flex-col gap-1">
            <label htmlFor="section" className="font-medium">
              Section
            </label>
            <Select
              id="section"
              name="section"
              // options={sectionOptions}
              styles={getCustomSelectColor({ borderRadius: "0" })}
              className="basic-select"
              classNamePrefix="select"
              placeholder="Select a section..."
            />
          </div>
          {/* Number of uses/students */}
          <div className="flex flex-col gap-1">
            <label htmlFor="studentNumber" className="font-medium">
              Number of Students
            </label>
            <div className="relative">
              <input
                type="number"
                id="studentNumber"
                name="studentNumber"
                value={numberOfStudents}
                onChange={handleNumberOfStudentsInputChange}
                onBlur={handleNumberOfStudentsBlur}
                placeholder=""
                className="border-1 w-full py-2 pl-3 pr-10 [appearance:textfield] focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
              />
              <div className="absolute right-0 top-0 flex h-full flex-col justify-center pr-2">
                <div className="flex">
                  <button
                    type="button"
                    onClick={handleDecrementStudents}
                    className="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <FaMinus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleIncrementStudents}
                    className="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <FaPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Buttons */}
          {/* <FormButtons handleBack={handleBack} text={"Generate"} /> */}
        </div>
      </div>
    </form>
  );
}
