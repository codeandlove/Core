/**
 * Landing Page Wrapper with Theme Support
 * Wraps landing page content with ThemeProvider for client-side theme management
 */

import { ThemeProvider } from "@/contexts/ThemeContext";
import { LandingHeader } from "./LandingHeader";
import type { ReactNode } from "react";

interface LandingPageWrapperProps {
  children: ReactNode;
}

export function LandingPageWrapper({ children }: LandingPageWrapperProps) {
  return (
    <ThemeProvider>
      <LandingHeader />
      {children}
    </ThemeProvider>
  );
}
