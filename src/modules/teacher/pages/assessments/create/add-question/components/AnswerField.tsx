import { type ReactElement } from "react";

type AnswerFieldProps = {
  label?: string;
  type: "text" | "radio";
  name?: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  checked?: boolean;
  radioLabel?: "True" | "False";
};
export default function AnswerField({
  label,
  type,
  value,
  name,
  onChange,
  checked,
  radioLabel,
}: AnswerFieldProps): ReactElement {
  return (
    <article
      className={`flex items-center gap-2  rounded-sm ${
        type === "radio" ? "" : "border border-gray-300 p-2 "
      }`}
    >
      {label && (
        <div className="p-2 border-r border-gray-300 text-[var(--primary-green)] font-bold text-sm">
          {label}
        </div>
      )}

      {type === "text" ? (
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="outline-none w-full text-sm"
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
            className={`border border-gray-300 rounded-xs py-2 px-5 hover:cursor-pointer transition-colors duration-200 text-sm font-semibold ${
              checked
                ? value === true
                  ? "bg-[var(--primary-green)]/80 text-white"
                  : "bg-red-400/80 text-white"
                : value === true
                  ? "hover:bg-[var(--primary-green)]/80 hover:text-white"
                  : "hover:bg-red-400/80 hover:text-white"
            }`}
          >
            {radioLabel}
          </span>
        </label>
      )}
    </article>
  );
}
