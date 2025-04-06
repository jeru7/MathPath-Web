import { type ReactElement } from "react";
import { User, Users, FileText, LayoutDashboard } from "lucide-react";

export default function Nav(): ReactElement {
  return (
    <nav className="w-18 fixed bottom-0 left-0 z-10 flex h-screen flex-col items-center justify-between rounded-r-lg bg-[var(--tertiary-green)] py-4 text-white drop-shadow-lg hover:w-64">
      <div className="flex flex-col gap-8">
        <div>
          <LayoutDashboard className="h-10 w-10"/>
        </div>
        <div>
          <User className="h-10 w-10"/>
        </div>
        <div>
          <Users className="h-10 w-10"/>
        </div>
        <div>
          <FileText className="h-10 w-10"/>
        </div>
      </div>
      <div className="border-1 h-12 w-12 rounded-full"></div>
    </nav>
  );
}
