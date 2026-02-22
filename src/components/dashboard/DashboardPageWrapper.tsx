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
              <MobileSidebarToggle
                isOpen={!isCollapsed}
                onToggle={toggle}
              />
            ) : undefined
          }
          avatarMenu={<AvatarMenu />}
        />
      }
      showSubscriptionBanner={true}
      showSidebar={true}
      sidebarContent={sidebar}
    >
      <DashboardView />
    </AppLayout>
  );
}
