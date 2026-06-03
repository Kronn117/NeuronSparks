import { useTheme } from "@/context/ThemeContext";
import colors from "@/constants/colors";

/**
 * Returns the design tokens for the current color scheme.
 * Reads from ThemeContext (reactive, works on web + native).
 * Defaults to dark (cyberpunk) palette.
 */
export function useColors() {
  const { theme } = useTheme();
  const palette =
    theme === "dark" && "dark" in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;
  return { ...palette, radius: colors.radius };
}
