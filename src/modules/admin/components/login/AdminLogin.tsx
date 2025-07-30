import { useState, type ReactElement } from "react";

export default function AdminLogin(): ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <main className="font-plexMono flex h-screen flex-col items-center justify-start gap-8 bg-[var(--color-black-main)] p-4 py-32 md:justify-center md:py-4">
      <div className=" flex flex-col text-center text-white">
        <h1 className="text-2xl">MathPath</h1>
        <h4 className="text-2xl">Admin</h4>
      </div>
      <form
        className="border-1 flex h-fit w-full flex-col gap-4 border-[var(--color-gray-main)] bg-[var(--color-black-secondary)] p-4 sm:w-[400px]"
        onSubmit={handleSignIn}
      >
        <div className="flex flex-col gap-1">
          <label className="text-white">Email</label>
          <input
            className="rounded-sm border-[var(--color-gray-main)] bg-[var(--color-gray-main)] px-3 py-2 text-[12px] text-white focus:ring-0"
            type="email"
            value={email}
            placeholder="Enter Email here..."
            onChange={handleEmailChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white">Password</label>
          <input
            className="rounded-sm border-[var(--color-gray-main)] bg-[var(--color-gray-main)] px-3 py-2 text-[12px] text-white focus:ring-0"
            type="password"
            value={password}
            placeholder="Enter Password here..."
            onChange={handlePasswordChange}
          />
        </div>
        <button
          className="hover:scale-101 bg-[var(--color-green-secondary)] px-4 py-2 hover:cursor-pointer"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
