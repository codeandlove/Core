/**
 * Main application header component
 * Used in authenticated views (Dashboard, etc.)
 */

import type { ReactNode } from "react";

interface HeaderProps {
  avatarMenu?: ReactNode;
}

export function Header({ avatarMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">⚡</span>
            <span className="hidden font-bold sm:inline-block">Core</span>
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Avatar menu */}
          {avatarMenu}
        </div>
      </div>
    </header>
  );
}
