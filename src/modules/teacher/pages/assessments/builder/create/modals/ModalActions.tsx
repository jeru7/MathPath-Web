import { type ReactElement } from "react";

type ActionButtonsProps = {
  onAddContent: () => void;
  onCancelClick: () => void;
};
export default function ModalActions({
  onAddContent,
  onCancelClick,
}: ActionButtonsProps): ReactElement {
  return (
    <div className="flex items-center justify-between gap-2">
      {/* cancel */}
      <button
        className="flex items-center justify-center py-2 px-5 rounded-sm hover:cursor-pointer opacity-80 hover:opacity-100 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        type="button"
        onClick={onCancelClick}
      >
        <p className="underline">Cancel</p>
      </button>
      {/* add */}
      <button
        className="flex items-center justify-center py-2 px-5 rounded-sm bg-green-600 dark:bg-green-500 text-white opacity-80 hover:opacity-100 hover:cursor-pointer transition-all duration-200"
        type="button"
        onClick={onAddContent}
      >
        <p>Add</p>
      </button>
    </div>
  );
}
