import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette, Sparkles, Heart, Snowflake, Sun, Leaf } from "lucide-react";

type ColorScheme = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  cssVariables: Record<string, string>;
};

const colorSchemes: ColorScheme[] = [
  {
    id: "default",
    name: "Default",
    description: "Classic blue theme",
    icon: <Palette className="h-4 w-4" />,
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#8b5cf6",
      background: "#ffffff"
    },
    cssVariables: {
      "--primary": "221.2 83.2% 53.3%",
      "--secondary": "210 40% 62%",
      "--accent": "262.1 83.3% 57.8%",
      "--background": "0 0% 100%",
      "--foreground": "222.2 84% 4.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "222.2 84% 4.9%",
      "--muted": "210 40% 98%",
      "--muted-foreground": "215.4 16.3% 46.9%",
    }
  },
  {
    id: "valentine",
    name: "Valentine's Day",
    description: "Romantic pink and red theme",
    icon: <Heart className="h-4 w-4" />,
    colors: {
      primary: "#ec4899",
      secondary: "#f97316",
      accent: "#dc2626",
      background: "#fef7f7"
    },
    cssVariables: {
      "--primary": "330 81% 60%",
      "--secondary": "24.6 95% 53.1%",
      "--accent": "0 84% 60%",
      "--background": "0 20% 98%",
      "--foreground": "0 84% 15%",
      "--card": "0 20% 98%",
      "--card-foreground": "0 84% 15%",
      "--muted": "330 40% 96%",
      "--muted-foreground": "330 20% 40%",
    }
  },
  {
    id: "christmas",
    name: "Christmas",
    description: "Festive red and green theme",
    icon: <Sparkles className="h-4 w-4" />,
    colors: {
      primary: "#dc2626",
      secondary: "#16a34a",
      accent: "#eab308",
      background: "#fefefe"
    },
    cssVariables: {
      "--primary": "0 84% 60%",
      "--secondary": "142.1 76.2% 36.3%",
      "--accent": "47.9 95.8% 53.1%",
      "--background": "0 0% 99%",
      "--foreground": "0 84% 15%",
      "--card": "0 0% 99%",
      "--card-foreground": "0 84% 15%",
      "--muted": "0 40% 96%",
      "--muted-foreground": "0 20% 40%",
    }
  },
  {
    id: "winter",
    name: "Winter Holiday",
    description: "Cool blues and whites",
    icon: <Snowflake className="h-4 w-4" />,
    colors: {
      primary: "#0ea5e9",
      secondary: "#6366f1",
      accent: "#8b5cf6",
      background: "#f8fafc"
    },
    cssVariables: {
      "--primary": "199.1 89.1% 48.4%",
      "--secondary": "238.7 83.5% 66.7%",
      "--accent": "262.1 83.3% 57.8%",
      "--background": "210 40% 98%",
      "--foreground": "222.2 84% 4.9%",
      "--card": "210 40% 98%",
      "--card-foreground": "222.2 84% 4.9%",
      "--muted": "210 40% 95%",
      "--muted-foreground": "215.4 16.3% 46.9%",
    }
  },
  {
    id: "summer",
    name: "Summer",
    description: "Bright and sunny colors",
    icon: <Sun className="h-4 w-4" />,
    colors: {
      primary: "#f59e0b",
      secondary: "#10b981",
      accent: "#ef4444",
      background: "#fffbeb"
    },
    cssVariables: {
      "--primary": "43.3 96.4% 56.3%",
      "--secondary": "160.1 84.1% 39.4%",
      "--accent": "0 84% 60%",
      "--background": "48 100% 96%",
      "--foreground": "43.3 96.4% 15%",
      "--card": "48 100% 96%",
      "--card-foreground": "43.3 96.4% 15%",
      "--muted": "43 40% 92%",
      "--muted-foreground": "43 20% 40%",
    }
  },
  {
    id: "spring",
    name: "Spring",
    description: "Fresh green and nature colors",
    icon: <Leaf className="h-4 w-4" />,
    colors: {
      primary: "#16a34a",
      secondary: "#059669",
      accent: "#84cc16",
      background: "#f0fdf4"
    },
    cssVariables: {
      "--primary": "142.1 76.2% 36.3%",
      "--secondary": "160.1 84.1% 39.4%",
      "--accent": "84 81% 44%",
      "--background": "138 76% 97%",
      "--foreground": "142.1 76.2% 15%",
      "--card": "138 76% 97%",
      "--card-foreground": "142.1 76.2% 15%",
      "--muted": "138 40% 93%",
      "--muted-foreground": "138 20% 40%",
    }
  }
];

export default function ColorSchemeSelector() {
  const [currentScheme, setCurrentScheme] = useState("default");

  useEffect(() => {
    // Load saved color scheme from localStorage
    const savedScheme = localStorage.getItem("colorScheme");
    if (savedScheme && colorSchemes.find(s => s.id === savedScheme)) {
      setCurrentScheme(savedScheme);
      applyColorScheme(savedScheme);
    }
  }, []);

  const applyColorScheme = (schemeId: string) => {
    const scheme = colorSchemes.find(s => s.id === schemeId);
    if (!scheme) return;

    const root = document.documentElement;
    
    // Apply CSS variables
    Object.entries(scheme.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Save to localStorage
    localStorage.setItem("colorScheme", schemeId);
    setCurrentScheme(schemeId);
  };

  const resetToDefault = () => {
    applyColorScheme("default");
  };

  const currentSchemeData = colorSchemes.find(s => s.id === currentScheme);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Color Scheme
        </CardTitle>
        <CardDescription>
          Choose a color theme for celebrations and special occasions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Scheme Display */}
        {currentSchemeData && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {currentSchemeData.icon}
                <span className="font-medium">{currentSchemeData.name}</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {currentSchemeData.description}
            </p>
            <div className="flex gap-2">
              {Object.entries(currentSchemeData.colors).map(([name, color]) => (
                <div key={name} className="text-center">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-xs mt-1 capitalize">{name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheme Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Theme</label>
          <Select value={currentScheme} onValueChange={applyColorScheme}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorSchemes.map((scheme) => (
                <SelectItem key={scheme.id} value={scheme.id}>
                  <div className="flex items-center gap-2">
                    {scheme.icon}
                    <span>{scheme.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Scheme Preview Grid */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Available Themes</label>
          <div className="grid grid-cols-2 gap-3">
            {colorSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                  currentScheme === scheme.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => applyColorScheme(scheme.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {scheme.icon}
                  <span className="text-sm font-medium">{scheme.name}</span>
                  {currentScheme === scheme.id && (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  )}
                </div>
                <div className="flex gap-1 mb-2">
                  {Object.values(scheme.colors).slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-sm border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {scheme.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        {currentScheme !== "default" && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={resetToDefault}
              className="w-full"
            >
              Reset to Default Theme
            </Button>
          </div>
        )}

        {/* Usage Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Tip:</strong> Color schemes are perfect for seasonal celebrations!</p>
          <p>🎄 Use Christmas theme during holidays</p>
          <p>💝 Switch to Valentine's theme in February</p>
          <p>☀️ Try Summer theme for bright promotions</p>
        </div>
      </CardContent>
    </Card>
  );
}