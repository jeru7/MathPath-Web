import { type ReactElement, useState } from "react";
import { Theme, useThemeContext } from "../../contexts/theme/theme.context";

export default function UserPreferencesCard(): ReactElement {
  const { theme, setTheme, resolvedTheme } = useThemeContext();
  const [preferences, setPreferences] = useState({
    language: "english",
    soundEffects: true,
  });

  console.log("🔍 Theme Debug:", { theme, resolvedTheme });

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);

    console.log("Theme changed to:", newTheme);

    // TODO: save user theme to user db
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm p-6 transition-colors duration-200">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">
        User Preferences
      </h4>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <div className="flex gap-2">
            {["light", "dark", "auto"].map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => handleThemeChange(themeOption as Theme)}
                className={`px-4 py-2 rounded border text-sm capitalize transition-colors duration-200 ${
                  theme === themeOption
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-500 dark:border-green-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {themeOption}
              </button>
            ))}
          </div>
        </div>

        {/* Rest of your component remains the same */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) =>
              setPreferences({ ...preferences, language: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 max-w-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="english">English</option>
            <option value="tagalog">Tagalog</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
          <div>
            <p className="font-medium text-sm text-gray-900 dark:text-white">
              Sound Effects
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enable sound effects on website
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.soundEffects}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  soundEffects: !preferences.soundEffects,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 dark:peer-checked:bg-green-700 dark:bg-gray-700"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
