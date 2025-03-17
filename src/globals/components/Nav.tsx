import { type ReactElement } from "react";
import { Menu } from "lucide-react";

export default function Nav(): ReactElement {
  return (
    <nav className="font-jersey fixed left-0 right-0 top-0 z-50 h-fit">
      {/* Navigation Content */}
      <div className="absolute left-0 top-0 flex w-full items-center justify-between px-6 py-5 text-[var(--primary-white)] md:px-8 md:py-8">
        <Menu className="md:hidden" size={36} />
        <h2 className="font-baloo hidden text-4xl font-bold hover:cursor-pointer md:block md:text-3xl">
          MathPath
        </h2>
        <div className="hidden items-center justify-center text-2xl md:flex md:gap-8 lg:gap-16 lg:text-3xl">
          <button className="opacity-80 hover:scale-105 hover:cursor-pointer hover:opacity-100">
            Features
          </button>
          <button className="opacity-80 hover:scale-105 hover:cursor-pointer hover:opacity-100">
            About
          </button>
          <button className="opacity-80 hover:scale-105 hover:cursor-pointer hover:opacity-100">
            Members
          </button>
          <button className="opacity-80 hover:scale-105 hover:cursor-pointer hover:opacity-100">
            Download
          </button>
        </div>
        <button className="rounded-2xl md:border-2 md:border-[var(--primary-white)] md:px-3 md:py-1 md:hover:scale-105 md:hover:cursor-pointer lg:ml-12">
          <p className="text-3xl">Login</p>
        </button>
      </div>
    </nav>
  );
}
