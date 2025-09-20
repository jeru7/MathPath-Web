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
    <main className="relative flex flex-col items-center gap-4 rounded-md bg-white p-6 px-12 shadow-md">
      <button
        className="absolute right-4 top-4 hover:scale-105 hover:cursor-pointer"
        onClick={handleBack}
      >
        <IoClose />
      </button>

      <h3 className="text-lg font-semibold">Registration Code</h3>

      {/* qr */}
      <QRCodeCanvas value={code.link} size={200} />

      <p className="text-xs text-gray-300 font-bold">
        Max Uses: {code.maxUses}
      </p>

      {/* code */}
      <div
        className="flex items-center justify-center gap-2 w-full opacity-80 hover:cursor-pointer hover:opacity-100 transition-opacity duration-200"
        onClick={() => {
          navigator.clipboard.writeText(code.code);
          toast.success("Copied to clipboard");
        }}
      >
        {code.code.split("").map((num) => (
          <p className="bg-gray-200/30 font-bold text-xl p-2 flex flex-1 items-center justify-center rounded-sm border-2 border-gray-400/50">
            {num}
          </p>
        ))}
      </div>

      <p className="text-xs text-gray-300 font-bold">
        Expires on{" "}
        {format(
          formatToPhDate(code.expiresAt.toString()),
          "MMMM d, yyyy 'at' hh:mm a",
        )}
      </p>

      <button
        type="button"
        onClick={() => handleDelete(code.id)}
        className={`group p-2 rounded-full border border-red-400 w-full bg-white hover:bg-red-400 hover:border-white hover:cursor-pointer transition-colors duration-200`}
      >
        <p className="text-red-400 group-hover:text-white">Delete</p>
      </button>
    </main>
  );
}
