import { useState, useRef, type ReactElement } from "react";

export default function VerifyCode(): ReactElement {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // numbers lang
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevIndex = index - 1;
      inputsRef.current[prevIndex]?.focus();
      const newCode = [...code];
      newCode[prevIndex] = "";
      setCode(newCode);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Entered code:", code.join(""));
  };

  return (
    <main className="transition-all duration-200 flex absolute top-80 h-fit w-[90%] min-w-[300px] max-w-sm flex-col rounded-xl border-2 border-white/20 bg-white/10 py-4 px-8 shadow-lg backdrop-blur-lg sm:max-w-md md:max-w-lg">
      <h3 className="text-white font-bold text-xl text-center mb-4">
        Enter Verification Code
      </h3>
      <p className="text-gray-100 text-center mb-6">
        Please enter the 6-digit code sent to your email.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6"
        autoComplete="off"
      >
        <div className="flex gap-2 justify-center">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-12 h-12 text-center text-lg rounded border-2 border-white/50 bg-white/10 text-white focus:outline-none focus:border-[var(--primary-yellow)]"
            />
          ))}
        </div>

        <button
          type="submit"
          className="text-white text-base font-bold hover:bg-[var(--primary-yellow)]/100 transition-colors duration-200 rounded-lg bg-[var(--primary-yellow)]/80 py-2 px-6"
        >
          Verify
        </button>
      </form>
    </main>
  );
}
