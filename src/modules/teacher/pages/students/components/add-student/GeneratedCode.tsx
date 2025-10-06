import { type ReactElement } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { IoClose } from "react-icons/io5";
import { RegistrationCode } from "../../../../../core/types/registration-code/registration-code.type";
import { format } from "date-fns";
import { formatToPhDate } from "../../../../../core/utils/date.util";
import { toast } from "react-toastify";

type GeneratedCodeProps = {
  code: RegistrationCode;
  handleBack: () => void;
  handleDelete: (code: string) => void;
};

export default function GeneratedCode({
  code,
  handleBack,
  handleDelete,
}: GeneratedCodeProps): ReactElement {
  console.log("CODE: ", code);
  return (
    <main className="relative flex flex-col items-center gap-4 rounded-md bg-white dark:bg-gray-800 p-6 px-12 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <button
        className="absolute right-4 top-4 hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
        onClick={handleBack}
      >
        <IoClose size={24} />
      </button>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
        Registration Code
      </h3>

      {/* qr */}
      <QRCodeCanvas value={code.link} size={200} />

      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold transition-colors duration-200">
        Max Uses: {code.maxUses}
      </p>

      {/* code */}
      <div
        className="flex items-center justify-center gap-2 w-full opacity-80 hover:cursor-pointer hover:opacity-100 transition-all duration-200"
        onClick={() => {
          navigator.clipboard.writeText(code.code);
          toast.success("Copied to clipboard");
        }}
      >
        {code.code.split("").map((num, index) => (
          <p
            key={index}
            className="bg-gray-100 dark:bg-gray-700 font-bold text-xl p-2 flex flex-1 items-center justify-center rounded-sm border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
          >
            {num}
          </p>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold transition-colors duration-200">
        Expires on{" "}
        {format(
          formatToPhDate(code.expiresAt.toString()),
          "MMMM d, yyyy 'at' hh:mm a",
        )}
      </p>

      <button
        type="button"
        onClick={() => handleDelete(code.id)}
        className="group p-2 rounded-full border border-red-400 dark:border-red-500 w-full bg-white dark:bg-gray-800 hover:bg-red-400 dark:hover:bg-red-500 hover:border-white dark:hover:border-red-500 hover:cursor-pointer transition-all duration-200"
      >
        <p className="text-red-400 dark:text-red-500 group-hover:text-white transition-colors duration-200">
          Delete
        </p>
      </button>
    </main>
  );
}
