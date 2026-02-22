/**
 * Navigation types for dashboard sidebar.
 */
import type { ComponentType } from "react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  disabled?: boolean;
  badge?: string | number;
  external?: boolean;
}

export interface SidebarConfig {
  items: NavigationItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

