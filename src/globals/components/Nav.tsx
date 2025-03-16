import { type ReactElement } from "react";
import { Menu } from "lucide-react";

export default function Nav(): ReactElement {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-fit">
      {/* Navigation Content */}
      <div className="absolute left-0 top-0 flex w-full items-center justify-between px-6 py-5 text-[var(--primary-white)]">
        <Menu size={32} />
        <p className="font-jersey text-2xl">Login</p>
      </div>
    </nav>
  );
}
