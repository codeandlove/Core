/**
 * Dashboard sidebar navigation component.
 */
import type { NavigationItem } from "@/types/navigation";
import { isActiveRoute } from "@/lib/navigation";
import { Home } from "lucide-react";

interface DashboardSidebarProps {
  items: NavigationItem[];
  currentPath?: string;
  isCollapsed?: boolean;
  isMobile?: boolean;
  onNavigate?: (item: NavigationItem) => void;
  onClose?: () => void;
}

export function DashboardSidebar({
  items,
  currentPath = "",
  isCollapsed = false,
  isMobile = false,
  onNavigate,
  onClose,
}: DashboardSidebarProps) {
  const handleItemClick = (item: NavigationItem) => {
    onNavigate?.(item);
    if (isMobile) {
      onClose?.();
    }
  };

  const sidebarClasses = isMobile
    ? "fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform duration-300"
    : "sticky top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background";

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={`${sidebarClasses} ${isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"}`}
        aria-label="Dashboard navigation"
      >
        <nav className="flex h-full flex-col p-4">
          <ul className="space-y-2" role="list">
            {items.map((item) => {
              const isActive = isActiveRoute(item.href, currentPath);
              const Icon = item.icon || Home;

              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      if (item.disabled) {
                        event.preventDefault();
                        return;
                      }
                      handleItemClick(item);
                    }}
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                      ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}
                      ${item.disabled ? "pointer-events-none opacity-50" : ""}
                    `}
                    aria-current={isActive ? "page" : undefined}
                    aria-disabled={item.disabled}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

