/**
 * Landing Header Component with Theme Toggle
 * Used on public pages (landing, auth, etc.)
 */

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function LandingHeader() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold">Core Starter</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a href="/auth/login" className="text-sm font-medium hover:underline">
            Zaloguj się
          </a>
          <a href="/auth/register">
            <Button>Rozpocznij trial</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
