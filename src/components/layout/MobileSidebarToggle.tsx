/**
 * Mobile sidebar toggle button.
 */
import { Menu, X } from "lucide-react";

interface MobileSidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileSidebarToggle({
  isOpen,
  onToggle,
}: MobileSidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary lg:hidden"
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      aria-expanded={isOpen}
      aria-controls="dashboard-sidebar"
    >
      {isOpen ? (
        <X className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Menu className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
}

