/**
 * Dashboard Page Wrapper
 * Wraps DashboardView with AppLayout, Header and all necessary providers
 */

import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { AvatarMenu } from "@/components/layout/AvatarMenu";
import { DashboardView } from "./DashboardView";

export function DashboardPageWrapper() {
  return (
    <AppLayout
      header={<Header avatarMenu={<AvatarMenu />} />}
      showSubscriptionBanner={true}
    >
      <DashboardView />
    </AppLayout>
  );
}
