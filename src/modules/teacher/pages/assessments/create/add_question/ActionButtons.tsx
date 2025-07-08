import { type ReactElement } from "react";

type ActionButtonsProps = {
  onAddQuestion: () => void;
};
export default function ActionButtons({
  onAddQuestion,
}: ActionButtonsProps): ReactElement {
  return (
    <div className="flex items-center justify-between gap-2">
      {/* Cancel */}
      <button
        className="flex items-center justify-center py-2 px-5 rounded-sm hover:cursor-pointer opacity-80 hover:opacity-100 transition-all duration-200"
        type="button"
      >
        <p className="underline">Cancel</p>
      </button>
      {/* Add */}
      <button
        className="flex items-center justify-center py-2 px-5 rounded-sm bg-[var(--primary-green)] text-white opacity-80 hover:opacity-100 hover:cursor-pointer transition-all duration-200"
        type="button"
        onClick={onAddQuestion}
      >
        <p>Add</p>
      </button>
    </div>
  );
}
