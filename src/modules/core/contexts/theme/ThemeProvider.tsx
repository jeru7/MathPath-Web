import { ReactNode, useEffect, useState } from "react";
import { Theme, ThemeContext } from "./theme.context";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export default function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get saved theme (light, dark, auto)
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    return savedTheme || defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (themeToApply: Theme) => {
      // Determine actual theme based on system preference if 'auto'
      const actualTheme =
        themeToApply === "auto"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : themeToApply;

      console.log("🎨 Applying theme:", {
        themeToApply,
        actualTheme,
        savedTheme: localStorage.getItem("theme"),
      });

      // Remove both just to be safe
      root.classList.remove("light", "dark");
      root.classList.add(actualTheme);

      setResolvedTheme(actualTheme);

      // Only persist if not auto
      if (themeToApply !== "auto") {
        localStorage.setItem("theme", themeToApply);
      } else {
        localStorage.removeItem("theme");
      }
    };

    applyTheme(theme);

    // Listen for system theme changes when auto mode is on
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("auto");

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      console.log("🔄 setTheme called with:", newTheme);
      setTheme(newTheme);
    },
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
