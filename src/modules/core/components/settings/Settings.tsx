import { type ReactElement, useState } from "react";
import { User } from "../../types/user.type";

export type SettingsProps = {
  user: User;
  isLoading: boolean;
  accountSettingsCard: ReactElement;
  changePasswordCard: ReactElement;
  userPreferencesCard: ReactElement;
};

export default function Settings({
  user,
  isLoading,
  accountSettingsCard,
  changePasswordCard,
  userPreferencesCard,
}: SettingsProps): ReactElement {
  const [activeSection, setActiveSection] = useState("account");

  if (isLoading || !user) {
    return (
      <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-gray-50 dark:bg-gray-900 p-2">
        <div>Loading settings...</div>
      </main>
    );
  }

  const settingsSections = [
    { id: "account", label: "Account Settings" },
    { id: "password", label: "Change Password" },
    { id: "preferences", label: "Preferences" },
  ];

  return (
    <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-inherit dark:bg-gray-900 p-2">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h3>
      </header>

      <div className="flex flex-col lg:flex-row gap-2">
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="bg-white dark:bg-gray-800 rounded-sm shadow-sm p-4">
            <ul className="space-y-2">
              {settingsSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-l-4 border-green-500 dark:border-green-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex-1">
          {activeSection === "account" && accountSettingsCard}
          {activeSection === "password" && changePasswordCard}
          {activeSection === "preferences" && userPreferencesCard}
        </div>
      </div>
    </main>
  );
}
