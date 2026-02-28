/**
 * Profile navigation sidebar
 * Left-side nav for all /profile/* pages
 */
import {
  User,
  CreditCard,
  Receipt,
  Bell,
  Trash2,
  LayoutDashboard,
  ChevronLeft,
} from "lucide-react";

interface ProfileNavProps {
  currentPath: string;
}

const NAV_ITEMS = [
  { id: "info", label: "Informacje", href: "/profile/info", icon: User },
  {
    id: "subscription",
    label: "Subskrypcja",
    href: "/profile/subscription",
    icon: CreditCard,
  },
  {
    id: "payments",
    label: "Historia wpłat",
    href: "/profile/payments",
    icon: Receipt,
  },
  { id: "consents", label: "Zgody", href: "/profile/consents", icon: Bell },
  {
    id: "delete-account",
    label: "Usuń konto",
    href: "/profile/delete-account",
    icon: Trash2,
  },
] as const;

export function ProfileNav({ currentPath }: ProfileNavProps) {
  return (
    <aside
      className="sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-background"
      aria-label="Nawigacja profilu"
    >
      <nav className="flex h-full flex-col p-4">
        {/* Back to dashboard */}
        <a
          href="/dashboard"
          className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Wróć do aplikacji</span>
        </a>

        {/* Divider + section label */}
        <div className="mb-2 border-t pt-3">
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Ustawienia konta
          </p>
        </div>

        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
