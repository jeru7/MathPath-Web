import { type ReactElement } from "react";

type FormButtonsProps = {
  handleBack: () => void;
  text: string;
  disabled: boolean;
};

export default function FormButtons({
  handleBack,
  text,
  disabled,
}: FormButtonsProps): ReactElement {
  return (
    <>
      <div className="flex w-full justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="opacity-80 transition-opacity duration-200 hover:cursor-pointer hover:opacity-100"
        >
          <p className="underline">Cancel</p>
        </button>
        <button
          type="submit"
          disabled={disabled}
          className="bg-[var(--primary-green)] opacity-80 rounded-sm px-5 py-2 text-white hover:cursor-pointer hover:opacity-100 transition-opacity duration-200"
        >
          {text}
        </button>
      </div>
    </>
  );
}
