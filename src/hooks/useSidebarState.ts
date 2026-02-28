/**
 * Hook for managing sidebar state with localStorage persistence.
 */
import { useEffect, useState } from "react";

const STORAGE_KEY = "sidebar-collapsed";
const MOBILE_BREAKPOINT = 1024;

export function useSidebarState(defaultCollapsed = false) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === "true");
      }
    } catch (error) {
      console.error("Failed to load sidebar state:", error);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggle = () => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(newValue));
      } catch (error) {
        console.error("Failed to save sidebar state:", error);
      }
      return newValue;
    });
  };

  return {
    isCollapsed,
    isMobile,
    toggle,
    setIsCollapsed,
  };
}
