import { type ReactElement, useState } from "react";
import { User } from "../../types/user.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type SettingsProps = {
  user: User;
  isLoading: boolean;
  accountSettingsCard: ReactElement;
  changePasswordCard: ReactElement;
  userPreferencesCard: ReactElement;
  reportsCard?: ReactElement;
};

export default function Settings({
  user,
  isLoading,
  accountSettingsCard,
  changePasswordCard,
  userPreferencesCard,
  reportsCard,
}: SettingsProps): ReactElement {
  const [activeSection, setActiveSection] = useState("account");

  if (isLoading || !user) {
    return (
      <main className="flex flex-col min-h-screen h-fit w-full gap-2 p-2">
        <div>Loading settings...</div>
      </main>
    );
  }

  const isTeacherOrAdmin = user.role === "teacher" || user.role === "admin";

  const settingsSections = [
    { id: "account", label: "Account Settings" },
    { id: "password", label: "Change Password" },
    { id: "preferences", label: "Preferences" },
    ...(isTeacherOrAdmin ? [{ id: "reports", label: "Data Report" }] : []),
  ];

  return (
    <main className="flex flex-col min-h-screen h-fit w-full gap-2 p-2">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold">Settings</h3>
      </header>

      <div className="flex flex-col lg:flex-row gap-2">
        <aside className="lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <nav>
                <ul className="space-y-2">
                  {settingsSections.map((section) => (
                    <li key={section.id}>
                      <Button
                        variant={
                          activeSection === section.id ? "default" : "ghost"
                        }
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full justify-start text-left ${activeSection === section.id ? "bg-primary text-primary-foreground" : ""}`}
                      >
                        {section.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1">
          {activeSection === "account" && accountSettingsCard}
          {activeSection === "password" && changePasswordCard}
          {activeSection === "preferences" && userPreferencesCard}
          {activeSection === "reports" && reportsCard}
        </div>
      </div>
    </main>
  );
}
