import { ReactNode, useEffect, useState } from "react";
import { Theme, ThemeContext } from "./theme.context";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
};

export default function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    return savedTheme || defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (themeToApply: Theme) => {
      const actualTheme =
        themeToApply === "auto"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : themeToApply;

      root.classList.remove("light", "dark");
      root.classList.add(actualTheme);

      setResolvedTheme(actualTheme);

      // persist if not auto
      if (themeToApply !== "auto") {
        localStorage.setItem("theme", themeToApply);
      } else {
        localStorage.removeItem("theme");
      }
    };

    applyTheme(theme);

    // listen for system theme changes in auto
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
      setTheme(newTheme);
    },
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
