/**
 * Dashboard Page Wrapper
 * Wraps DashboardView with AppLayout, Header and all necessary providers
 */

import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { AvatarMenu } from "@/components/layout/AvatarMenu";
import { DashboardView } from "./DashboardView";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { MobileSidebarToggle } from "@/components/layout/MobileSidebarToggle";
import { useSidebarState } from "@/hooks/useSidebarState";
import { getDefaultDashboardNavigation } from "@/lib/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Auth guard — rendered INSIDE AppLayout so AuthProvider is available.
 * DashboardPageWrapper itself must NOT call useAuth().
 */
function DashboardContent() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <DashboardView />;
}

export function DashboardPageWrapper() {
  const { isCollapsed, isMobile, toggle } = useSidebarState();
  const navigationItems = getDefaultDashboardNavigation();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const sidebar = (
    <DashboardSidebar
      items={navigationItems}
      currentPath={currentPath}
      isCollapsed={isCollapsed}
      isMobile={isMobile}
      onClose={toggle}
    />
  );

  return (
    <AppLayout
      header={
        <Header
          leftContent={
            isMobile ? (
              <MobileSidebarToggle isOpen={!isCollapsed} onToggle={toggle} />
            ) : undefined
          }
          avatarMenu={<AvatarMenu />}
        />
      }
      showSubscriptionBanner={true}
      showSidebar={true}
      sidebarContent={sidebar}
    >
      <DashboardContent />
    </AppLayout>
  );
}
