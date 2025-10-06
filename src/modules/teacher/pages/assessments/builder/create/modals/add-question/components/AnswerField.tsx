import { type ReactElement } from "react";

type AnswerFieldProps = {
  label?: string;
  type: "text" | "radio";
  name?: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  checked?: boolean;
  radioLabel?: "True" | "False";
  isEmpty?: boolean;
};
export default function AnswerField({
  label,
  type,
  value,
  name,
  onChange,
  checked,
  radioLabel,
  isEmpty,
}: AnswerFieldProps): ReactElement {
  return (
    <article
      className={`flex items-center gap-2 rounded-sm ${
        type === "radio"
          ? ""
          : `border p-2 ${isEmpty ? "border-red-500" : "border-gray-300 dark:border-gray-500"} bg-white dark:bg-gray-700`
      } transition-colors duration-200`}
    >
      {label && (
        <div className="p-2 border-r border-gray-300 dark:border-gray-600 text-green-600 dark:text-green-400 font-bold text-sm transition-colors duration-200">
          {label}
        </div>
      )}

      {type === "text" ? (
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="outline-none w-full text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Type here..."
        />
      ) : (
        <label className="relative flex items-center gap-2">
          <input
            type="radio"
            name={name}
            checked={checked}
            onChange={() => onChange(value)}
            className="sr-only"
          />
          <span
            className={`border border-gray-300 dark:border-gray-500 rounded-xs py-2 px-5 hover:cursor-pointer transition-colors duration-200 text-sm font-semibold ${
              checked
                ? value === true
                  ? "bg-green-600 dark:bg-green-500 text-white"
                  : "bg-red-500 dark:bg-red-400 text-white"
                : value === true
                  ? "hover:bg-green-600 dark:hover:bg-green-500 hover:text-white text-gray-700 dark:text-gray-300"
                  : "hover:bg-red-500 dark:hover:bg-red-400 hover:text-white text-gray-700 dark:text-gray-300"
            }`}
          >
            {radioLabel}
          </span>
        </label>
      )}
    </article>
  );
}
