/**
 * Auth Pages Theme Wrapper
 * Wraps auth pages with ThemeProvider for dark mode support
 * Note: Auth pages don't have header with ThemeToggle by design
 */
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { ReactNode } from "react";
interface AuthPageThemeWrapperProps {
  children: ReactNode;
}
export function AuthPageThemeWrapper({ children }: AuthPageThemeWrapperProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
