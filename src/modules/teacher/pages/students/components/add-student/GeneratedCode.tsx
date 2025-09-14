import { type ReactElement } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { IoClose } from "react-icons/io5";

type GeneratedCodeProps = {
  code: string;
  handleBack: () => void;
};

export default function GeneratedCode({
  code,
  handleBack,
}: GeneratedCodeProps): ReactElement {
  return (
    <main className="relative flex flex-col items-center gap-8 rounded-md bg-white p-6 px-12 shadow-md">
      <button
        className="absolute right-4 top-4 hover:scale-105 hover:cursor-pointer"
        onClick={handleBack}
      >
        <IoClose />
      </button>

      <h3 className="text-lg font-semibold">Registration Code</h3>

      {/* qr */}
      <QRCodeCanvas value={code} size={200} />

      {/* code */}
      <div className="flex items-center justify-center gap-2 w-full">
        {code.split("").map((num) => (
          <p className="bg-gray-200/30 font-bold text-xl p-2 flex flex-1 items-center justify-center rounded-sm border-2 border-gray-400/50">
            {num}
          </p>
        ))}
      </div>

      <p className="text-xs text-gray-300 font-bold">
        Expires on Sep. 27, 2025 at 12:07am.
      </p>
    </main>
  );
}
