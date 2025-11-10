import { type ReactElement } from "react";
import { Theme, useThemeContext } from "../../../contexts/theme/theme.context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function UserPreferencesCard(): ReactElement {
  const { theme, setTheme } = useThemeContext();

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex gap-2">
            {["light", "dark", "auto"].map((themeOption) => (
              <Button
                key={themeOption}
                onClick={() => handleThemeChange(themeOption as Theme)}
                variant={theme === themeOption ? "default" : "outline"}
                className="capitalize"
              >
                {themeOption}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
