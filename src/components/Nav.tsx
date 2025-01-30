import { type ReactElement } from "react";

export default function Nav(): ReactElement {
  return (
    <nav className="w-full bg-[var(--color-green-primary)] font-baloo font-bold h-20 flex items-center justify-between px-40 fixed top-0 z-10">
      <ul className="flex gap-24 text-2xl text-white items-center">
        <li className="transition-transform duration-200 hover:scale-105 cursor-pointer">MATHPATH</li>
        <li className="transition-transform duration-200 hover:scale-105 cursor-pointer">ABOUT</li>
        <li className="transition-transform duration-200 hover:scale-105 cursor-pointer">DOWNLOAD</li>
      </ul>

      <button className="bg-[var(--color-yellow)] border rounded-3xl py-2 px-8 hover:scale-105 cursor-pointer transition-transform duration-200">
        <p className="text-xl">LOG IN</p>
      </button>
    </nav>
  );
}
