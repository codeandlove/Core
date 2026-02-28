/**
 * Avatar menu component with dropdown
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AvatarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const displayName = user.email?.split("@")[0] ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    setIsOpen(false);
    void signOut();
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initials}
        </div>
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Zamknij menu"
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-md border bg-popover p-2 shadow-lg">
            {/* User info */}
            <div className="border-b px-3 py-3">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              {profile && (
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {profile.subscription_status}
                  </span>
                </div>
              )}
            </div>

            {/* Menu items */}
            <div className="py-1">
              <a
                href="/profile/info"
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" aria-hidden="true" />
                <span>Profil</span>
              </a>
            </div>

            {/* Logout */}
            <div className="border-t pt-1">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>Wyloguj</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
