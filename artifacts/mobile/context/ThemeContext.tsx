import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Appearance, Platform } from "react-native";

const THEME_KEY = "@neuronsparks/theme_v1";

interface ThemeContextType {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      const t = (saved as "light" | "dark" | null) ?? "dark";
      setThemeState(t);
      if (Platform.OS !== "web") Appearance.setColorScheme(t);
    });
  }, []);

  const setTheme = useCallback(async (t: "light" | "dark") => {
    setThemeState(t);
    if (Platform.OS !== "web") Appearance.setColorScheme(t);
    await AsyncStorage.setItem(THEME_KEY, t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
