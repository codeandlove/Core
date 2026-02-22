/**
 * Checkout Pages Theme Wrapper
 * Wraps checkout pages with ThemeProvider for dark mode support
 */
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { ReactNode } from "react";
interface CheckoutPageThemeWrapperProps {
  children: ReactNode;
}
export function CheckoutPageThemeWrapper({
  children,
}: CheckoutPageThemeWrapperProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
