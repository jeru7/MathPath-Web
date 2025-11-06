import { type ReactElement, useState } from "react";
import { Theme, useThemeContext } from "../../../contexts/theme/theme.context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function UserPreferencesCard(): ReactElement {
  const { theme, setTheme } = useThemeContext();
  const [preferences, setPreferences] = useState({
    language: "english",
    soundEffects: true,
  });

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);

    console.log("Theme changed to:", newTheme);

    // TODO: language pref
    // TODO: sfx pref
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

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={preferences.language}
            onValueChange={(value) =>
              setPreferences({ ...preferences, language: value })
            }
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="tagalog">Tagalog</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-base">Sound Effects</Label>
            <p className="text-sm text-muted-foreground">
              Enable sound effects on website
            </p>
          </div>
          <Switch
            checked={preferences.soundEffects}
            onCheckedChange={(checked) =>
              setPreferences({
                ...preferences,
                soundEffects: checked,
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
