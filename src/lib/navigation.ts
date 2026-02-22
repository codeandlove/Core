/**
 * Navigation configuration and utilities.
 */
import type { NavigationItem } from "@/types/navigation";

export function getDefaultDashboardNavigation(): NavigationItem[] {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      id: "coming-soon",
      label: "Coming Soon",
      href: "/coming-soon",
    },
  ];
}

export function isActiveRoute(itemHref: string, currentPath: string): boolean {
  if (itemHref === "/dashboard") {
    return currentPath === "/dashboard" || currentPath === "/dashboard/";
  }

  return currentPath.startsWith(itemHref);
}

